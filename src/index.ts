import { handleRequest, handleOptions } from './handler'

addEventListener('fetch', (event: FetchEvent) => {
  try {
    const { request } = event

    if (request.method.toUpperCase() === 'OPTIONS') {
      // Handle CORS preflight requests
      event.respondWith(handleOptions(request));
    }
  
    event.passThroughOnException();
    return event.respondWith(handleRequest(request))
  } catch (e: any) {
    return event.respondWith(
      new Response(e.message, {
        status: 400,
      })
    );
  }
  
})
