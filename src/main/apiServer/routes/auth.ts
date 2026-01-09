/**
 * Authentication routes
 */
import type { Request, Response } from 'express'
import express from 'express'
import { z } from 'zod'
import { loggerService } from '@main/services/LoggerService'
import { userService } from '@main/services/saas/services/UserService'
import { jwtAuthMiddleware, type AuthenticatedRequest } from '../middleware/jwtAuth'

const logger = loggerService.withContext('ApiServerAuthRoutes')
const router = express.Router()

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(100),
  password: z.string().min(8),
  displayName: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 minLength: 8
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await userService.createUser(data)

    logger.info('User registered', { email: data.email, userId: result.user.id })

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          displayName: result.user.displayName,
          avatar: result.user.avatar,
          createdAt: result.user.createdAt
        },
        token: result.token
      }
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error.errors
        }
      })
    }

    logger.error('Registration error', { error: error.message })
    res.status(400).json({
      success: false,
      error: {
        message: error.message || 'Registration failed'
      }
    })
  }
})

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await userService.login(data.email, data.password)

    logger.info('User logged in', { email: data.email, userId: result.user.id })

    res.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          displayName: result.user.displayName,
          avatar: result.user.avatar,
          createdAt: result.user.createdAt
        },
        token: result.token
      }
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error.errors
        }
      })
    }

    logger.error('Login error', { error: error.message })
    res.status(401).json({
      success: false,
      error: {
        message: error.message || 'Login failed'
      }
    })
  }
})

/**
 * @swagger
 * /v1/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Unauthorized
 */
router.get('/me', jwtAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.user!.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    })
  } catch (error: any) {
    logger.error('Get user error', { error: error.message })
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user info' }
    })
  }
})

export { router as authRoutes }
