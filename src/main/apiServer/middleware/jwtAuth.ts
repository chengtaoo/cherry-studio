/**
 * JWT authentication middleware for SaaS
 */
import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '@main/services/saas/auth/jwt'
import { userService } from '@main/services/saas/services/UserService'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    username: string
  }
}

export const jwtAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header('authorization')
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized: missing token' })
    return
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: invalid token format' })
    return
  }

  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: invalid or expired token' })
    return
  }

  // Verify user still exists and is active
  const user = await userService.getUserById(payload.userId)
  if (!user || !user.isActive) {
    res.status(401).json({ error: 'Unauthorized: user not found or inactive' })
    return
  }

  req.user = {
    id: user.id,
    email: user.email,
    username: user.username
  }

  next()
}
