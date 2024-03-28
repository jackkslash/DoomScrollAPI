import { Hono } from "hono";
import db from "../db/db";
import { desc, eq } from "drizzle-orm";
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
        const { id } = await c.req.param()
        const { r, rating, userID } = await c.req.json()
        console.log(id, r, rating)
        await db.insert(review).values({
            id: uuid,
            mediaId: id,
            userId: userID,
            rating: rating,
            comment: r
        })
        return c.json({ uuid, r, rating, id })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

mediaRoute.get('/:id/review', async (c) => {
    try {
        const { id } = await c.req.param()
        const req = await db.query.review.findMany({
            where: eq(review.mediaId, id),
            orderBy: [desc(review.createdAt)]
        })

        const formattedReviews = req.map(review => ({
            id: review.id,
            mediaId: review.mediaId,
            userId: review.userId,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
        }));

        return c.json(formattedReviews)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})