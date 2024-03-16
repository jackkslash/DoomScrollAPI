import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const media = pgTable('media', {
    id: text('id').primaryKey(),
    title: text('title'),
    desc: text('desc'),
    uploadDate: text('uploadDate'),
    channelId: text('channelId'),
    channelTitle: text('channelTitle'),
    thumbnails: jsonb('thumbnails'),
    tags: text('publishedAt'),
    platform: text('platform'),
});