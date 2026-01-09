# 环境变量配置完整指南

## 📋 概述

本文档详细说明 Cherry Studio SaaS 所需的所有环境变量配置。`.env.example` 文件是一个模板，您需要复制它并填写实际值。

## 🚀 快速开始

### 步骤 1: 创建配置文件

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置文件（使用您喜欢的编辑器）
nano .env
# 或
vim .env
# 或
code .env
```

### 步骤 2: 配置必需项

至少需要配置以下**4个必需项**：

1. `ENABLE_SAAS=true` - 启用 SaaS 功能
2. `MYSQL_PASSWORD` - MySQL 密码
3. `MYSQL_ROOT_PASSWORD` - MySQL Root 密码（Docker 模式）
4. `JWT_SECRET` - JWT 密钥（至少32字符）

---

## 📝 完整配置说明

### 一、SaaS 功能开关

```env
# 是否启用 SaaS 模式（云端同步功能）
# 必需: 是
# 可选值: true, false
ENABLE_SAAS=true
```

**说明**:
- `true` - 启用 SaaS 功能，数据将同步到云端
- `false` - 禁用 SaaS 功能，使用本地存储（原有模式）

---

### 二、MySQL 数据库配置

#### 1. MYSQL_HOST

```env
# MySQL 服务器地址
# 必需: 是
# 默认值: localhost
MYSQL_HOST=localhost
```

**不同场景的配置**:

| 场景 | 配置值 | 说明 |
|------|--------|------|
| Docker Compose | `mysql` | 使用 docker-compose.yml 中的服务名 |
| 本地开发 | `localhost` 或 `127.0.0.1` | 本地 MySQL 服务器 |
| 远程服务器 | `192.168.1.100` 或 `db.example.com` | 远程 MySQL 服务器 IP 或域名 |

#### 2. MYSQL_PORT

```env
# MySQL 端口
# 必需: 否（有默认值）
# 默认值: 3306
MYSQL_PORT=3306
```

#### 3. MYSQL_USER

```env
# MySQL 数据库用户名
# 必需: 否（有默认值）
# 默认值: cherry_studio
MYSQL_USER=cherry_studio
```

**安全建议**:
- ✅ 不要使用 `root` 用户
- ✅ 创建专用用户，只授予必要权限

#### 4. MYSQL_PASSWORD ⚠️

```env
# MySQL 数据库密码
# 必需: 是
# 默认值: 无
MYSQL_PASSWORD=your_secure_password_here
```

**安全要求**:
- ⚠️ **生产环境必须更改！**
- 至少 16 个字符
- 包含大小写字母、数字、特殊字符
- 不要使用常见密码

**生成强密码**:
```bash
# Linux/Mac
openssl rand -base64 24

# 或使用 pwgen（如果已安装）
pwgen -s 24 1
```

**示例**:
```env
MYSQL_PASSWORD=MySecurePassword123!@#
```

#### 5. MYSQL_DATABASE

```env
# MySQL 数据库名称
# 必需: 否（有默认值）
# 默认值: cherry_studio
MYSQL_DATABASE=cherry_studio
```

#### 6. MYSQL_ROOT_PASSWORD ⚠️

```env
# MySQL Root 用户密码（仅用于 Docker Compose 初始化）
# 必需: 是（Docker Compose 模式）
# 默认值: 无
MYSQL_ROOT_PASSWORD=your_root_password_here
```

**安全要求**:
- ⚠️ **生产环境必须更改！**
- 使用强密码（至少 16 个字符）
- 与 `MYSQL_PASSWORD` 不同

#### 7. MYSQL_CONNECTION_LIMIT（可选）

```env
# MySQL 连接池大小
# 必需: 否
# 默认值: 10
MYSQL_CONNECTION_LIMIT=10
```

**建议值**:
- 小型应用: 5-10
- 中型应用: 10-20
- 大型应用: 20-50

---

### 三、JWT 认证配置

#### 1. JWT_SECRET ⚠️

```env
# JWT Token 签名密钥
# 必需: 是
# 默认值: 无
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

**安全要求**:
- ⚠️ **生产环境必须更改！**
- 至少 32 个字符
- 使用强随机字符串
- 不要使用可预测的值

**生成方法**:

```bash
# 方法 1: 使用 OpenSSL（推荐）
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3: 使用 Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# 方法 4: 使用在线工具（不推荐用于生产环境）
# https://www.random.org/strings/
```

**生成示例**:
```bash
$ openssl rand -base64 32
K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8z
```

**配置示例**:
```env
JWT_SECRET=K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8z
```

#### 2. JWT_EXPIRES_IN（可选）

```env
# JWT Token 过期时间
# 必需: 否
# 默认值: 7d
JWT_EXPIRES_IN=7d
```

**格式**: `数字 + 单位`

| 单位 | 说明 | 示例 |
|------|------|------|
| `s` | 秒 | `3600s` (1小时) |
| `m` | 分钟 | `30m` (30分钟) |
| `h` | 小时 | `24h` (24小时) |
| `d` | 天 | `7d` (7天，默认) |

**示例**:
```env
# 7天（默认，推荐）
JWT_EXPIRES_IN=7d

# 24小时
JWT_EXPIRES_IN=24h

# 30分钟（测试用）
JWT_EXPIRES_IN=30m

# 1小时
JWT_EXPIRES_IN=1h
```

---

### 四、API 服务器配置

#### 1. API_PORT（可选）

```env
# API 服务器监听端口
# 必需: 否
# 默认值: 3000
API_PORT=3000
```

**注意事项**:
- 确保端口未被占用
- 生产环境建议使用 80（HTTP）或 443（HTTPS）
- 如果使用反向代理（如 Nginx），可以保持 3000

#### 2. NODE_ENV（可选）

```env
# Node.js 运行环境
# 必需: 否
# 默认值: production
NODE_ENV=production
```

**可选值**:
- `development` - 开发模式（显示详细错误信息）
- `production` - 生产模式（隐藏内部错误信息，推荐）

---

## 📋 配置示例

### 示例 1: 开发环境（最小配置）

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置
MYSQL_HOST=localhost
MYSQL_PASSWORD=dev_password_123
MYSQL_ROOT_PASSWORD=root_dev_123

# JWT 配置
JWT_SECRET=dev-secret-key-not-for-production-12345678901234567890
```

### 示例 2: Docker Compose（推荐配置）

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置（Docker Compose）
MYSQL_HOST=mysql
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=secure_password_here
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=secure_root_password_here

# JWT 配置
JWT_SECRET=K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2z
JWT_EXPIRES_IN=7d

# API 配置
API_PORT=3000
NODE_ENV=production
```

### 示例 3: 生产环境（完整配置）

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置（生产环境）
MYSQL_HOST=db.production.com
MYSQL_PORT=3306
MYSQL_USER=cherry_studio_prod
MYSQL_PASSWORD=SuperSecurePassword123!@#$%^&*
MYSQL_DATABASE=cherry_studio_production
MYSQL_ROOT_PASSWORD=SuperSecureRootPassword123!@#$%^&*
MYSQL_CONNECTION_LIMIT=20

# JWT 配置
JWT_SECRET=K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8z
JWT_EXPIRES_IN=7d

# API 配置
API_PORT=3000
NODE_ENV=production
```

---

## 🔒 安全配置检查清单

在部署到生产环境前，请确认：

- [ ] `ENABLE_SAAS` 已设置为 `true`
- [ ] `MYSQL_PASSWORD` 已更改为强密码（至少16字符）
- [ ] `MYSQL_ROOT_PASSWORD` 已更改为强密码（至少16字符）
- [ ] `JWT_SECRET` 已更改为强随机字符串（至少32字符）
- [ ] `NODE_ENV` 已设置为 `production`
- [ ] `.env` 文件已添加到 `.gitignore`（不会提交到 Git）
- [ ] `.env` 文件权限已限制（仅所有者可读）
- [ ] 已配置 HTTPS（生产环境）
- [ ] 已设置防火墙规则
- [ ] 已配置数据库备份策略

---

## ❓ 常见问题

### Q1: 如何快速生成所有必需的密钥和密码？

**A**: 使用以下脚本：

```bash
#!/bin/bash
echo "=== Cherry Studio SaaS 配置生成器 ==="
echo ""
echo "MySQL 密码:"
openssl rand -base64 24
echo ""
echo "MySQL Root 密码:"
openssl rand -base64 24
echo ""
echo "JWT Secret:"
openssl rand -base64 32
echo ""
echo "=== 请将这些值复制到 .env 文件中 ==="
```

保存为 `generate-secrets.sh`，然后运行：
```bash
chmod +x generate-secrets.sh
./generate-secrets.sh
```

### Q2: Docker Compose 模式下，MYSQL_HOST 应该设置什么？

**A**: 使用服务名 `mysql`（与 docker-compose.yml 中的服务名一致）

```env
MYSQL_HOST=mysql
```

### Q3: 如何验证配置是否正确？

**A**: 按以下步骤验证：

```bash
# 1. 检查服务是否启动
curl http://localhost:3000/health

# 2. 查看后端日志
docker-compose logs backend

# 3. 测试数据库连接
docker exec -it cherry-studio-backend pnpm saas:migrate

# 4. 查看 MySQL 日志
docker-compose logs mysql
```

### Q4: 配置更改后需要重启服务吗？

**A**: 是的，需要重启服务：

```bash
# Docker Compose
docker-compose restart backend

# 或完全重启
docker-compose down
docker-compose up -d
```

### Q5: 如何在不同环境使用不同配置？

**A**: 使用多个配置文件：

```bash
# 开发环境
.env.development

# 生产环境
.env.production

# 使用 dotenv-cli 加载
dotenv -e .env.production -- npm start
```

### Q6: 忘记密码怎么办？

**A**: 可以通过数据库重置：

```sql
-- 登录 MySQL
mysql -u root -p

-- 选择数据库
USE cherry_studio;

-- 查看用户
SELECT id, email, username FROM users;

-- 注意：密码是加密存储的，不能直接修改
-- 建议使用应用的重置密码功能或重新注册
```

---

## 📚 相关文档

- [详细配置文档](./docs/zh/ENV_CONFIGURATION.md)
- [SaaS 部署指南](./docs/zh/SAAS_DEPLOYMENT.md)
- [快速开始](./QUICK_START_SAAS.md)

---

## 🎯 快速参考

### 最小配置（快速测试）

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=test123456
MYSQL_ROOT_PASSWORD=root123456
JWT_SECRET=test-secret-key-for-development-only-12345678901234567890
```

### 推荐配置（Docker Compose）

```env
ENABLE_SAAS=true
MYSQL_HOST=mysql
MYSQL_PASSWORD=$(openssl rand -base64 24)
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24)
MYSQL_DATABASE=cherry_studio
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
API_PORT=3000
NODE_ENV=production
```

---

**提示**: 将上述命令的输出结果复制到 `.env` 文件中即可！
