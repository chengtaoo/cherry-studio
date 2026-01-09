/**
 * Users table schema for SaaS multi-user support
 */
import { mysqlTable, varchar, datetime, text, boolean, index } from 'drizzle-orm/mysql-core'

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 100 }),
    avatar: text('avatar'),
    isActive: boolean('is_active').default(true).notNull(),
    isAdmin: boolean('is_admin').default(false).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
    lastLoginAt: datetime('last_login_at', { mode: 'date', fsp: 3 })
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username)
  })
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
