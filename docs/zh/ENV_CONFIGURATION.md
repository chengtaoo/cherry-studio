# 环境变量配置详细说明

本文档详细说明 Cherry Studio SaaS 所需的环境变量配置。

## 📋 目录

- [快速开始](#快速开始)
- [必需配置](#必需配置)
- [可选配置](#可选配置)
- [配置示例](#配置示例)
- [安全建议](#安全建议)
- [常见问题](#常见问题)

## 🚀 快速开始

### 1. 创建配置文件

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置文件
nano .env  # 或使用您喜欢的编辑器
```

### 2. 最小配置

对于快速测试，您只需要配置以下**必需项**：

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password
JWT_SECRET=your_jwt_secret_at_least_32_characters
```

### 3. 完整配置

生产环境请参考 [完整配置示例](#完整配置示例)。

---

## ✅ 必需配置

### 1. ENABLE_SAAS

**说明**: 是否启用 SaaS 模式

**类型**: 布尔值  
**默认值**: `false`  
**必需**: 是

**配置值**:
- `true` - 启用 SaaS 功能
- `false` - 禁用 SaaS 功能（使用本地存储）

**示例**:
```env
ENABLE_SAAS=true
```

---

### 2. MYSQL_HOST

**说明**: MySQL 数据库服务器地址

**类型**: 字符串  
**默认值**: `localhost`  
**必需**: 是

**配置说明**:
- **Docker Compose 模式**: 使用 `mysql`（服务名）
- **本地开发**: 使用 `localhost` 或 `127.0.0.1`
- **远程服务器**: 使用服务器 IP 地址或域名

**示例**:
```env
# Docker Compose
MYSQL_HOST=mysql

# 本地开发
MYSQL_HOST=localhost

# 远程服务器
MYSQL_HOST=192.168.1.100
MYSQL_HOST=db.example.com
```

---

### 3. MYSQL_PORT

**说明**: MySQL 数据库端口

**类型**: 整数  
**默认值**: `3306`  
**必需**: 否（有默认值）

**示例**:
```env
MYSQL_PORT=3306
```

---

### 4. MYSQL_USER

**说明**: MySQL 数据库用户名

**类型**: 字符串  
**默认值**: `cherry_studio`  
**必需**: 否（有默认值）

**安全建议**:
- 不要使用 `root` 用户
- 创建专用用户，只授予必要权限

**示例**:
```env
MYSQL_USER=cherry_studio
```

---

### 5. MYSQL_PASSWORD

**说明**: MySQL 数据库密码

**类型**: 字符串  
**默认值**: 无  
**必需**: 是

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

---

### 6. MYSQL_DATABASE

**说明**: MySQL 数据库名称

**类型**: 字符串  
**默认值**: `cherry_studio`  
**必需**: 否（有默认值）

**示例**:
```env
MYSQL_DATABASE=cherry_studio
```

---

### 7. MYSQL_ROOT_PASSWORD

**说明**: MySQL Root 用户密码（仅用于 Docker Compose 初始化）

**类型**: 字符串  
**默认值**: 无  
**必需**: 是（Docker Compose 模式）

**安全要求**:
- ⚠️ **生产环境必须更改！**
- 使用强密码（至少 16 个字符）

**示例**:
```env
MYSQL_ROOT_PASSWORD=RootPassword123!@#
```

---

### 8. JWT_SECRET

**说明**: JWT Token 签名密钥

**类型**: 字符串  
**默认值**: 无  
**必需**: 是

**安全要求**:
- ⚠️ **生产环境必须更改！**
- 至少 32 个字符
- 使用强随机字符串
- 不要使用可预测的值

**生成方法**:

```bash
# Linux/Mac - 使用 OpenSSL
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# 在线工具（不推荐用于生产环境）
# https://www.random.org/strings/
```

**示例**:
```env
JWT_SECRET=K8j2mN9pQ5rT7vW0xY3zA6bC8dE1fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2z
```

---

## 🔧 可选配置

### 1. JWT_EXPIRES_IN

**说明**: JWT Token 过期时间

**类型**: 字符串  
**默认值**: `7d`  
**必需**: 否

**格式**: `数字 + 单位`
- `s` - 秒
- `m` - 分钟
- `h` - 小时
- `d` - 天

**示例**:
```env
# 7天（默认）
JWT_EXPIRES_IN=7d

# 24小时
JWT_EXPIRES_IN=24h

# 30分钟
JWT_EXPIRES_IN=30m

# 1小时
JWT_EXPIRES_IN=1h
```

---

### 2. API_PORT

**说明**: API 服务器监听端口

**类型**: 整数  
**默认值**: `3000`  
**必需**: 否

**注意事项**:
- 确保端口未被占用
- 生产环境建议使用 80（HTTP）或 443（HTTPS）

**示例**:
```env
API_PORT=3000
```

---

### 3. NODE_ENV

**说明**: Node.js 运行环境

**类型**: 字符串  
**默认值**: `production`  
**必需**: 否

**可选值**:
- `development` - 开发模式（显示详细错误）
- `production` - 生产模式（隐藏内部错误）

**示例**:
```env
# 开发环境
NODE_ENV=development

# 生产环境
NODE_ENV=production
```

---

### 4. MYSQL_CONNECTION_LIMIT

**说明**: MySQL 连接池大小

**类型**: 整数  
**默认值**: `10`  
**必需**: 否

**建议值**:
- 小型应用: 5-10
- 中型应用: 10-20
- 大型应用: 20-50

**示例**:
```env
MYSQL_CONNECTION_LIMIT=10
```

---

## 📝 配置示例

### 开发环境配置

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置（本地开发）
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=dev_password_123
MYSQL_DATABASE=cherry_studio_dev
MYSQL_ROOT_PASSWORD=root_dev_123

# JWT 配置
JWT_SECRET=dev-secret-key-not-for-production-12345678901234567890
JWT_EXPIRES_IN=24h

# API 配置
API_PORT=3000
NODE_ENV=development
```

### Docker Compose 配置

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置（Docker Compose）
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=secure_password_here
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=secure_root_password_here

# JWT 配置
JWT_SECRET=your-very-secure-jwt-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# API 配置
API_PORT=3000
NODE_ENV=production
```

### 生产环境配置

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

## 🔒 安全建议

### 1. 密码安全

- ✅ 使用强密码（至少 16 个字符）
- ✅ 包含大小写字母、数字、特殊字符
- ✅ 不要使用常见密码（如 `password123`）
- ✅ 定期更换密码
- ✅ 不同环境使用不同密码

### 2. JWT 密钥安全

- ✅ 使用强随机字符串（至少 32 个字符）
- ✅ 不要使用可预测的值
- ✅ 定期更换密钥（需要所有用户重新登录）
- ✅ 不要将密钥提交到版本控制

### 3. 环境变量安全

- ✅ 不要将 `.env` 文件提交到 Git
- ✅ 使用 `.env.example` 作为模板
- ✅ 生产环境使用环境变量管理工具（如 AWS Secrets Manager）
- ✅ 限制 `.env` 文件访问权限

### 4. 数据库安全

- ✅ 不要使用 `root` 用户
- ✅ 创建专用用户，只授予必要权限
- ✅ 限制数据库访问 IP
- ✅ 使用 SSL/TLS 连接（生产环境）
- ✅ 定期备份数据库

### 5. 网络安全

- ✅ 生产环境使用 HTTPS
- ✅ 配置防火墙规则
- ✅ 使用反向代理（如 Nginx）
- ✅ 限制 API 访问来源（CORS）

---

## ❓ 常见问题

### Q1: 如何生成强密码？

**A**: 使用以下命令：

```bash
# Linux/Mac
openssl rand -base64 24

# 或使用 pwgen
pwgen -s 24 1
```

### Q2: 如何生成 JWT_SECRET？

**A**: 使用以下命令：

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Q3: Docker Compose 模式下 MYSQL_HOST 应该设置什么？

**A**: 使用服务名 `mysql`（与 docker-compose.yml 中的服务名一致）

```env
MYSQL_HOST=mysql
```

### Q4: 如何验证配置是否正确？

**A**: 启动服务后检查：

```bash
# 检查服务是否启动
curl http://localhost:3000/health

# 查看日志
docker-compose logs backend

# 检查数据库连接
docker exec -it cherry-studio-backend pnpm saas:migrate
```

### Q5: 配置更改后需要重启服务吗？

**A**: 是的，需要重启服务使配置生效：

```bash
# Docker Compose
docker-compose restart backend

# 或重新加载
docker-compose up -d --force-recreate backend
```

### Q6: 如何在不同环境使用不同配置？

**A**: 使用多个 `.env` 文件：

```bash
# 开发环境
.env.development

# 生产环境
.env.production

# 使用 dotenv-cli 加载
dotenv -e .env.production -- npm start
```

### Q7: 忘记密码怎么办？

**A**: 可以通过数据库直接重置：

```sql
-- 登录 MySQL
mysql -u root -p

-- 选择数据库
USE cherry_studio;

-- 查看用户
SELECT id, email, username FROM users;

-- 重置密码（需要重新生成密码哈希）
-- 建议使用应用的重置密码功能或重新注册
```

---

## 📚 相关文档

- [SaaS 部署指南](./SAAS_DEPLOYMENT.md)
- [快速开始](../QUICK_START_SAAS.md)
- [API 文档](http://localhost:3000/api-docs)

---

## 🔗 获取帮助

如有问题，请：

1. 查看 [GitHub Issues](https://github.com/CherryHQ/cherry-studio/issues)
2. 访问 [文档网站](https://docs.cherry-ai.com)
3. 加入 [Discord 社区](https://discord.gg/wez8HtpxqQ)
