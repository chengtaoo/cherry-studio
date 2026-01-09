# Cherry Studio SaaS 部署指南

本文档详细说明如何将 Cherry Studio 部署为 B/S 模式的 SaaS 服务。

## 目录

- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [Docker 部署](#docker-部署)
- [手动部署](#手动部署)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [数据迁移](#数据迁移)
- [用户管理](#用户管理)
- [API 文档](#api-文档)
- [故障排除](#故障排除)

## 系统要求

### 最低要求

- **操作系统**: Linux (推荐 Ubuntu 20.04+), macOS, Windows Server
- **CPU**: 2 核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **数据库**: MySQL 8.0 或更高版本

### 推荐配置

- **操作系统**: Linux (Ubuntu 22.04 LTS)
- **CPU**: 4+ 核心
- **内存**: 8GB+ RAM
- **存储**: 50GB+ SSD
- **数据库**: MySQL 8.0+ 或 MariaDB 10.6+

## 快速开始

### 使用 Docker Compose（推荐）

1. **克隆仓库**

```bash
git clone https://github.com/CherryHQ/cherry-studio.git
cd cherry-studio
```

2. **配置环境变量**

```bash
cp .env.example .env
# 编辑 .env 文件，设置数据库密码和 JWT 密钥
```

3. **启动服务**

```bash
docker-compose up -d
```

4. **运行数据库迁移**

```bash
docker exec -it cherry-studio-backend pnpm saas:migrate
```

5. **访问服务**

- API 服务: http://localhost:3000
- API 文档: http://localhost:3000/api-docs
- 健康检查: http://localhost:3000/health

## Docker 部署

### 使用 Docker Compose

Docker Compose 是最简单的部署方式，它会自动配置 MySQL 数据库和后端服务。

#### 1. 准备环境文件

创建 `.env` 文件：

```env
# ============================================
# SaaS 功能开关
# ============================================
ENABLE_SAAS=true

# ============================================
# MySQL 数据库配置
# ============================================
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=your_secure_password_here
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=your_root_password_here

# ============================================
# JWT 认证配置
# ============================================
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# ============================================
# API 服务器配置
# ============================================
API_PORT=3000
NODE_ENV=production
```

**⚠️ 重要**: 
- 生产环境必须更改所有密码和密钥！
- 详细配置说明请查看 [环境变量配置指南](../ENV_CONFIG_GUIDE.md)

#### 2. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据卷（注意：会删除所有数据）
docker-compose down -v
```

#### 3. 运行数据库迁移

```bash
# 进入容器
docker exec -it cherry-studio-backend sh

# 运行迁移
pnpm saas:migrate

# 或者直接执行
docker exec -it cherry-studio-backend pnpm saas:migrate
```

### 使用 Docker（单独部署）

如果您想单独部署各个组件：

#### 1. 启动 MySQL

```bash
docker run -d \
  --name cherry-studio-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=cherry_studio \
  -e MYSQL_USER=cherry_studio \
  -e MYSQL_PASSWORD=cherry_studio_password \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

#### 2. 构建后端镜像

```bash
docker build -t cherry-studio:latest .
```

#### 3. 运行后端容器

```bash
docker run -d \
  --name cherry-studio-backend \
  -p 3000:3000 \
  -e MYSQL_HOST=host.docker.internal \
  -e MYSQL_PORT=3306 \
  -e MYSQL_USER=cherry_studio \
  -e MYSQL_PASSWORD=cherry_studio_password \
  -e MYSQL_DATABASE=cherry_studio \
  -e JWT_SECRET=your_jwt_secret \
  -e ENABLE_SAAS=true \
  cherry-studio:latest
```

## 手动部署

### 1. 安装依赖

```bash
# 安装 Node.js 22+
# 安装 pnpm
npm install -g pnpm@10.27.0

# 安装项目依赖
pnpm install
```

### 2. 配置 MySQL 数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE cherry_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户
CREATE USER 'cherry_studio'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cherry_studio.* TO 'cherry_studio'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 配置环境变量

创建 `.env` 文件或设置环境变量：

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=cherry_studio
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=cherry_studio
export JWT_SECRET=your_jwt_secret
export ENABLE_SAAS=true
```

### 4. 运行数据库迁移

```bash
pnpm saas:migrate
```

### 5. 构建应用

```bash
pnpm build
```

### 6. 启动服务

```bash
# 开发模式
pnpm dev

# 生产模式
NODE_ENV=production node out/main/index.js
```

### 7. 使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start out/main/index.js --name cherry-studio

# 查看状态
pm2 status

# 查看日志
pm2 logs cherry-studio

# 设置开机自启
pm2 startup
pm2 save
```

## 数据库配置

### 数据库 Schema

SaaS 模式使用以下主要数据表：

- `users` - 用户表
- `topics` - 对话/话题表
- `user_settings` - 用户设置表
- `user_assistants` - 用户助手表
- `knowledge_bases` - 知识库表
- `knowledge_notes` - 知识库笔记表
- `user_files` - 用户文件表

### 数据库迁移

使用 Drizzle Kit 进行数据库迁移：

```bash
# 生成迁移文件
pnpm saas:generate

# 应用迁移
pnpm saas:migrate

# 查看数据库结构
pnpm saas:studio
```

### 备份和恢复

#### 备份

```bash
# 使用 mysqldump
mysqldump -u cherry_studio -p cherry_studio > backup.sql

# 使用 Docker
docker exec cherry-studio-mysql mysqldump -u cherry_studio -p cherry_studio > backup.sql
```

#### 恢复

```bash
# 恢复数据库
mysql -u cherry_studio -p cherry_studio < backup.sql

# 使用 Docker
docker exec -i cherry-studio-mysql mysql -u cherry_studio -p cherry_studio < backup.sql
```

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `MYSQL_HOST` | MySQL 主机地址 | `localhost` |
| `MYSQL_PORT` | MySQL 端口 | `3306` |
| `MYSQL_USER` | MySQL 用户名 | `cherry_studio` |
| `MYSQL_PASSWORD` | MySQL 密码 | - |
| `MYSQL_DATABASE` | 数据库名 | `cherry_studio` |
| `JWT_SECRET` | JWT 密钥 | - |
| `ENABLE_SAAS` | 启用 SaaS 模式 | `false` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `API_PORT` | API 服务端口 | `3000` |
| `MYSQL_CONNECTION_LIMIT` | 数据库连接池大小 | `10` |
| `NODE_ENV` | 运行环境 | `production` |

## 数据迁移

### 从本地存储迁移到云端

1. **导出本地数据**

在 Cherry Studio 客户端中：
- 打开设置 → 数据设置
- 点击"备份"按钮
- 保存备份文件

2. **注册/登录 SaaS 账户**

```bash
# 注册用户
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'

# 登录获取 token
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

3. **上传数据到云端**

使用获取的 token 上传数据：

```bash
curl -X POST http://localhost:3000/v1/sync/all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @backup.json
```

## 用户管理

### 创建管理员用户

```sql
-- 登录 MySQL
mysql -u root -p cherry_studio

-- 更新用户为管理员
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

### 用户角色

- **普通用户** (`is_admin = false`): 可以管理自己的数据
- **管理员** (`is_admin = true`): 可以管理所有用户（需要额外实现管理接口）

## API 文档

启动服务后，访问 `http://localhost:3000/api-docs` 查看完整的 API 文档。

### 主要 API 端点

#### 认证

- `POST /v1/auth/register` - 注册新用户
- `POST /v1/auth/login` - 用户登录
- `GET /v1/auth/me` - 获取当前用户信息

#### 数据同步

- `GET /v1/sync/topics` - 获取所有话题
- `POST /v1/sync/topics` - 同步话题
- `GET /v1/sync/settings` - 获取设置
- `POST /v1/sync/settings` - 同步设置
- `GET /v1/sync/assistants` - 获取助手
- `POST /v1/sync/assistants` - 同步助手
- `GET /v1/sync/knowledge` - 获取知识库
- `POST /v1/sync/knowledge` - 同步知识库
- `GET /v1/sync/files` - 获取文件
- `POST /v1/sync/files` - 同步文件
- `POST /v1/sync/all` - 同步所有数据

## 故障排除

### 常见问题

#### 1. 数据库连接失败

**问题**: `Error: connect ECONNREFUSED`

**解决方案**:
- 检查 MySQL 服务是否运行
- 检查 `MYSQL_HOST` 和 `MYSQL_PORT` 配置
- 检查防火墙设置
- 验证数据库用户权限

#### 2. JWT 验证失败

**问题**: `Unauthorized: invalid or expired token`

**解决方案**:
- 检查 `JWT_SECRET` 是否设置
- 确保 token 未过期
- 重新登录获取新 token

#### 3. 数据库迁移失败

**问题**: `Migration failed`

**解决方案**:
- 检查数据库用户权限
- 确保数据库已创建
- 查看详细错误日志

#### 4. Docker 容器无法启动

**问题**: 容器立即退出

**解决方案**:
```bash
# 查看容器日志
docker logs cherry-studio-backend

# 检查环境变量
docker exec cherry-studio-backend env

# 检查数据库连接
docker exec cherry-studio-backend ping mysql
```

### 日志查看

```bash
# Docker Compose
docker-compose logs -f backend

# PM2
pm2 logs cherry-studio

# 直接运行
# 日志会输出到控制台和 logs/ 目录
```

## 安全建议

1. **更改默认密码**: 不要使用默认的数据库密码和 JWT 密钥
2. **使用 HTTPS**: 在生产环境使用反向代理（如 Nginx）配置 HTTPS
3. **限制数据库访问**: 只允许必要的 IP 访问数据库
4. **定期备份**: 设置自动备份策略
5. **监控日志**: 定期检查日志文件，发现异常活动
6. **更新依赖**: 定期更新依赖包以修复安全漏洞

## 性能优化

1. **数据库索引**: 确保所有查询字段都有适当的索引
2. **连接池**: 根据负载调整 `MYSQL_CONNECTION_LIMIT`
3. **缓存**: 考虑使用 Redis 缓存频繁访问的数据
4. **CDN**: 对于静态资源，使用 CDN 加速
5. **负载均衡**: 对于高并发场景，使用负载均衡器

## 支持

如有问题，请：

1. 查看 [GitHub Issues](https://github.com/CherryHQ/cherry-studio/issues)
2. 访问 [文档网站](https://docs.cherry-ai.com)
3. 加入 [Discord 社区](https://discord.gg/wez8HtpxqQ)
