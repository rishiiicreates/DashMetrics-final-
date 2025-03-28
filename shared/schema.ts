import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  profilePic: text("profilePic").notNull().default(""),
  password: text("password").notNull(),
  provider: text("provider").notNull(), // "google", "github", "password"
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Platform Schema
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  platformType: text("platformType").notNull(), // "instagram", "twitter", "linkedin", "youtube", "facebook"
  handle: text("handle").notNull(),
  isActive: boolean("isActive").notNull().default(true),
});

export const insertPlatformSchema = createInsertSchema(platforms).omit({
  id: true,
});

// Analytics Schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  platformId: integer("platformId").notNull(),
  metric: text("metric").notNull(), // "followers", "engagement", "reach", "responseTime"
  value: integer("value").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

// Bookmark Schema
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  platformType: text("platformType").notNull(), // "instagram", "twitter", "linkedin", "youtube", "facebook"
  tags: text("tags").array(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
