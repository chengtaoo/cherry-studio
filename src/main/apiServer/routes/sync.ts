/**
 * Data synchronization routes for SaaS
 */
import type { Request, Response } from 'express'
import express from 'express'
import { loggerService } from '@main/services/LoggerService'
import { syncService } from '@main/services/saas/services/SyncService'
import { jwtAuthMiddleware, type AuthenticatedRequest } from '../middleware/jwtAuth'

const logger = loggerService.withContext('ApiServerSyncRoutes')
const router = express.Router()

/**
 * @swagger
 * /v1/sync/topics:
 *   get:
 *     summary: Get all topics for current user
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 */
router.get('/topics', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const topics = await syncService.getTopics(req.user!.id)
    res.json({
      success: true,
      data: topics
    })
  } catch (error: any) {
    logger.error('Get topics error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get topics' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/topics:
 *   post:
 *     summary: Sync topics to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topics:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Topics synced successfully
 */
router.post('/topics', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topics } = req.body
    await syncService.syncTopics(req.user!.id, topics)
    res.json({
      success: true,
      message: 'Topics synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync topics error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync topics' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/settings:
 *   get:
 *     summary: Get all settings for current user
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of settings
 */
router.get('/settings', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await syncService.getSettings(req.user!.id)
    res.json({
      success: true,
      data: settings
    })
  } catch (error: any) {
    logger.error('Get settings error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get settings' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/settings:
 *   post:
 *     summary: Sync settings to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings synced successfully
 */
router.post('/settings', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settings } = req.body
    await syncService.syncSettings(req.user!.id, settings)
    res.json({
      success: true,
      message: 'Settings synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync settings error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync settings' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/assistants:
 *   get:
 *     summary: Get all assistants for current user
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assistants
 */
router.get('/assistants', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assistants = await syncService.getAssistants(req.user!.id)
    res.json({
      success: true,
      data: assistants
    })
  } catch (error: any) {
    logger.error('Get assistants error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get assistants' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/assistants:
 *   post:
 *     summary: Sync assistants to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assistants:
 *                 type: object
 *     responses:
 *       200:
 *         description: Assistants synced successfully
 */
router.post('/assistants', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { assistants } = req.body
    await syncService.syncAssistants(req.user!.id, assistants)
    res.json({
      success: true,
      message: 'Assistants synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync assistants error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync assistants' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/knowledge:
 *   get:
 *     summary: Get all knowledge bases and notes for current user
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Knowledge data
 */
router.get('/knowledge', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const knowledge = await syncService.getKnowledge(req.user!.id)
    res.json({
      success: true,
      data: knowledge
    })
  } catch (error: any) {
    logger.error('Get knowledge error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get knowledge' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/knowledge:
 *   post:
 *     summary: Sync knowledge to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               knowledgeBases:
 *                 type: object
 *               knowledgeNotes:
 *                 type: array
 *     responses:
 *       200:
 *         description: Knowledge synced successfully
 */
router.post('/knowledge', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { knowledgeBases, knowledgeNotes } = req.body
    await syncService.syncKnowledge(req.user!.id, knowledgeBases, knowledgeNotes)
    res.json({
      success: true,
      message: 'Knowledge synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync knowledge error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync knowledge' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/files:
 *   get:
 *     summary: Get all files for current user
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files
 */
router.get('/files', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = await syncService.getFiles(req.user!.id)
    res.json({
      success: true,
      data: files
    })
  } catch (error: any) {
    logger.error('Get files error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get files' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/files:
 *   post:
 *     summary: Sync files to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *     responses:
 *       200:
 *         description: Files synced successfully
 */
router.post('/files', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { files } = req.body
    await syncService.syncFiles(req.user!.id, files)
    res.json({
      success: true,
      message: 'Files synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync files error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync files' }
    })
  }
})

/**
 * @swagger
 * /v1/sync/all:
 *   post:
 *     summary: Sync all data to server
 *     tags: [Sync]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topics:
 *                 type: array
 *               settings:
 *                 type: object
 *               assistants:
 *                 type: object
 *               knowledgeBases:
 *                 type: object
 *               knowledgeNotes:
 *                 type: array
 *               files:
 *                 type: array
 *     responses:
 *       200:
 *         description: All data synced successfully
 */
router.post('/all', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topics, settings, assistants, knowledgeBases, knowledgeNotes, files } = req.body
    await syncService.syncAll(req.user!.id, {
      topics,
      settings,
      assistants,
      knowledgeBases,
      knowledgeNotes,
      files
    })
    res.json({
      success: true,
      message: 'All data synced successfully'
    })
  } catch (error: any) {
    logger.error('Sync all error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to sync all data' }
    })
  }
})

export { router as syncRoutes }
