// supabase/functions/stripe/index.ts
// ==========================================================================
// Portal El'Luminar — integração com o Stripe (Fase F6)
//
// Rotas:
//   POST /stripe/intent   → autenticado (JWT do consulente)
//                           cria/atualiza o PaymentIntent com o valor já
//                           descontado (sinal de 30% ou integral)
//   POST /stripe/webhook  → chamado pelo Stripe (assinatura verificada)
//                           confirma o pagamento, queima o cupom e trata
//                           falha/reembolso
//   POST /stripe/refund   → autenticado (admin) reembolso manual
//
// Secrets (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY       sk_live_... ou sk_test_...
//   STRIPE_WEBHOOK_SECRET   whsec_...
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (injetados automaticamente)
// ==========================================================================

import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno&no-check';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SB_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SINAL_PCT = 30;

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-06-20' });
const admin = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
    });
}

// "R$ 1.234,56" -> 1234.56
function precoNum(t?: string | null): number {
    if (!t) return 0;
    const s = String(t).replace(/\s/g, '');
    const limpo = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
    const n = Number(limpo.replace(/[^0-9.]/g, ''));
    return isFinite(n) ? n : 0;
}

function arredondar(n: number): number {
    return Math.round(n * 100) / 100;
}

async function usuarioDoPedido(req: Request) {
    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!jwt) return null;
    const { data } = await admin.auth.getUser(jwt);
    return data?.user ?? null;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

    const rota = new URL(req.url).pathname.split('/').filter(Boolean).pop();

    try {
        if (rota === 'webhook') return await webhook(req);
        if (rota === 'intent') return await intent(req);
        if (rota === 'refund') return await refund(req);
        return json({ erro: 'Rota desconhecida: ' + rota }, 404);
    } catch (e) {
        console.error('[stripe]', e);
        return json({ erro: String((e as Error)?.message || e) }, 500);
    }
});

// --------------------------------------------------------------------------
// /intent — o valor NUNCA vem do navegador: é calculado aqui, a partir do
// preço gravado no banco, com o desconto do cupom validado no servidor.
// --------------------------------------------------------------------------
async function intent(req: Request): Promise<Response> {
    const user = await usuarioDoPedido(req);
    if (!user) return json({ erro: 'Faça login para pagar' }, 401);

    const body = await req.json().catch(() => ({}));
    const bookingId = String(body.booking_id || '');
    const forma = body.forma === 'integral' ? 'integral' : 'sinal';
    const cupom = String(body.cupom || '').trim().toUpperCase();

    const { data: b } = await admin.from('therapist_bookings').select('*').eq('id', bookingId).single();
    if (!b) return json({ erro: 'Agendamento não encontrado' }, 404);
    if (b.consulente_id !== user.id) return json({ erro: 'Este agendamento não é seu' }, 403);
    if (b.pagamento_status === 'pago') return json({ erro: 'Este agendamento já foi pago' }, 409);

    const total = arredondar(Number(b.valor_total) || precoNum(b.servico_preco));
    if (!total || total <= 0) {
        return json({ erro: 'O valor deste atendimento não está definido. Fale com o terapeuta.' }, 422);
    }

    let percentual = 0;
    if (cupom) {
        const { data: v } = await admin.rpc('validar_cupom', { p_codigo: cupom, p_user: user.id });
        const r = Array.isArray(v) ? v[0] : v;
        if (!r || !r.ok) return json({ erro: r?.motivo || 'Cupom inválido' }, 422);
        percentual = Number(r.percentual) || 0;
    }

    const desconto = arredondar(total * percentual / 100);
    const liquido = arredondar(total - desconto);
    const cobrar = forma === 'sinal' ? arredondar(liquido * SINAL_PCT / 100) : liquido;

    if (cobrar < 1) return json({ erro: 'Valor abaixo do mínimo para cobrança' }, 422);

    const dados = {
        amount: Math.round(cobrar * 100),
        currency: 'brl',
        metadata: { booking_id: b.id, cupom: cupom || '', forma },
        description: `Portal El'Luminar — ${b.servico_nome || 'atendimento'} (${forma === 'sinal' ? 'sinal ' + SINAL_PCT + '%' : 'integral'})`,
    };

    let pi: Stripe.PaymentIntent | null = null;

    // Reaproveita o intent anterior se ele ainda puder receber cobrança
    if (b.stripe_payment_intent) {
        const existente = await stripe.paymentIntents.retrieve(b.stripe_payment_intent).catch(() => null);
        if (existente && ['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existente.status)) {
            pi = await stripe.paymentIntents.update(existente.id, dados);
        }
    }

    if (!pi) {
        pi = await stripe.paymentIntents.create({
            ...dados,
            automatic_payment_methods: { enabled: true },
        });
    }

    await admin.from('therapist_bookings').update({
        valor_total: total,
        valor_desconto: desconto,
        valor_cobrado: cobrar,
        cupom_codigo: cupom || null,
        forma_pagamento: forma,
        stripe_payment_intent: pi.id,
    }).eq('id', b.id);

    return json({
        client_secret: pi.client_secret,
        valor_total: total,
        desconto,
        cobrado: cobrar,
        percentual_cupom: percentual,
        forma,
    });
}

// --------------------------------------------------------------------------
// /webhook — fonte da verdade do pagamento. Idempotente por event.id:
// o Stripe reenvia eventos, e nunca podemos queimar um cupom duas vezes.
// --------------------------------------------------------------------------
async function webhook(req: Request): Promise<Response> {
    const assinatura = req.headers.get('stripe-signature') || '';
    const corpo = await req.text();

    let evento: Stripe.Event;
    try {
        evento = stripe.webhooks.constructEvent(corpo, assinatura, WEBHOOK_SECRET);
    } catch (e) {
        console.warn('[stripe] assinatura inválida', e);
        return new Response('assinatura inválida', { status: 400 });
    }

    const { error: erroDup } = await admin.from('stripe_events').insert({ id: evento.id, tipo: evento.type });
    if (erroDup) return json({ ok: true, duplicado: true });

    const pi = evento.data.object as Stripe.PaymentIntent;
    const bookingId = pi?.metadata?.booking_id;

    if (evento.type === 'payment_intent.succeeded' && bookingId) {
        await admin.from('therapist_bookings').update({
            pagamento_status: 'pago',
            pago_em: new Date().toISOString(),
            stripe_payment_intent: pi.id,
        }).eq('id', bookingId);

        if (pi.metadata?.cupom) {
            await admin.rpc('marcar_cupom_usado', { p_codigo: pi.metadata.cupom, p_booking: bookingId });
        }
    }

    if (evento.type === 'payment_intent.payment_failed' && bookingId) {
        await admin.from('therapist_bookings')
            .update({ pagamento_status: 'falhou' })
            .eq('id', bookingId);
    }

    if (evento.type === 'charge.refunded') {
        const ch = evento.data.object as Stripe.Charge;
        const idIntent = typeof ch.payment_intent === 'string' ? ch.payment_intent : ch.payment_intent?.id;
        if (idIntent) {
            await admin.from('therapist_bookings')
                .update({ pagamento_status: 'reembolsado', reembolso_solicitado_em: null })
                .eq('stripe_payment_intent', idIntent);
        }
    }

    return json({ recebido: evento.type });
}

// --------------------------------------------------------------------------
// /refund — admin libera o reembolso de um pedido pago.
// A fila nasce no trigger booking_reembolso (pedido pago que foi cancelado).
// --------------------------------------------------------------------------
async function refund(req: Request): Promise<Response> {
    const user = await usuarioDoPedido(req);
    if (!user) return json({ erro: 'Faça login' }, 401);

    const { data: papel } = await admin.from('user_roles').select('role').eq('user_id', user.id).maybeSingle();
    if (!papel || !['admin', 'master'].includes(papel.role)) return json({ erro: 'Apenas administrador' }, 403);

    const body = await req.json().catch(() => ({}));
    const bookingId = String(body.booking_id || '');

    const { data: b } = await admin.from('therapist_bookings').select('*').eq('id', bookingId).single();
    if (!b || !b.stripe_payment_intent) return json({ erro: 'Pedido sem pagamento registrado' }, 404);
    if (b.pagamento_status === 'reembolsado') return json({ ok: true, ja: true });

    const r = await stripe.refunds.create({
        payment_intent: b.stripe_payment_intent,
        metadata: { booking_id: b.id },
    });

    await admin.from('therapist_bookings').update({
        pagamento_status: 'reembolsado',
        reembolso_solicitado_em: null,
    }).eq('id', b.id);

    return json({ ok: true, refund: r.id, valor: r.amount / 100 });
}
