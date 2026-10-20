# GO-LIVE — Stripe em produção · Portal El'Luminar

Roteiro para virar do modo de teste para cobrança real.
**Tempo:** ~25 min + o teste de R$ 5.
**Quem faz o quê:** os passos 1–4 são seus (painéis); 5–8 eu faço com você.

---

## 0. Tenha em mãos antes de começar

- [ ] A **chave secreta nova** do Stripe (`sk_live_…`) que você criou
- [ ] A **chave publicável** live (`pk_live_…`) — está em *API keys*, ao lado da secreta
- [ ] Acesso ao **Supabase** do projeto `frvqvnusjnnmbpztiokn`
- [ ] Acesso à **Vercel** do projeto do Portal
- [ ] Anote (gerenciador de senhas) os **3 valores de teste atuais**, para rollback:
      `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY`

> O Stripe **não converte** chaves de teste em live. São dois mundos separados: objetos criados em teste (`pi_…`, `cus_…`) **não existem** no live.

---

## 1. Stripe — conferir o modo live

### 1.1 Sair do modo de teste
1. Abra [dashboard.stripe.com](https://dashboard.stripe.com).
2. No topo, desligue o botão **“Test mode” / “Modo de teste”**.
3. A faixa “Você está testando…” deve **desaparecer**. Se ainda aparecer, você está em teste.

### 1.2 Confirmar que a conta está aprovada para cobrar
1. **Configurações** → **Detalhes do negócio** (*Business details*).
2. Confirme: dados preenchidos, **conta bancária** cadastrada, status **“Cobranças ativas”** (*Charges enabled*).
3. Se houver pendência (“Informações necessárias”), resolva **antes** de seguir — sem isso a `sk_live_` não cria cobrança.

### 1.3 Habilitar os meios de pagamento (Pix)
1. **Configurações** → **Pagamentos** → **Meios de pagamento** (*Payment methods*).
2. Cartão já vem ativo.
3. Ative **Pix**. Se pedir dados extras (titular, CPF/CNPJ), preencha.
4. Confirme que **Pix** aparece como *Ativo* no modo live.

> No código usamos `automatic_payment_methods: { enabled: true }`: o checkout mostra **apenas** o que estiver habilitado aqui. Se Pix não estiver ativo, ele não aparece — não quebra nada.

### 1.4 Criar o webhook **live** (o segredo é outro!)
1. **Desenvolvedores** → **Webhooks** → **Adicionar endpoint**.
2. **URL do endpoint:**
   `https://frvqvnusjnnmbpztiokn.supabase.co/functions/v1/stripe/webhook`
3. **Eventos a escutar** — exatamente estes três:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. **Adicionar endpoint**.
5. Na tela do endpoint, em **Segredo de assinatura** (*Signing secret*), clique em **Revelar** e copie o `whsec_…`.
   ⚠️ **Este segredo é novo.** O do endpoint de teste não serve.

> Pode deixar o endpoint de **teste** existindo. Eles convivem: um recebe eventos de teste, o outro de produção.

---

## 2. Supabase — trocar os dois segredos

1. Abra o projeto → **Edge Functions** → aba **Secrets** (*Manage secrets*).
2. Edite **`STRIPE_SECRET_KEY`** → cole a `sk_live_…` → **Save**.
3. Edite **`STRIPE_WEBHOOK_SECRET`** → cole o `whsec_…` do **endpoint live** → **Save**.
4. **Não mexa** em `RECONCILE_TOKEN`, `SUPABASE_*` nem nos segredos do Vault (`resend_api_key`, `resend_from`, `reconcile_token`).

> Segredos valem na próxima invocação da função — não precisa redeploy por causa deles.

---

## 3. Vercel — chave publicável + redeploy

1. Projeto → **Settings** → **Environment Variables**.
2. Edite **`VITE_STRIPE_PUBLISHABLE_KEY`** → cole a `pk_live_…` (marque **Production**) → **Save**.
3. **Deployments** → no deploy mais recente, **⋯** → **Redeploy**.
   Sem redeploy o site continua com a chave antiga (ela é injetada no build).
4. Depois do deploy, abra no navegador:
   `https://SEU-DOMINIO/js/env-config.js`
   e confirme que aparece `"pk_live_…"`. Se aparecer `pk_test_…` ou vazio, o redeploy não pegou.

---

## 4. Conferência técnica (2 minutos)

- [ ] `pk_live_` servido pelo site (passo 3.4)
- [ ] `sk_live_` e `whsec_` live salvos no Supabase (passo 2)
- [ ] Endpoint live **Ativo** no Stripe (passo 1.4)
- [ ] `verify_jwt: false` na função `stripe`
      **Edge Functions → stripe → Settings**: *Verify JWT* deve estar **desligado**.
      (Cada deploy da função religa essa opção — eu desligo logo depois.)
- [ ] `/webhook` responde do código, não do gateway:
      abrir `…/functions/v1/stripe/webhook` no navegador deve dar **400 “assinatura inválida…”**.
      Se der **401 UNAUTHORIZED**, o `verify_jwt` está ligado — me avise.
- [ ] Diagnóstico do modo: eu consulto `/status` com o token interno.
      Esperado: `{"modo":"live","webhook_secret_definido":true}`.
      Se vier `"modo":"teste"`, a `sk_live_` não foi salva (ou voltou a de teste).

---

## 5. Teste real — faço com você

**Valor:** o sinal do serviço mais barato. Hoje: *Reiki On Line* R$ 62,00 → sinal 30% = **R$ 18,60**
(com o cupom de 15% que nasce neste teste: R$ 62,00 → R$ 52,70 → sinal **R$ 15,81**).

> O cupom de primeira compra é gerado automaticamente, porque o cupom de teste está queimado e o único pedido pago foi reembolsado. Este teste também valida o cupom em produção.

1. Crie um agendamento na vitrine e pague com **cartão real**.
2. Critérios de aceite:
   - [ ] Checkout mostra **cartão** (e Pix, se ativado em 1.3)
   - [ ] Volta para `pagamento.html` com “Pagamento confirmado”
   - [ ] `pagamento_status = pago` e `pago_em` preenchido
   - [ ] **2 e-mails**: consulente e terapeuta
   - [ ] Stripe → Webhooks → entregas: **200** e `{"recebido":"payment_intent.succeeded"}`
   - [ ] `stripe_events` com o `evt_…`
3. Reembolso: eu cancelo o pedido, o cron (:10/:25/:40/:55) estorna e **você confere o estorno na fatura**.

---

## 6. Limpeza dos dados de teste

Faço eu, com a sua confirmação:

```sql
-- confere o que vai sair
select id, consulente_nome, data, status, pagamento_status, stripe_payment_intent
  from public.therapist_bookings order by created_at;

-- apaga só os pedidos de teste (ids confirmados com você)
delete from public.therapist_bookings where id in ('<id1>', '<id2>');

-- histórico de e-mails e eventos de teste
delete from public.email_log where created_at < '<data-da-virada>';
delete from public.stripe_events where recebido_em < '<data-da-virada>';

-- cupom de teste já queimado
delete from public.coupons where codigo = 'LUMINAR15-D9EA18';
```

> **Por que limpar:** pedidos de teste ficam com `pi_` de teste. No live, `/confirmar` e a reconciliação não encontram esse objeto — falham tratado, mas é lixo no banco.

---

## 7. Rollback (se algo der errado)

1. Supabase → Secrets: volte `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` para os valores de teste anotados no passo 0.
2. Vercel → `VITE_STRIPE_PUBLISHABLE_KEY` volta para a `pk_test_…` → **Redeploy**.
3. O site volta a funcionar em teste em ~2 min. Nada no banco precisa mudar.

> O Stripe **não** estorna nada automaticamente na virada. Pagamentos reais só ocorrem se alguém pagar entre os passos 1 e 3 — faça a virada fora do horário de movimento.

---

## 8. O que eu valido depois que você avisar

1. Rotas respondendo com as chaves novas (`/intent`, `/confirmar`, `/webhook`, `/reconciliar`).
2. `verify_jwt: false` e a versão da função.
3. `stripe_events` recebendo `evt_…` **live** com HTTP 200.
4. E-mails de pagamento com HTTP 200 e remetente correto.
5. Os 5 crons ativos e na ordem certa (:02 reconcilia → :05 cancela → :10 reembolsa).
6. Reembolso real refletido no Stripe.

---

## Registro da virada — 20/10/2026

| Verificação | Resultado |
|---|---|
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` atualizados | 02:21 / 02:22 |
| `/status` → modo | **live** |
| `/webhook` (sem assinatura) | 400 "assinatura inválida" (não 401) |
| Pagamento real (Reiki R$ 62,00) | cupom 15% → R$ 52,70 → sinal **R$ 15,81** |
| `evt_…` em `stripe_events` | ✅ `payment_intent.succeeded` |
| `pago_em` / cupom queimado | ✅ / ✅ |
| E-mails (consulente + terapeuta) | ✅ HTTP 200 |

**Bugs encontrados durante a virada e corrigidos:**

1. **Ping-pong pago ⇄ reembolsado** (v15): depois do estorno o PaymentIntent
   continua `succeeded`; a reconciliação remarcava o pedido como pago e o job
   de reembolso estornava de novo, a cada 15 min. Agora os dois ignoram
   `pagamento_status = 'reembolsado'`.
2. **Alerta falso de reconciliação** (v16): no retorno do checkout o webhook
   chega milissegundos depois, então `/confirmar` gravava primeiro e alertava.
   O alerta agora existe **apenas** no cron.


| Risco | O que acontece | Como resolvo |
|---|---|---|
| Versão da API fixada em `2024-06-20` no código | Se a conta live recusar, a função devolve `Invalid Stripe API version` | Troco o pin para a versão da conta (`2026-04-22.dahlia`) em 1 linha |
| `verify_jwt` religa a cada deploy | Stripe recebe 401 e nada é gravado | Desligo logo após o deploy (já comentado no código) |
| Remetente ainda em `onboarding@resend.dev` | E-mail de pagamento cai em spam | Trocar o segredo do Vault `resend_from` por domínio verificado |
| Pix não habilitado no live | Checkout só mostra cartão | Ativar no passo 1.3 |

