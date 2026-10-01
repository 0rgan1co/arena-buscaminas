// Cloudflare Pages Function: "cuenta anfitriona" de la arena.
// La clave de OpenRouter vive como secreto del proyecto (OPENROUTER_API_KEY), nunca en el navegador ni en el repo.
// Solo deja pasar las dos llamadas que usa el juego y limita el tamaño de cada respuesta.
const PERMITIDOS = ['api/v1/chat/completions', 'api/alpha/decisions'];
const MAX_TOKENS = 16000;

export async function onRequest({ request, env, params }) {
  const path = (params.path || []).join('/');
  if (path === 'estado') return Response.json({ anfitrion: Boolean(env.OPENROUTER_API_KEY) });
  if (!env.OPENROUTER_API_KEY) return new Response('Sin cuenta anfitriona', { status: 503 });
  if (request.method !== 'POST' || !PERMITIDOS.includes(path)) return new Response('No permitido', { status: 404 });

  const origin = request.headers.get('Origin');   // solo desde esta misma página
  if (!origin || new URL(origin).host !== new URL(request.url).host) return new Response('Origen no permitido', { status: 403 });

  let body;
  try { body = await request.json(); } catch { return new Response('JSON inválido', { status: 400 }); }
  if (path === 'api/v1/chat/completions') body.max_tokens = Math.min(Number(body.max_tokens) || MAX_TOKENS, MAX_TOKENS);

  const r = await fetch('https://openrouter.ai/' + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.OPENROUTER_API_KEY, 'Content-Type': 'application/json',
               'HTTP-Referer': new URL(request.url).origin, 'X-Title': 'Arena Buscaminas' },
    body: JSON.stringify(body),
  });
  return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json' } });
}
