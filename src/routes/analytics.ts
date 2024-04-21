import { Hono } from "hono";
import db from "../db/db";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { media, profile, review, tracking } from "../db/schema";

import { PageEnum } from "../types";


export const analyticsRoute = new Hono()


analyticsRoute.get('/most-reviewed', async (c) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const ratings = await db.select({
            mediaID: media.id,
            mediaTitle: media.title,
            mediaDesc: media.desc,
            count: count(media.id)
        })
            .from(review)
            .fullJoin(media, eq(review.mediaId, media.id))
            .where(gte(review.createdAt, twentyFourHoursAgo))
            .groupBy(media.id)
            .orderBy(desc(count(media.id)))
            .limit(5)

        return c.json(ratings)
    }
    catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

analyticsRoute.get('/most-viewed', async (c) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const mv = await db.select({
            mediaID: media.id,
            mediaTitle: media.title,
            mediaDesc: media.desc,
            count: count(media.id)
        })
            .from(tracking)
            .where(and(eq(tracking.page, PageEnum.MEDIA), gte(tracking.viewedAt, twentyFourHoursAgo)))
            .fullJoin(media, eq(tracking.itemID, media.id))
            .groupBy(media.id)
            .orderBy(desc(count(tracking.itemID)))
            .limit(5)

        return c.json(mv)
    }
    catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})

analyticsRoute.get('/most-viewed-profile', async (c) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const mv = await db.select({
            profileID: profile.id,
            profileUsername: profile.username,
            count: count(profile.id)
        })
            .from(tracking)
            .where(and(eq(tracking.page, PageEnum.PROFILE), gte(tracking.viewedAt, twentyFourHoursAgo)))
            .fullJoin(profile, eq(tracking.itemID, profile.id))
            .groupBy(profile.id)
            .orderBy(desc(count(profile.id)))
            .limit(5)

        return c.json(mv)
    }
    catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})