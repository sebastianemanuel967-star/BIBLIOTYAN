export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('URL parameter is required', { status: 400 });
  }

  // Whitelist to prevent open proxy abuse
  if (!targetUrl.startsWith('https://github.com/sebastianemanuel967-star/BIBLIOTYAN/releases/download/')) {
    return new Response('Forbidden target URL', { status: 403 });
  }

  // Determine audio MIME type
  let mimeType = 'audio/mpeg';
  const cleanTarget = targetUrl.toLowerCase();
  if (cleanTarget.endsWith('.m4a') || cleanTarget.endsWith('.mp4')) {
    mimeType = 'audio/mp4';
  } else if (cleanTarget.endsWith('.aac')) {
    mimeType = 'audio/aac';
  } else if (cleanTarget.endsWith('.wav')) {
    mimeType = 'audio/wav';
  }

  // Forward range request (vital for mobile iOS scrubber and chunked playback)
  const rangeHeader = request.headers.get('Range');
  const fetchHeaders = new Headers();
  fetchHeaders.set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15');
  if (rangeHeader) {
    fetchHeaders.set('Range', rangeHeader);
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: 'follow'
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set('Content-Type', mimeType);
    responseHeaders.set('Content-Disposition', 'inline');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.delete('X-Content-Type-Options');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response('Error streaming audio: ' + err.message, { status: 500 });
  }
}
