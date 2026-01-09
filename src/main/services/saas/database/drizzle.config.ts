/**
 * Drizzle Kit configuration for SaaS MySQL database
 */
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/main/services/saas/database/schema/index.ts',
  out: './resources/database/drizzle-saas',
  dbCredentials: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'cherry_studio',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cherry_studio'
  },
  verbose: true,
  strict: true
})
