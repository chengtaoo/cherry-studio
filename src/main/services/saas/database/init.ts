/**
 * Initialize SaaS database connection
 */
import { loggerService } from '@logger'
import { initializeDatabase } from './config'

const logger = loggerService.withContext('SaaSDatabase')

export async function initSaaSDatabase(): Promise<void> {
  try {
    // Only initialize if SaaS is enabled
    if (process.env.ENABLE_SAAS !== 'true') {
      logger.info('SaaS mode is disabled, skipping database initialization')
      return
    }

    logger.info('Initializing SaaS MySQL database connection...')
    initializeDatabase()
    logger.info('SaaS MySQL database connection initialized successfully')
  } catch (error: any) {
    logger.error('Failed to initialize SaaS database', {
      error: error.message,
      stack: error.stack
    })
    // Don't throw - allow app to continue without SaaS features
  }
}
