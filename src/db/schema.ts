import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const profile = pgTable('profile', {
    id: uuid('id').primaryKey(),
    userId: uuid('userId').notNull().unique(),
    username: text('username').notNull(),
});

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
    viewCount: integer('veiwCount').notNull().default(0),
    createdAt: timestamp("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const review = pgTable('review', {
    id: uuid('id').primaryKey(),
    mediaId: text('mediaId').references(() => media.id).notNull(),
    userId: uuid('userId').references(() => profile.userId).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`)
});