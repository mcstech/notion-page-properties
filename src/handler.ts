import { getDatabase } from '../lib/notion'

const productsDbId = process.env.PRODUCTS_DATABASE_ID

export async function handleRequest(request: Request): Promise<Response> {
  const { id } = await request.json()
  const productsDb = await getDatabase(productsDbId)
  const products = productsDb
        .filter(p => [id].includes(p.id))
  
  return new Response(JSON.stringify(products), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}
