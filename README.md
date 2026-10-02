# Arena Buscaminas

**El mismo tablero. Distintas inteligencias.**
Jev (TypeSafe) frente a los mejores modelos de IA: compará sus decisiones, su velocidad y su costo jugando al Buscaminas.

Demo: https://arena-buscaminas.pages.dev

## Cómo funciona

- Elegís hasta 9 modelos del catálogo en vivo de [OpenRouter](https://openrouter.ai), el tamaño del tablero y la cantidad de minas.
- Todos juegan **el mismo tablero** en paralelo, con 3 vidas y la misma jugada inicial.
- **Jev toma todas sus decisiones; el código calcula.** En cada turno el código arma las jugadas posibles con sus datos (qué está demostrado como seguro o como mina, y cuántas minas faltan alrededor) y Jev elige una con el primitivo `choice`. Es el patrón "el código ofrece, Jev elige". Sus decisiones se marcan en amarillo.
- **Los otros modelos** ven el tablero completo en texto y deciden todas sus jugadas.
- **Solo código** es el control sin IA: deduce lo seguro y, si se traba, arriesga al azar.
- **Simular sin gastar** muestra la pantalla con jugadores falsos, sin red ni costo.

Una partida es una observación, no un ranking: los modelos varían entre corridas.

## Quién paga

Nadie te presta tokens: cada persona toca **Conectar con OpenRouter** (login oficial con OAuth PKCE) y las partidas se descuentan de **su** saldo. La página no tiene servidor, así que todo va directo del navegador a OpenRouter. El acceso queda guardado solo en ese navegador, y "Desconectar" lo borra.

**Cuenta anfitriona (opcional, solo en Cloudflare Pages).** Si querés que tus visitantes jueguen sin conectarse, cargá tu clave como secreto del proyecto: `wrangler pages secret put OPENROUTER_API_KEY`. La función `functions/api/or/[[path]].js` hace de intermediaria: la clave nunca llega al navegador ni al repo, solo deja pasar las dos llamadas del juego, solo acepta pedidos desde tu propio sitio y limita el tamaño de las respuestas. Ponele un límite de crédito a esa clave en OpenRouter.

## Tu propia arena (fork)

Es un solo archivo, `index.html`, sin dependencias ni build.

1. Hacé **Fork** de este repo.
2. Publicalo donde quieras:
   - **GitHub Pages:** en tu fork, *Settings → Pages → Deploy from a branch → `main` / root*. Queda en `https://<tu-usuario>.github.io/arena-buscaminas/`.
   - **Cloudflare Pages / Netlify / Vercel:** conectá el repo, sin comando de build y con la raíz como carpeta de salida.
3. Listo: el login de OpenRouter usa la URL de tu sitio como retorno, así que no hay nada que configurar.

Para probar en tu compu, abrí `index.html` en el navegador. El login necesita una URL `http(s)`; para eso usá, por ejemplo, `python3 -m http.server`.

## Ideas para modificar

- `jugarJev`: cómo se le pregunta a Jev (estado, candidatas, instrucciones).
- `jugarLLM`: el prompt de los modelos de chat.
- `deducir`: las reglas lógicas del código (una restricción + subconjunto).
- `DEFAULT`: los modelos que aparecen precargados.
- `?semilla=abc` en la URL repite siempre el mismo tablero.

## Licencia

MIT
