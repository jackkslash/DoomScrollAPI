import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, date, timestamp } from "drizzle-orm/pg-core";

export const media = pgTable('media', {
    id: text('id').primaryKey(),
    title: text('title'),
    desc: text('desc'),
    uploadDate: text('uploadDate'),
    channelId: text('channelId'),
    channelTitle: text('channelTitle'),
    thumbnails: jsonb('thumbnails'),
    tags: text('tags'),
    platform: text('platform'),
    createdAt: timestamp("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`)
});