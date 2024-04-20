import { Hono } from "hono";
import { media, profile, review, tracking } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db/db";
import { v4 as uuidv4 } from 'uuid';
import { PageEnum, ProfileItem, ProfileUpdateItem, TrackingItem } from "../types";

export const profileRoute = new Hono()

profileRoute.get('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const result = await db.query.profile.findFirst({
            where: eq(profile.userId, id)
        })
        console.log(result)
        const trackingObj: TrackingItem = {
            id: uuidv4(),
            itemID: id,
            page: PageEnum.PROFILE,
            viewedAt: new Date()
        }
        await db.insert(tracking).values(trackingObj)


        if (!result) {
            return c.json({ error: 'Resource not found' });
        }
        return c.json(result)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }

})

profileRoute.post('/:id', async (c) => {
    try {
        const uuid = uuidv4();
        const { id } = c.req.param()
        const username = c.req.query('username') as string
        const profileObj: ProfileItem = {
            id: uuid,
            userId: id,
            username: username
        }

        const result = await db.insert(profile).values(profileObj)
        console.log(result)
        return c.json({ success: 'Profile created' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }

})

profileRoute.put('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const username = c.req.query('username') as string
        const profileObj: ProfileUpdateItem = {
            username: username
        }
        const result = await db.update(profile).set(profileObj)
            .where(eq(profile.userId, id))
        console.log(result)
        return c.json({ success: 'Profile updated' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

profileRoute.get('/:userID/reviews', async (c) => {
    try {
        const limit = parseInt(c.req.query('limit') as string, 10) || 50;
        const offset = parseInt(c.req.query('offset') as string, 10) || 0;

        const { userID } = await c.req.param()
        const r = await db.select({
            reviewComment: review.comment,
            reviewRating: review.rating,
            reviewDate: review.createdAt,
            profileUsername: profile.username,
            profileID: profile.userId,
            mediaTitle: media.title,
            mediaDesc: media.desc,
        })
            .from(review)
            .fullJoin(profile, eq(review.userId, profile.userId))
            .fullJoin(media, eq(review.mediaId, media.id))
            .where(eq(review.userId, userID))
            .limit(limit)
            .offset(offset)
        return c.json(r)
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})