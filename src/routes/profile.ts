import { Hono } from "hono";
import { profile } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db/db";
import { v4 as uuidv4 } from 'uuid';

export const profileRoute = new Hono()

profileRoute.get('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const result = await db.query.profile.findFirst({
            where: eq(profile.userId, id)
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

profileRoute.post('/:id', async (c) => {
    try {
        const uuid = uuidv4();
        const { id } = c.req.param()
        const username = c.req.query('username') as string
        const result = await db.insert(profile).values({
            id: uuid,
            userId: id,
            username: username
        })
        console.log(result)
        return c.json({ success: 'Profile created' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }

})

profileRoute.post('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const username = c.req.query('username') as string
        const result = await db.update(profile).set({
            username: username
        }).where(eq(profile.userId, id))
        console.log(result)
        return c.json({ success: 'Profile updated' })
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' });
    }
})
