/* ==========================================================================
   js/version.js - CONTROLE CENTRALIZADO DE VERSÃO DO PORTAL EL'LUMINAR
   ==========================================================================
   Use: import { VERSAO, NOME_VERSAO, IMAGEM_VERSAO, htmlFooter } from './version.js';
   ========================================================================== */

export const VERSAO = '2.0.0';
export const NOME_VERSAO = 'O Voo da Águia';
export const IMAGEM_VERSAO = 'assets/PortalElluminar/Simbolo_Portal.png';

// Estilo: 2.0.0 = estável, 2.1.0 = intermediária, 2.1.1 = ajustes/bugs
// Nomes de versão: "O Voo da Águia", "A Chama da Ascensão", etc.

/**
 * Gera o HTML completo do rodapé do Portal.
 * @param {object} opts - Opções opcionais
 * @param {string} opts.afirmacao - Frase de afirmação (opcional)
 * @returns {string} HTML do rodapé
 */
export function htmlFooter(opts = {}) {
    const afirmacao = opts.afirmacao || '"Que a Luz de Sirius guie teus passos."';
    return `
    <footer class="portal-footer">
        <div class="afirmacao-footer">${afirmacao}</div>
        <div class="info-rodape">
            <span></span>
            <p class="copyright">&copy; 2025 Portal El&rsquo;Luminar. Guiado pelo Criamor.</p>
            <span class="footer-versao" title="${NOME_VERSAO}">v${VERSAO} &mdash; ${NOME_VERSAO}</span>
        </div>
    </footer>`;
}

/**
 * Versão em texto puro para uso em console/logs
 */
export function versaoTexto() {
    return `Portal El'Luminar v${VERSAO} — ${NOME_VERSAO}`;
}