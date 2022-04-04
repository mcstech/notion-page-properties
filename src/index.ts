import { handleRequest } from './handler'

addEventListener('fetch', (event: FetchEvent) => {
  try {
    const { request } = event

    if (request.method.toUpperCase() !== 'GET') {
      throw new Error('Unsupported method')
    }
  
    // console.log('wok eleh', request)
    event.passThroughOnException();
    return event.respondWith(handleRequest(event.request))
  } catch (e: any) {
    return event.respondWith(
      new Response(e.message, {
        status: 400,
      })
    );
  }
  
})
