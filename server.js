const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'index.html');
const port = Number(process.env.PORT) || 8080;

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url || '/', 'http://localhost').pathname;
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }

  if (pathname === '/favicon.ico') {
    res.writeHead(204, { 'Cache-Control': 'public, max-age=3600' });
    return res.end();
  }

  if (pathname !== '/' && pathname !== '/index.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method not allowed');
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).on('error', (error) => {
    console.error('Failed to read index.html:', error.message);
    res.destroy(error);
  }).pipe(res);
}).listen(port, '0.0.0.0', () => console.log('Listening on ' + port));
