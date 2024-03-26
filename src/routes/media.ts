import { Hono } from "hono";
import db from "../db/db";
import { eq } from "drizzle-orm";
import { media, review } from "../db/schema";
import { v4 as uuidv4 } from 'uuid';

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

mediaRoute.get('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const result = await db.query.media.findFirst({
            where: eq(media.id, id)
        })
        console.log(result)

        if (!result) {
            return c.json({ error: 'Resource not found' });
        }
        return c.json(result)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }

})

mediaRoute.post('/:id/review', async (c) => {
    try {
        const uuid = uuidv4();
        const { id } = c.req.param()
        const { r, rating } = await c.req.json()
        await db.insert(review).values({
            id: uuid,
            mediaId: id,
            userId: "test",
            rating: rating,
            comment: r

        })
        return c.json({ uuid, r, rating, id })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})