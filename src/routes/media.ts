import { Hono } from "hono";
import db from "../db/db";

export const mediaRoute = new Hono()

mediaRoute.get('/', async (c) => {
    const limit = parseInt(c.req.query('limit') as string, 10) || 50;
    const offset = parseInt(c.req.query('offset') as string, 10) || 0;

    try {
        const req = await db.query.media.findMany({
            limit: limit,
            offset: offset
        });
        console.log(req)
        return c.json(req)
        // Process req as needed
    } catch (error) {
        console.error('Error fetching media:', error);
        c.status(500)
        return c.body('Internal Server Error')
    }
})