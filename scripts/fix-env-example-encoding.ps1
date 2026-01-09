# Fix .env.example file encoding issue
# Ensure file uses UTF-8 without BOM encoding

$ErrorActionPreference = "Stop"

$rootDir = Split-Path $PSScriptRoot -Parent
$envExamplePath = Join-Path $rootDir ".env.example"

Write-Host "Fixing .env.example file encoding..." -ForegroundColor Green

# Content with Chinese comments
$envContent = @'
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
# 项目基础配置
# ============================================
# Node.js 运行选项（设置最大内存为 8GB）
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
# SaaS 功能配置（云端同步）
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
# 生成方法: openssl rand -base64 24
MYSQL_PASSWORD=cherry_studio_password_change_me

# MySQL 数据库名称
MYSQL_DATABASE=cherry_studio

# MySQL Root 用户密码（仅用于 Docker Compose 初始化）
# ⚠️ 生产环境必须更改！
# 生成方法: openssl rand -base64 24
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
'@

# Write file using UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($envExamplePath, $envContent, $utf8NoBom)

Write-Host "File fixed successfully!" -ForegroundColor Green
Write-Host "File path: $envExamplePath" -ForegroundColor Cyan
