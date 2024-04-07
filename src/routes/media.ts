import { Hono } from "hono";
import db from "../db/db";
import { desc, eq } from "drizzle-orm";
import { media, review, profile } from "../db/schema";
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

mediaRoute.post('/:mediaId/review', async (c) => {
    try {
        const uuid = uuidv4();
        const { mediaId } = await c.req.param()
        const { r, rating, userID } = await c.req.json()
        console.log(mediaId, r, rating)
        await db.insert(review).values({
            id: uuid,
            mediaId: mediaId,
            userId: userID,
            rating: rating,
            comment: r
        })
        return c.json({ uuid, r, rating, mediaId })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

mediaRoute.get('/:mediaId/review', async (c) => {
    try {
        const { mediaId } = await c.req.param()
        const req = await db.select({
            reviewComment: review.comment,
            reviewRating: review.rating,
            profileUsername: profile.username,
            profileID: profile.userId
        }).from(review)
            .where(eq(review.mediaId, mediaId))
            .fullJoin(profile, eq(review.userId, profile.userId))
            .orderBy(desc(review.createdAt)).limit(10)
        return c.json(req)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

mediaRoute.get('/review/:userID', async (c) => {
    try {
        const { userID } = await c.req.param()
        const r = await db.select()
            .from(review)
            .fullJoin(media, eq(review.mediaId, media.id))
            .where(eq(review.userId, userID))
        return c.json(r)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})