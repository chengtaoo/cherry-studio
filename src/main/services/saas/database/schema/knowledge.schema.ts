/**
 * Knowledge base table schema
 */
import { mysqlTable, varchar, text, datetime, index } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'

export const knowledgeBases = mysqlTable(
  'knowledge_bases',
  {
    id: varchar('id', { length: 100 }).notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    config: text('config').notNull(), // JSON string of knowledge base configuration
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    userIdIdIdx: index('user_id_id_idx').on(table.userId, table.id),
    primaryKey: index('primary_key').on(table.userId, table.id)
  })
)

export const knowledgeNotes = mysqlTable(
  'knowledge_notes',
  {
    id: varchar('id', { length: 100 }).notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    baseId: varchar('base_id', { length: 100 }),
    type: varchar('type', { length: 50 }).notNull(),
    content: text('content').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    baseIdIdx: index('base_id_idx').on(table.baseId),
    primaryKey: index('primary_key').on(table.userId, table.id)
  })
)

export type KnowledgeBase = typeof knowledgeBases.$inferSelect
export type NewKnowledgeBase = typeof knowledgeBases.$inferInsert
export type KnowledgeNote = typeof knowledgeNotes.$inferSelect
export type NewKnowledgeNote = typeof knowledgeNotes.$inferInsert
