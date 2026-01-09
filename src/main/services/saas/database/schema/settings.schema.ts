/**
 * User settings table schema
 */
import { mysqlTable, varchar, text, datetime, index } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'

export const userSettings = mysqlTable(
  'user_settings',
  {
    id: varchar('id', { length: 100 }).notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    value: text('value').notNull(), // JSON string
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    userIdIdIdx: index('user_id_id_idx').on(table.userId, table.id),
    primaryKey: index('primary_key').on(table.userId, table.id)
  })
)

export type UserSetting = typeof userSettings.$inferSelect
export type NewUserSetting = typeof userSettings.$inferInsert
