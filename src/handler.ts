import { getDatabase } from '../lib/notion'

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.search)
    if (params.has('id')) {
      const id = params.get('id')
      const productsDb = await getDatabase(PRODUCTS_DATABASE_ID)
      const products = productsDb
        .filter(p => [id].includes(p.id))
      
      if (!products.length) {
        throw new Error('No properties found with that id')
      }

      return new Response(JSON.stringify(products), {
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
