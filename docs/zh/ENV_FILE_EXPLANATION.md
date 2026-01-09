# .env.example 文件说明

## 📋 什么是 .env.example 文件？

`.env.example` 是一个**模板文件**，用于：

1. **提供配置示例** - 告诉用户需要配置哪些环境变量
2. **版本控制** - 可以安全地提交到 Git（不包含敏感信息）
3. **快速开始** - 用户可以复制它来创建自己的 `.env` 文件

## 🔍 当前文件内容说明

您项目中的 `.env.example` 文件目前包含以下内容：

```env
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
```

### 各配置项说明：

| 配置项 | 说明 | 用途 |
|--------|------|------|
| `NODE_OPTIONS` | Node.js 运行选项 | 设置最大内存为 8GB |
| `API_KEY` | API 密钥 | 用于某些 AI 服务的 API 调用 |
| `BASE_URL` | API 基础地址 | AI 服务的 API 地址 |
| `MODEL` | 默认模型 | 默认使用的 AI 模型 |
| `CSLOGGER_MAIN_LEVEL` | 主进程日志级别 | 控制日志输出详细程度 |
| `CSLOGGER_RENDERER_LEVEL` | 渲染进程日志级别 | 控制日志输出详细程度 |

**这些是项目原有的配置，用于开发和生产环境。**

## ✅ 可以修改吗？

**可以修改！** `.env.example` 文件的作用就是作为模板，您可以：

1. ✅ **添加新配置项** - 添加 SaaS 相关的配置
2. ✅ **更新示例值** - 更新为更合适的示例值
3. ✅ **添加注释** - 添加说明注释帮助用户理解

**修改 `.env.example` 不会影响运行**，因为：
- 它只是模板文件
- 实际运行使用的是 `.env` 文件（不会被提交到 Git）
- 修改 `.env.example` 只是更新了模板，不会影响现有配置

## 🚀 建议的更新方案

基于您现有的 `.env.example` 文件，建议添加 SaaS 相关配置。以下是更新后的完整内容：

```env
# ============================================
# Cherry Studio 环境变量配置示例
# ============================================
# 
# 使用说明：
# 1. 复制此文件为 .env: cp .env.example .env
# 2. 根据您的实际环境修改以下配置
# 3. 生产环境请务必更改所有默认密码和密钥！
#
# ============================================

# ============================================
# 原有配置（项目基础配置）
# ============================================
# Node.js 运行选项
NODE_OPTIONS=--max-old-space-size=8000

# API 配置（示例，请替换为实际值）
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"

# 日志配置
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
# CSLOGGER_MAIN_SHOW_MODULES=
# CSLOGGER_RENDERER_SHOW_MODULES=

# ============================================
# SaaS 功能配置（新增）
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
```

## 📝 如何更新 .env.example 文件

### 方法 1: 手动更新

1. 打开 `.env.example` 文件
2. 在文件末尾添加上述 SaaS 配置部分
3. 保存文件

### 方法 2: 使用提供的完整内容

我已经在 `ENV_EXAMPLE_CONTENT.md` 文件中提供了完整的 `.env.example` 内容，您可以：

1. 打开 `ENV_EXAMPLE_CONTENT.md`
2. 复制文件中的完整内容
3. 替换 `.env.example` 文件的内容

## 🔄 .env.example vs .env 的区别

| 文件 | 用途 | Git 状态 | 内容 |
|------|------|----------|------|
| `.env.example` | 配置模板 | ✅ 提交到 Git | 示例值，不包含敏感信息 |
| `.env` | 实际配置 | ❌ 不提交到 Git | 真实值，包含密码和密钥 |

**工作流程**:
1. 开发者克隆项目后，看到 `.env.example`
2. 复制为 `.env`: `cp .env.example .env`
3. 编辑 `.env` 文件，填入真实配置
4. `.env` 文件不会被提交到 Git（安全）

## ⚠️ 重要提示

1. **不要提交 `.env` 文件** - 它包含敏感信息（密码、密钥）
2. **可以提交 `.env.example`** - 它只是模板，不包含真实密码
3. **修改 `.env.example` 是安全的** - 它不会影响运行中的配置
4. **生产环境必须更改所有默认值** - 特别是密码和密钥

## 📚 相关文档

- [环境变量配置完整指南](../ENV_CONFIG_GUIDE.md)
- [.env.example 完整内容](../ENV_EXAMPLE_CONTENT.md)
- [SaaS 部署指南](./SAAS_DEPLOYMENT.md)
