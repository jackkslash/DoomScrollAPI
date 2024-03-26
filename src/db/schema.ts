import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, timestamp, integer, uuid } from "drizzle-orm/pg-core";

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

export const review = pgTable('review', {
    id: uuid('id').primaryKey(),
    mediaId: text('mediaId').references(() => media.id).notNull(),
    userId: text('userId').notNull(), // Assuming userId is a foreign key referencing the users table
    rating: integer('rating').notNull(), // Assuming rating is an integer value
    comment: text('comment'),
    createdAt: timestamp("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`)
});