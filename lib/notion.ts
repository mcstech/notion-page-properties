import { Client } from "@notionhq/client";
import {
  QueryDatabaseResponse,
  UpdateDatabaseResponse,
  GetPageResponse,
  GetBlockResponse,
  UpdateDatabaseParameters,
  UpdateDatabaseBodyParameters,
} from "@notionhq/client/build/src/api-endpoints";

import type {
  Block,
  Database,
  Entity,
  FullBlock,
  FullDatabase,
  FullPage,
  List,
  Page,
} from './types';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getDatabase(databaseId: string | undefined): Promise<QueryDatabaseResponse['results']> {
  if (!databaseId) {
    throw new Error('undefined database id');
  }
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const updateDatabase = async (databaseId: string, properties): Promise<UpdateDatabaseResponse> => {
  const response = await notion.databases.update({
    database_id: databaseId,
    properties,
  });
  return response;
};

export const getPage = async (pageId: string): Promise<GetPageResponse> => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const updatePage = async (pageId) => {
  const response = await notion.pages.update({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId: string): Promise<any> => {
  const blocks = [];
  let cursor;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};

export const getAllCategoriesFromProducts = (products, storeId = []) => {
  let catProducts = products.filter(product => product?.properties.Categories)
  
  if (storeId.length) {
    catProducts = catProducts
      .filter(
        p => 
          p
            .properties['Belong To']
            .relation
            .map(b => storeId.includes(b.id))[0]
      )
  }
  const categories = [...catProducts.map(p => p.properties.Categories.multi_select).flat()]
  const catObj = {}
  categories.forEach(cat => {
    if (cat.name in catObj) {
      const count = catObj[cat.name].count + 1
      catObj[cat.name] = {
        ...cat,
        count,
      }
    } else {
      catObj[cat.name] = {
        ...cat,
        count: 1,
      }
    }
  })
  return catObj
}
