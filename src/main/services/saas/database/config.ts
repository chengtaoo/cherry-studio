/**
 * MySQL database configuration for SaaS
 */
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

let connection: mysql.Pool | null = null
let db: ReturnType<typeof drizzle> | null = null

export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  connectionLimit?: number
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'cherry_studio',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cherry_studio',
    connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10', 10)
  }
}

export function initializeDatabase(): void {
  if (connection) {
    return
  }

  const config = getDatabaseConfig()
  connection = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit,
    waitForConnections: true,
    queueLimit: 0
  })

  db = drizzle(connection, { schema, mode: 'default' })
}

export function getDatabase() {
  if (!db) {
    initializeDatabase()
  }
  return db!
}

export async function closeDatabase(): Promise<void> {
  if (connection) {
    await connection.end()
    connection = null
    db = null
  }
}
