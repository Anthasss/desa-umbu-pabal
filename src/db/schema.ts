import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: text("image").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
});
