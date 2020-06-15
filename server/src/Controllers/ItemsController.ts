import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController{
    async index (request: Request, response: Response){
        const items = await knex('items').select('*');
        const serializedItems = items.map(item => {
          return {
            image_url: `http://localhost:3333/uploads/${item.image}`,
            title: item.title,
            id: item.id
          }
        })
        return response.json(serializedItems)
      }
}

export default ItemsController;