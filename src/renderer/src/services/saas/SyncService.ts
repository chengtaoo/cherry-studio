/**
 * SaaS Sync Service - Handles automatic data synchronization
 */
import { loggerService } from '@logger'
import { store } from '@renderer/store'
import { setSyncing, setLastSyncTime, setSyncError } from '@renderer/store/saas'
import { getSaaSApiClient } from './SaaSApiClient'
import db from '@renderer/databases'

const logger = loggerService.withContext('SaaSSyncService')

export class SaaSSyncService {
  private syncInterval: NodeJS.Timeout | null = null
  private isSyncing = false

  /**
   * Start automatic sync
   */
  startAutoSync(intervalMinutes: number = 30): void {
    if (this.syncInterval) {
      this.stopAutoSync()
    }

    logger.info(`Starting auto sync with interval: ${intervalMinutes} minutes`)
    this.syncInterval = setInterval(() => {
      this.syncAll().catch((error) => {
        logger.error('Auto sync failed', { error })
      })
    }, intervalMinutes * 60 * 1000)
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      logger.info('Stopped auto sync')
    }
  }

  /**
   * Sync all data to server
   */
  async syncAll(): Promise<void> {
    const state = store.getState()
    const saasState = state.saas

    if (!saasState.isEnabled || !saasState.isAuthenticated || this.isSyncing) {
      return
    }

    try {
      this.isSyncing = true
      store.dispatch(setSyncing(true))
      store.dispatch(setSyncError(null))

      const client = getSaaSApiClient(saasState.apiBaseURL)

      // Collect local data
      const [topics, settings, knowledgeNotes, files] = await Promise.all([
        db.topics.toArray(),
        db.settings.toArray(),
        db.knowledge_notes.toArray(),
        db.files.toArray()
      ])

      const assistants = state.assistants.assistants

      // Convert to sync format
      const topicsData = topics.map((topic) => ({
        id: topic.id,
        title: topic.messages?.[0]?.content?.substring(0, 100) || 'Untitled',
        messages: topic.messages || [],
        assistantId: topic.messages?.[0]?.assistantId
      }))

      const settingsData: Record<string, any> = {}
      for (const setting of settings) {
        settingsData[setting.id] = setting.value
      }

      const assistantsData: Record<string, any> = {}
      for (const [id, assistant] of Object.entries(assistants)) {
        assistantsData[id] = assistant
      }

      const knowledgeNotesData = knowledgeNotes.map((note) => ({
        id: note.id,
        baseId: note.baseId,
        type: note.type,
        content: note.content
      }))

      const filesData = files.map((file) => ({
        id: file.id,
        name: file.name,
        originName: file.origin_name,
        path: file.path,
        size: file.size,
        ext: file.ext,
        type: file.type,
        count: file.count
      }))

      // Sync all data
      await client.syncAll({
        topics: topicsData,
        settings: settingsData,
        assistants: assistantsData,
        knowledgeNotes: knowledgeNotesData,
        files: filesData
      })

      store.dispatch(setLastSyncTime(Date.now()))
      logger.info('Sync completed successfully')
    } catch (error: any) {
      const errorMessage = error.message || 'Sync failed'
      store.dispatch(setSyncError(errorMessage))
      logger.error('Sync failed', { error: errorMessage })
      throw error
    } finally {
      this.isSyncing = false
      store.dispatch(setSyncing(false))
    }
  }

  /**
   * Sync specific data type
   */
  async syncTopics(): Promise<void> {
    const state = store.getState()
    const saasState = state.saas

    if (!saasState.isEnabled || !saasState.isAuthenticated) {
      return
    }

    const client = getSaaSApiClient(saasState.apiBaseURL)
    const topics = await db.topics.toArray()

    const topicsData = topics.map((topic) => ({
      id: topic.id,
      title: topic.messages?.[0]?.content?.substring(0, 100) || 'Untitled',
      messages: topic.messages || [],
      assistantId: topic.messages?.[0]?.assistantId
    }))

    await client.syncTopics(topicsData)
  }

  async syncSettings(): Promise<void> {
    const state = store.getState()
    const saasState = state.saas

    if (!saasState.isEnabled || !saasState.isAuthenticated) {
      return
    }

    const client = getSaaSApiClient(saasState.apiBaseURL)
    const settings = await db.settings.toArray()

    const settingsData: Record<string, any> = {}
    for (const setting of settings) {
      settingsData[setting.id] = setting.value
    }

    await client.syncSettings(settingsData)
  }
}

export const syncService = new SaaSSyncService()
