import { getDatabase } from '../lib/notion'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.search)
    if (params.has('id')) {
      const id = params.get('id')
      const productsDb = await getDatabase(DATABASE_ID)
      const product = productsDb
        .find(p => p.id === id)
      
      if (!product) {
        throw new Error('No properties found with that id')
      }

      return new Response(JSON.stringify(product), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      })
    } else {
      throw new Error('No id specified')
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

export function handleOptions(request: Request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}
