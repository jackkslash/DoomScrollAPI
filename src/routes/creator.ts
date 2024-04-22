import { Hono } from "hono";
import db from "../db/db";
import { desc, eq } from "drizzle-orm";
import { media } from "../db/schema";

export const creatorRoute = new Hono()

creatorRoute.get('/:creator', async (c) => {
    try {
        const { creator } = await c.req.param()
        const result = await db.query.media.findMany({
            where: eq(media.channelTitle, creator),
            orderBy: desc(media.createdAt)
        })
        return c.json(result)

    } catch (error) {
        console.error('Error fetching media:', error);
        c.status(500)
        return c.body('Internal Server Error')
    }
})