
import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

    async index(request: Request, response: Response){
        const {
            uf,
            city,
            items
        } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))
        
        var points = await knex('points')
                    .join('point_items', 'points.id', '=', 'point_items.point_id')
                    .whereIn('point_items.item_id', parsedItems)
                    .where({city: String(city), uf: String(uf)})
                    .distinct()
                    .select('points.*'); 

        return response.json(points);
    }

    async show(request: Request, response: Response){
        const {
            id
        } = request.params;

        var point = await knex('points').select('*').where({id}).first();
        
        if(point === undefined)
            return response.status(404).json({message: 'Point not found'});

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.status(200).json({point,items, message: 'Point Founded'});
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const points_id = await trx('points').insert(point);

        const point_id = points_id[0];

        const pointItems = items.map((item_id: number) => {
            return {
                point_id,
                item_id
            }
        });

        await trx('point_items').insert(pointItems).then(trx.commit);

        return response.json({ 
            id: point_id,
            ...point,
        });
    }
}

export default PointsController;