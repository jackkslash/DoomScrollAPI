import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const media = pgTable('media', {
    id: serial('id').primaryKey(),
    title: text('title'),
    desc: text('desc'),
    publishedAt: text('publishedAt'),
    channelId: text('channelId'),
    channelTitle: text('channelTitle'),
    thumbnails: jsonb('thumbnails'),
    tags: text('publishedAt'),
    platform: text('platform'),
});