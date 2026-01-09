/**
 * Topics (conversations) table schema
 */
import { mysqlTable, varchar, text, datetime, index } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'

export const topics = mysqlTable(
  'topics',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }),
    messages: text('messages').notNull(), // JSON string of messages array
    assistantId: varchar('assistant_id', { length: 100 }),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    updatedAtIdx: index('updated_at_idx').on(table.updatedAt)
  })
)

export type Topic = typeof topics.$inferSelect
export type NewTopic = typeof topics.$inferInsert
