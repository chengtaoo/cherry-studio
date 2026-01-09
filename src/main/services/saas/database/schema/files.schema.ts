/**
 * Files table schema
 */
import { mysqlTable, varchar, text, datetime, bigint, int, index } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'

export const userFiles = mysqlTable(
  'user_files',
  {
    id: varchar('id', { length: 100 }).notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 500 }).notNull(),
    originName: varchar('origin_name', { length: 500 }),
    path: text('path'),
    size: bigint('size', { mode: 'number' }).default(0),
    ext: varchar('ext', { length: 50 }),
    type: varchar('type', { length: 100 }),
    content: text('content'), // Base64 encoded file content or file reference
    count: int('count').default(0),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    primaryKey: index('primary_key').on(table.userId, table.id)
  })
)

export type UserFile = typeof userFiles.$inferSelect
export type NewUserFile = typeof userFiles.$inferInsert
