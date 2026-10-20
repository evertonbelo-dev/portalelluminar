// _v.mjs — valida o checkout e a reconciliação
import fs from 'fs';
import { execFileSync } from 'child_process';

const out = [];
let falhas = 0;
const ok = (c, m) => { out.push((c ? 'OK   ' : 'FALHA') + ' ' + m); if (!c) falhas++; };

const pag = fs.readFileSync('pagamento.html', 'utf8');
const ts = fs.readFileSync('supabase/functions/stripe/index.ts', 'utf8');

const script = (pag.match(/<script type="module">([\s\S]*?)<\/script>/) || [])[1] || '';
fs.writeFileSync('_t.mjs', script);
try { execFileSync(process.execPath, ['--check', '_t.mjs'], { stdio: 'pipe' }); ok(true, 'pagamento.html script OK'); }
catch (e) { ok(false, 'pagamento.html QUEBRADO -> ' + e.stderr.toString().split('\n').slice(0, 8).join(' | ')); }
fs.unlinkSync('_t.mjs');

const dv = (pag.match(/<div[\s>]/g) || []).length;
const df = (pag.match(/<\/div>/g) || []).length;
ok(dv === df, 'pagamento.html <div> ' + dv + '/' + df);
ok(pag.trim().endsWith('</html>'), 'pagamento.html fecha com </html>');

[['/functions/v1/stripe/confirmar', 'chama a reconciliação'],
 ['confirmarNoServidor', 'função de reconciliação'],
 ['mostrarPago', 'tela de pago reutilizável'],
 ['b.stripe_payment_intent', 'reconcilia ao reabrir a página'],
 ['dados.pago', 'trata "já pago" no /intent'],
 ['sugerirCupom', 'cupom sugerido'],
 ['esperarConfirmacao(8)', 'aguarda após o Stripe']]
 .forEach(function (p) { ok(pag.includes(p[0]), 'checkout: ' + p[1]); });

[["if (rota === 'confirmar')", 'rota /confirmar registrada'],
 ['async function confirmar(req: Request)', 'handler confirmar'],
 ["pi.status !== 'succeeded'", 'reconcilia só com succeeded'],
 ['async function marcarPago', 'marcarPago compartilhado'],
 ['await marcarPago(bookingId, pi)', 'webhook usa marcarPago'],
 ['existente.status === \'succeeded\'', 'intent não cobra duas vezes'],
 ["tipo: 'assinatura_invalida'", 'erro de assinatura registrado'],
 ['recon_', 'idempotência da reconciliação']]
 .forEach(function (p) { ok(ts.includes(p[0]), 'função: ' + p[1]); });

const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
ok(sql.includes('ADD COLUMN IF NOT EXISTS erro TEXT'), 'SQL: coluna erro no stripe_events');

console.log(out.join('\n') + '\n\n' + (falhas === 0 ? '==> RECONCILIACAO_OK' : '==> ' + falhas + ' FALHA(S)'));
