/**
 * User service for managing users
 */
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getDatabase } from '../database/config'
import { users } from '../database/schema'
import { hashPassword, comparePassword } from '../auth/password'
import { generateToken, verifyToken } from '../auth/jwt'
import type { NewUser, User } from '../database/schema/users.schema'

export class UserService {
  private db = getDatabase()

  async createUser(data: {
    email: string
    username: string
    password: string
    displayName?: string
  }): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists')
    }

    const existingUsername = await this.db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1)

    if (existingUsername.length > 0) {
      throw new Error('Username already taken')
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const newUser: NewUser = {
      id: nanoid(),
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName || data.username,
      isActive: true,
      isAdmin: false
    }

    const [createdUser] = await this.db.insert(users).values(newUser)

    const user = await this.db.select().from(users).where(eq(users.id, newUser.id)).limit(1)

    if (user.length === 0) {
      throw new Error('Failed to create user')
    }

    // Generate token
    const token = generateToken({
      userId: user[0].id,
      email: user[0].email,
      username: user[0].username
    })

    return { user: user[0], token }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (!user.isActive) {
      throw new Error('User account is disabled')
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    // Update last login
    await this.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    })

    return { user, token }
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1)
    return user || null
  }

  async getUserByToken(token: string): Promise<User | null> {
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    return this.getUserById(payload.userId)
  }

  async updateUser(userId: string, data: Partial<Pick<User, 'displayName' | 'avatar'>>): Promise<User> {
    await this.db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))

    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await comparePassword(oldPassword, user.passwordHash)
    if (!isValid) {
      throw new Error('Invalid current password')
    }

    const newPasswordHash = await hashPassword(newPassword)
    await this.db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
  }
}

export const userService = new UserService()
