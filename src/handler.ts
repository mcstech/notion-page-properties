import { getDatabase } from '../lib/notion'

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
