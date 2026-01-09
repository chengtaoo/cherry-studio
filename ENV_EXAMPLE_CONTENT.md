# .env.example 文件内容

由于 `.env.example` 文件可能被 `.gitignore` 过滤，这里提供完整的内容。

## 📝 完整内容

将以下内容保存为 `.env.example` 文件：

```env
# ============================================
# Cherry Studio SaaS 环境变量配置示例
# ============================================
# 
# 使用说明：
# 1. 复制此文件为 .env: cp .env.example .env
# 2. 根据您的实际环境修改以下配置
# 3. 生产环境请务必更改所有默认密码和密钥！
#
# ============================================

# ============================================
# SaaS 功能开关
# ============================================
# 是否启用 SaaS 模式（云端同步功能）
# 设置为 true 启用，false 禁用
ENABLE_SAAS=true

# ============================================
# MySQL 数据库配置
# ============================================
# MySQL 服务器地址
# Docker Compose 模式使用: mysql
# 本地开发模式使用: localhost
# 远程服务器使用: 服务器IP或域名
MYSQL_HOST=localhost

# MySQL 端口（默认 3306）
MYSQL_PORT=3306

# MySQL 数据库用户名
# 建议使用专用用户，不要使用 root
MYSQL_USER=cherry_studio

# MySQL 数据库密码
# ⚠️ 生产环境必须更改！使用强密码（至少16位，包含大小写字母、数字、特殊字符）
MYSQL_PASSWORD=cherry_studio_password_change_me

# MySQL 数据库名称
MYSQL_DATABASE=cherry_studio

# MySQL Root 用户密码（仅用于 Docker Compose 初始化）
# ⚠️ 生产环境必须更改！
MYSQL_ROOT_PASSWORD=rootpassword_change_me

# MySQL 连接池大小（可选，默认 10）
# 根据服务器性能和并发需求调整
MYSQL_CONNECTION_LIMIT=10

# ============================================
# JWT 认证配置
# ============================================
# JWT 密钥
# ⚠️ 生产环境必须更改！使用强随机字符串（至少32字符）
# 生成方法：
#   Linux/Mac: openssl rand -base64 32
#   Node.js: require('crypto').randomBytes(32).toString('base64')
#   Python: import secrets; secrets.token_urlsafe(32)
JWT_SECRET=change-this-secret-key-in-production-use-a-strong-random-string-at-least-32-characters

# JWT Token 过期时间（可选，默认 7d）
# 格式：数字 + 单位（s=秒, m=分钟, h=小时, d=天）
# 示例：7d（7天）、24h（24小时）、30m（30分钟）
JWT_EXPIRES_IN=7d

# ============================================
# API 服务器配置
# ============================================
# API 服务端口（默认 3000）
# 确保端口未被占用
API_PORT=3000

# 运行环境
# development: 开发模式（会显示详细错误信息）
# production: 生产模式（隐藏内部错误信息）
NODE_ENV=production

# ============================================
# 可选配置（高级）
# ============================================
# 日志级别（可选）
# 可选值: error, warn, info, debug
# LOG_LEVEL=info

# 是否启用 API 文档（可选，默认启用）
# 生产环境建议禁用
# ENABLE_API_DOCS=true

# CORS 允许的来源（可选）
# 多个来源用逗号分隔
# 示例: http://localhost:5173,https://yourdomain.com
# CORS_ORIGIN=*

# ============================================
# 配置检查清单
# ============================================
# 在部署到生产环境前，请确认：
# [ ] ENABLE_SAAS 已设置为 true
# [ ] MYSQL_PASSWORD 已更改为强密码
# [ ] MYSQL_ROOT_PASSWORD 已更改为强密码
# [ ] JWT_SECRET 已更改为强随机字符串（至少32字符）
# [ ] NODE_ENV 已设置为 production
# [ ] 已配置 HTTPS（生产环境）
# [ ] 已设置防火墙规则
# [ ] 已配置数据库备份策略
```

## 🚀 快速创建方法

### 方法 1: 手动创建

```bash
# 复制上述内容，保存为 .env.example
nano .env.example
# 或
vim .env.example
# 或
code .env.example
```

### 方法 2: 使用脚本生成（推荐）

```bash
# Linux/Mac
chmod +x scripts/generate-env.sh
./scripts/generate-env.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/generate-env.ps1

# 或使用 npm 脚本
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

### 方法 3: 直接创建 .env 文件

```bash
# 创建 .env 文件并编辑
cp .env.example .env
nano .env
```

## 📋 配置项说明

### 必需配置（4项）

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| `ENABLE_SAAS` | 启用 SaaS 模式 | `true` |
| `MYSQL_PASSWORD` | MySQL 密码 | `SecurePass123!@#` |
| `MYSQL_ROOT_PASSWORD` | MySQL Root 密码 | `RootPass123!@#` |
| `JWT_SECRET` | JWT 密钥（至少32字符） | `K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2z` |

### 可选配置（有默认值）

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `MYSQL_HOST` | `localhost` | MySQL 地址 |
| `MYSQL_PORT` | `3306` | MySQL 端口 |
| `MYSQL_USER` | `cherry_studio` | MySQL 用户名 |
| `MYSQL_DATABASE` | `cherry_studio` | 数据库名 |
| `JWT_EXPIRES_IN` | `7d` | Token 过期时间 |
| `API_PORT` | `3000` | API 端口 |
| `NODE_ENV` | `production` | 运行环境 |

## 🔐 快速生成密钥

### 一键生成所有密钥

```bash
# Linux/Mac
echo "MySQL 密码: $(openssl rand -base64 24)"
echo "MySQL Root 密码: $(openssl rand -base64 24)"
echo "JWT Secret: $(openssl rand -base64 32)"

# Windows PowerShell
$bytes = New-Object byte[] 24; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### 使用脚本（推荐）

```bash
# 运行生成脚本
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

脚本会自动生成所有必需的密钥和密码，并输出完整的 `.env` 配置内容。

## 📚 详细文档

- [环境变量配置完整指南](./ENV_CONFIG_GUIDE.md) - 详细的配置说明
- [环境变量配置文档](./docs/zh/ENV_CONFIGURATION.md) - 中文详细文档
- [SaaS 部署指南](./docs/zh/SAAS_DEPLOYMENT.md) - 完整部署流程

## ❓ 常见问题

### Q: .env.example 文件在哪里？

**A**: 如果文件不存在，请按照上述内容手动创建，或使用生成脚本。

### Q: 如何快速生成所有密钥？

**A**: 使用提供的脚本：

```bash
# Linux/Mac
pnpm env:generate

# Windows
pnpm env:generate:win
```

### Q: 最小配置需要哪些项？

**A**: 只需要 4 项：

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password
JWT_SECRET=your_jwt_secret_at_least_32_characters
```

其他项都有默认值。

---

**提示**: 将上述 `.env.example` 内容保存到项目根目录即可！
