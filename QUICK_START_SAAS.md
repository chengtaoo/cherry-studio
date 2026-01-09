# Cherry Studio SaaS 快速开始指南

本指南将帮助您快速部署和运行 Cherry Studio SaaS 服务。

> 💡 **提示**: 如需更详细的安装和部署说明，请查看 [详尽安装和部署指南](./docs/zh/INSTALLATION_AND_DEPLOYMENT.md)

## 前置要求

- Docker 和 Docker Compose（推荐）
- 或 Node.js 22+ 和 MySQL 8.0+

## 使用 Docker Compose（最简单）

### 1. 克隆仓库

```bash
git clone https://github.com/CherryHQ/cherry-studio.git
cd cherry-studio
```

### 2. 配置环境变量

#### 方法 1: 使用脚本生成（推荐，最简单）

```bash
# Linux/Mac - 自动生成所有密钥
pnpm env:generate

# Windows - 自动生成所有密钥
pnpm env:generate:win
```

脚本会自动生成所有必需的密钥和密码，并输出完整的 `.env` 配置内容。

#### 方法 2: 手动创建

```bash
# 如果存在 .env.example
cp .env.example .env

# 或查看示例内容
cat ENV_EXAMPLE_CONTENT.md
```

编辑 `.env` 文件，至少设置以下**4个必需项**：

```env
# 启用 SaaS 模式
ENABLE_SAAS=true

# MySQL 密码（至少16字符，包含大小写字母、数字、特殊字符）
MYSQL_PASSWORD=your_secure_password_here

# MySQL Root 密码（Docker 模式需要）
MYSQL_ROOT_PASSWORD=your_root_password_here

# JWT 密钥（至少32字符，使用强随机字符串）
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_32_characters
```

**快速生成密钥**:
```bash
# 生成 MySQL 密码
openssl rand -base64 24

# 生成 JWT Secret
openssl rand -base64 32
```

**详细配置说明**: 
- [环境变量配置指南](./ENV_CONFIG_GUIDE.md) - 完整配置说明
- [.env.example 内容](./ENV_EXAMPLE_CONTENT.md) - 示例文件内容
- [README_ENV.md](./README_ENV.md) - 快速参考

### 3. 启动服务

```bash
docker-compose up -d
```

### 4. 运行数据库迁移

```bash
docker exec -it cherry-studio-backend pnpm saas:migrate
```

### 5. 验证部署

```bash
# 检查服务状态
curl http://localhost:3000/health

# 查看 API 文档
# 在浏览器中打开: http://localhost:3000/api-docs
```

## 注册第一个用户

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "SecurePassword123!",
    "displayName": "Administrator"
  }'
```

响应示例：

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "username": "admin",
      "displayName": "Administrator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

保存返回的 `token`，后续 API 调用需要使用它。

## 登录

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

## 同步数据

使用获取的 token 同步数据：

```bash
TOKEN="your_token_here"

# 同步所有数据
curl -X POST http://localhost:3000/v1/sync/all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "topics": [],
    "settings": {},
    "assistants": {},
    "knowledgeBases": {},
    "knowledgeNotes": [],
    "files": []
  }'
```

## 查看数据

```bash
# 获取所有话题
curl -X GET http://localhost:3000/v1/sync/topics \
  -H "Authorization: Bearer $TOKEN"

# 获取设置
curl -X GET http://localhost:3000/v1/sync/settings \
  -H "Authorization: Bearer $TOKEN"

# 获取助手
curl -X GET http://localhost:3000/v1/sync/assistants \
  -H "Authorization: Bearer $TOKEN"
```

## 下一步

1. **配置前端**: 修改前端代码以支持登录和数据同步
2. **设置 HTTPS**: 在生产环境使用 Nginx 配置 HTTPS
3. **备份策略**: 设置定期数据库备份
4. **监控**: 配置日志监控和性能监控

## 故障排除

### 数据库连接失败

```bash
# 检查 MySQL 容器状态
docker ps | grep mysql

# 查看 MySQL 日志
docker logs cherry-studio-mysql

# 测试数据库连接
docker exec -it cherry-studio-mysql mysql -u cherry_studio -p
```

### API 服务无法启动

```bash
# 查看后端日志
docker logs cherry-studio-backend

# 检查环境变量
docker exec cherry-studio-backend env | grep MYSQL
```

### 迁移失败

```bash
# 手动进入容器运行迁移
docker exec -it cherry-studio-backend sh
pnpm saas:migrate
```

## 更多信息

- 完整部署文档: [docs/zh/SAAS_DEPLOYMENT.md](./docs/zh/SAAS_DEPLOYMENT.md)
- API 文档: http://localhost:3000/api-docs
- GitHub Issues: https://github.com/CherryHQ/cherry-studio/issues
