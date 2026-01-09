/**
 * Data synchronization service
 */
import { eq, and } from 'drizzle-orm'
import { getDatabase } from '../database/config'
import {
  topics,
  userSettings,
  userAssistants,
  knowledgeBases,
  knowledgeNotes,
  userFiles
} from '../database/schema'
import type {
  Topic,
  UserSetting,
  UserAssistant,
  KnowledgeBase,
  KnowledgeNote,
  UserFile
} from '../database/schema'

export class SyncService {
  private db = getDatabase()

  // Topics
  async getTopics(userId: string): Promise<Topic[]> {
    return this.db.select().from(topics).where(eq(topics.userId, userId))
  }

  async syncTopics(userId: string, topicsData: any[]): Promise<void> {
    // Delete all existing topics for user
    await this.db.delete(topics).where(eq(topics.userId, userId))

    // Insert new topics
    if (topicsData && topicsData.length > 0) {
      const topicsToInsert = topicsData.map((topic) => ({
        id: topic.id,
        userId,
        title: topic.title || null,
        messages: JSON.stringify(topic.messages || []),
        assistantId: topic.assistantId || null
      }))

      await this.db.insert(topics).values(topicsToInsert)
    }
  }

  // Settings
  async getSettings(userId: string): Promise<Record<string, any>> {
    const settings = await this.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))

    const result: Record<string, any> = {}
    for (const setting of settings) {
      try {
        result[setting.id] = JSON.parse(setting.value)
      } catch {
        result[setting.id] = setting.value
      }
    }
    return result
  }

  async syncSettings(userId: string, settingsData: Record<string, any>): Promise<void> {
    // Delete all existing settings for user
    await this.db.delete(userSettings).where(eq(userSettings.userId, userId))

    // Insert new settings
    if (settingsData) {
      const settingsToInsert = Object.entries(settingsData).map(([id, value]) => ({
        id,
        userId,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      }))

      if (settingsToInsert.length > 0) {
        await this.db.insert(userSettings).values(settingsToInsert)
      }
    }
  }

  // Assistants
  async getAssistants(userId: string): Promise<Record<string, any>> {
    const assistants = await this.db
      .select()
      .from(userAssistants)
      .where(eq(userAssistants.userId, userId))

    const result: Record<string, any> = {}
    for (const assistant of assistants) {
      try {
        result[assistant.id] = {
          name: assistant.name,
          description: assistant.description,
          config: JSON.parse(assistant.config)
        }
      } catch {
        result[assistant.id] = {
          name: assistant.name,
          description: assistant.description,
          config: assistant.config
        }
      }
    }
    return result
  }

  async syncAssistants(userId: string, assistantsData: Record<string, any>): Promise<void> {
    // Delete all existing assistants for user
    await this.db.delete(userAssistants).where(eq(userAssistants.userId, userId))

    // Insert new assistants
    if (assistantsData) {
      const assistantsToInsert = Object.entries(assistantsData).map(([id, assistant]: [string, any]) => ({
        id,
        userId,
        name: assistant.name || id,
        description: assistant.description || null,
        config: typeof assistant.config === 'string' ? assistant.config : JSON.stringify(assistant.config || {})
      }))

      if (assistantsToInsert.length > 0) {
        await this.db.insert(userAssistants).values(assistantsToInsert)
      }
    }
  }

  // Knowledge
  async getKnowledge(userId: string): Promise<{
    knowledgeBases: Record<string, any>
    knowledgeNotes: KnowledgeNote[]
  }> {
    const bases = await this.db
      .select()
      .from(knowledgeBases)
      .where(eq(knowledgeBases.userId, userId))

    const notes = await this.db
      .select()
      .from(knowledgeNotes)
      .where(eq(knowledgeNotes.userId, userId))

    const knowledgeBasesData: Record<string, any> = {}
    for (const base of bases) {
      try {
        knowledgeBasesData[base.id] = {
          name: base.name,
          description: base.description,
          config: JSON.parse(base.config)
        }
      } catch {
        knowledgeBasesData[base.id] = {
          name: base.name,
          description: base.description,
          config: base.config
        }
      }
    }

    return {
      knowledgeBases: knowledgeBasesData,
      knowledgeNotes: notes
    }
  }

  async syncKnowledge(
    userId: string,
    knowledgeBasesData: Record<string, any>,
    knowledgeNotesData: any[]
  ): Promise<void> {
    // Delete all existing knowledge for user
    await this.db.delete(knowledgeBases).where(eq(knowledgeBases.userId, userId))
    await this.db.delete(knowledgeNotes).where(eq(knowledgeNotes.userId, userId))

    // Insert knowledge bases
    if (knowledgeBasesData) {
      const basesToInsert = Object.entries(knowledgeBasesData).map(([id, base]: [string, any]) => ({
        id,
        userId,
        name: base.name || id,
        description: base.description || null,
        config: typeof base.config === 'string' ? base.config : JSON.stringify(base.config || {})
      }))

      if (basesToInsert.length > 0) {
        await this.db.insert(knowledgeBases).values(basesToInsert)
      }
    }

    // Insert knowledge notes
    if (knowledgeNotesData && knowledgeNotesData.length > 0) {
      const notesToInsert = knowledgeNotesData.map((note: any) => ({
        id: note.id,
        userId,
        baseId: note.baseId || null,
        type: note.type || 'text',
        content: note.content || ''
      }))

      await this.db.insert(knowledgeNotes).values(notesToInsert)
    }
  }

  // Files
  async getFiles(userId: string): Promise<UserFile[]> {
    return this.db.select().from(userFiles).where(eq(userFiles.userId, userId))
  }

  async syncFiles(userId: string, filesData: any[]): Promise<void> {
    // Delete all existing files for user
    await this.db.delete(userFiles).where(eq(userFiles.userId, userId))

    // Insert new files
    if (filesData && filesData.length > 0) {
      const filesToInsert = filesData.map((file) => ({
        id: file.id,
        userId,
        name: file.name || '',
        originName: file.originName || file.name || null,
        path: file.path || null,
        size: file.size || 0,
        ext: file.ext || null,
        type: file.type || null,
        content: file.content || null,
        count: file.count || 0
      }))

      await this.db.insert(userFiles).values(filesToInsert)
    }
  }

  // Sync all
  async syncAll(userId: string, data: {
    topics?: any[]
    settings?: Record<string, any>
    assistants?: Record<string, any>
    knowledgeBases?: Record<string, any>
    knowledgeNotes?: any[]
    files?: any[]
  }): Promise<void> {
    if (data.topics) {
      await this.syncTopics(userId, data.topics)
    }
    if (data.settings) {
      await this.syncSettings(userId, data.settings)
    }
    if (data.assistants) {
      await this.syncAssistants(userId, data.assistants)
    }
    if (data.knowledgeBases || data.knowledgeNotes) {
      await this.syncKnowledge(userId, data.knowledgeBases || {}, data.knowledgeNotes || [])
    }
    if (data.files) {
      await this.syncFiles(userId, data.files)
    }
  }
}

export const syncService = new SyncService()
