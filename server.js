// server.js — servidor estatico minimo para desenvolvimento local.
//
// Por que existe: terapeutas.html usa <script type="module"> com import/export.
// Abrindo o arquivo com duplo clique (file://), Chrome e Edge bloqueiam o
// carregamento dos modulos por CORS e a vitrine fica sem nenhum card.
// Com este servidor, tudo roda como vai rodar na Vercel.
//
// Uso:  npm run dev   ->  http://localhost:5173
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(ROOT, urlPath);

    // Nao deixa sair da raiz do projeto (../../)
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403');
        return;
    }

    // Pasta -> index.html
    let isDir = false;
    try { isDir = fs.statSync(filePath).isDirectory(); } catch { isDir = false; }
    if (isDir) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 - ' + urlPath);
            return;
        }
        res.writeHead(200, {
            'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Portal El'Luminar  ->  http://localhost:${PORT}`);
    console.log(`Vitrine            ->  http://localhost:${PORT}/terapeutas.html`);
    console.log(`Seja terapeuta     ->  http://localhost:${PORT}/seja-terapeuta.html`);
    console.log('Ctrl+C para encerrar.');
});
