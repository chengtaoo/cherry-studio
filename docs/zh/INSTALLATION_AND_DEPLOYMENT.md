# Cherry Studio SaaS 详尽安装和部署指南

本文档提供 Cherry Studio SaaS 服务的完整安装和部署说明，包括 Docker 部署和手动部署两种方式。

## 📋 目录

- [系统要求](#系统要求)
- [前置准备](#前置准备)
- [Docker 部署（推荐）](#docker-部署推荐)
- [手动部署](#手动部署)
- [配置说明](#配置说明)
- [验证部署](#验证部署)
- [生产环境部署](#生产环境部署)
- [故障排除](#故障排除)
- [维护和升级](#维护和升级)

---

## 系统要求

### 最低硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|---------|---------|
| **CPU** | 2 核心 | 4+ 核心 |
| **内存** | 4GB RAM | 8GB+ RAM |
| **存储** | 20GB 可用空间 | 50GB+ SSD |
| **网络** | 10Mbps | 100Mbps+ |

### 软件要求

#### Docker 部署方式

- **Docker**: 20.10+ 
- **Docker Compose**: 2.0+
- **操作系统**: 
  - Linux (Ubuntu 20.04+, CentOS 7+, Debian 10+)
  - macOS 10.15+
  - Windows 10/11 (WSL2) 或 Windows Server 2019+

#### 手动部署方式

- **Node.js**: 22.0.0 或更高版本
- **pnpm**: 10.27.0 或更高版本
- **MySQL**: 8.0 或更高版本（或 MariaDB 10.6+）
- **操作系统**: 
  - Linux (Ubuntu 20.04+, CentOS 7+, Debian 10+)
  - macOS 10.15+
  - Windows 10/11

---

## 前置准备

### 1. 安装 Docker 和 Docker Compose

#### Linux (Ubuntu/Debian)

```bash
# 更新系统包
sudo apt-get update

# 安装必要的依赖
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker compose version

# 将当前用户添加到 docker 组（可选，避免每次使用 sudo）
sudo usermod -aG docker $USER
# 注意：需要重新登录才能生效
```

#### Linux (CentOS/RHEL)

```bash
# 安装必要的依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker compose version
```

#### macOS

```bash
# 使用 Homebrew 安装
brew install --cask docker

# 或者下载 Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop

# 启动 Docker Desktop 应用
# 验证安装
docker --version
docker compose version
```

#### Windows

1. **下载 Docker Desktop for Windows**
   - 访问: https://www.docker.com/products/docker-desktop
   - 下载并安装 Docker Desktop

2. **启用 WSL2（推荐）**
   ```powershell
   # 以管理员身份运行 PowerShell
   wsl --install
   # 重启计算机
   ```

3. **启动 Docker Desktop**
   - 从开始菜单启动 Docker Desktop
   - 等待 Docker 启动完成

4. **验证安装**
   ```powershell
   docker --version
   docker compose version
   ```

### 2. 安装 Git

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install -y git

# CentOS/RHEL
sudo yum install -y git
```

#### macOS

```bash
# 使用 Homebrew
brew install git

# 或使用 Xcode Command Line Tools
xcode-select --install
```

#### Windows

- 下载并安装 Git for Windows: https://git-scm.com/download/win
- 或使用包管理器：
  ```powershell
  # 使用 Chocolatey
  choco install git

  # 使用 Scoop
  scoop install git
  ```

---

## Docker 部署（推荐）

Docker 部署是最简单、最推荐的方式，它会自动配置所有依赖。

### 步骤 1: 克隆项目

```bash
# 克隆仓库
git clone https://github.com/CherryHQ/cherry-studio.git
cd cherry-studio

# 或使用 SSH
git clone git@github.com:CherryHQ/cherry-studio.git
cd cherry-studio
```

### 步骤 2: 配置环境变量

#### 方法 1: 使用脚本自动生成（推荐）

```bash
# Linux/Mac
pnpm env:generate

# Windows PowerShell
pnpm env:generate:win
```

脚本会自动生成所有必需的密钥和密码，并输出完整的 `.env` 配置内容。将输出内容保存到 `.env` 文件。

#### 方法 2: 手动创建配置文件

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置文件
nano .env
# 或
vim .env
# 或
code .env  # VS Code
```

#### 必需配置项

至少需要配置以下 **4 个必需项**：

```env
# 启用 SaaS 模式
ENABLE_SAAS=true

# MySQL 数据库密码（至少16字符，包含大小写字母、数字、特殊字符）
MYSQL_PASSWORD=your_secure_password_here

# MySQL Root 密码（Docker 模式需要）
MYSQL_ROOT_PASSWORD=your_root_password_here

# JWT 密钥（至少32字符，使用强随机字符串）
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_32_characters
```

#### 生成强密码和密钥

```bash
# 生成 MySQL 密码（24 字节，Base64 编码）
openssl rand -base64 24

# 生成 JWT Secret（32 字节，Base64 编码）
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 或使用 Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 完整配置示例

```env
# ============================================
# Cherry Studio 环境变量配置
# ============================================

# ============================================
# 项目基础配置
# ============================================
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info

# ============================================
# SaaS 功能配置
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
MYSQL_CONNECTION_LIMIT=10

# ============================================
# JWT 认证配置
# ============================================
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d

# ============================================
# API 服务器配置
# ============================================
API_PORT=3000
NODE_ENV=production
```

**⚠️ 重要提示**:
- 生产环境必须更改所有默认密码和密钥！
- 不要将 `.env` 文件提交到 Git
- 详细配置说明请查看 [环境变量配置指南](../ENV_CONFIG_GUIDE.md)

### 步骤 3: 启动服务

```bash
# 启动所有服务（后台运行）
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 只查看后端日志
docker compose logs -f backend

# 只查看 MySQL 日志
docker compose logs -f mysql
```

### 步骤 4: 等待服务就绪

等待所有服务启动完成（通常需要 1-2 分钟）：

```bash
# 检查服务健康状态
docker compose ps

# 应该看到类似输出：
# NAME                      STATUS          PORTS
# cherry-studio-backend     Up (healthy)    0.0.0.0:3000->3000/tcp
# cherry-studio-mysql       Up (healthy)    0.0.0.0:3306->3306/tcp
```

### 步骤 5: 运行数据库迁移

```bash
# 方法 1: 直接执行（推荐）
docker exec -it cherry-studio-backend pnpm saas:migrate

# 方法 2: 进入容器后执行
docker exec -it cherry-studio-backend sh
pnpm saas:migrate
exit
```

**预期输出**:
```
✓ Database migration completed successfully
```

### 步骤 6: 验证部署

```bash
# 1. 检查健康状态
curl http://localhost:3000/health

# 预期响应:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}

# 2. 检查 API 文档
# 在浏览器中打开: http://localhost:3000/api-docs

# 3. 检查服务日志
docker compose logs backend | tail -20
```

### 步骤 7: 注册第一个用户

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

**成功响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "xxx",
      "email": "admin@example.com",
      "username": "admin",
      "displayName": "Administrator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

保存返回的 `token`，后续 API 调用需要使用它。

### Docker 常用命令

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose stop

# 停止并删除容器
docker compose down

# 停止并删除容器和数据卷（⚠️ 会删除所有数据）
docker compose down -v

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 重启特定服务
docker compose restart backend

# 查看资源使用情况
docker stats

# 进入容器
docker exec -it cherry-studio-backend sh

# 执行命令
docker exec -it cherry-studio-backend pnpm saas:migrate
```

---

## 手动部署

如果您不想使用 Docker，可以手动部署各个组件。

### 步骤 1: 安装 Node.js 和 pnpm

#### Linux (Ubuntu/Debian)

```bash
# 安装 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version  # 应该显示 v22.x.x
npm --version

# 安装 pnpm
npm install -g pnpm@10.27.0

# 验证安装
pnpm --version  # 应该显示 10.27.0
```

#### Linux (CentOS/RHEL)

```bash
# 安装 Node.js 22
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version

# 安装 pnpm
npm install -g pnpm@10.27.0
pnpm --version
```

#### macOS

```bash
# 使用 Homebrew
brew install node@22

# 或使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # 或 ~/.zshrc
nvm install 22
nvm use 22

# 安装 pnpm
npm install -g pnpm@10.27.0
pnpm --version
```

#### Windows

1. **下载 Node.js**
   - 访问: https://nodejs.org/
   - 下载并安装 Node.js 22 LTS 版本

2. **安装 pnpm**
   ```powershell
   npm install -g pnpm@10.27.0
   pnpm --version
   ```

### 步骤 2: 安装 MySQL

#### Linux (Ubuntu/Debian)

```bash
# 更新包列表
sudo apt-get update

# 安装 MySQL
sudo apt-get install -y mysql-server

# 启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 运行安全配置脚本
sudo mysql_secure_installation

# 验证安装
mysql --version
```

#### Linux (CentOS/RHEL)

```bash
# 安装 MySQL
sudo yum install -y mysql-server

# 启动 MySQL 服务
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 获取临时 root 密码
sudo grep 'temporary password' /var/log/mysqld.log

# 运行安全配置
sudo mysql_secure_installation

# 验证安装
mysql --version
```

#### macOS

```bash
# 使用 Homebrew
brew install mysql

# 启动 MySQL 服务
brew services start mysql

# 验证安装
mysql --version
```

#### Windows

1. **下载 MySQL**
   - 访问: https://dev.mysql.com/downloads/mysql/
   - 下载 MySQL Installer for Windows
   - 安装并配置 MySQL

2. **配置 MySQL**
   - 记住 root 密码
   - 确保 MySQL 服务正在运行

### 步骤 3: 配置 MySQL 数据库

```bash
# 登录 MySQL
mysql -u root -p

# 在 MySQL 中执行以下命令
```

```sql
-- 创建数据库
CREATE DATABASE cherry_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'cherry_studio'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- 授予权限
GRANT ALL PRIVILEGES ON cherry_studio.* TO 'cherry_studio'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user = 'cherry_studio';

-- 退出
EXIT;
```

### 步骤 4: 克隆并安装项目

```bash
# 克隆仓库
git clone https://github.com/CherryHQ/cherry-studio.git
cd cherry-studio

# 安装依赖
pnpm install

# 验证安装
pnpm --version
```

### 步骤 5: 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置文件
nano .env
```

配置以下必需项：

```env
# 启用 SaaS 模式
ENABLE_SAAS=true

# MySQL 配置（使用本地 MySQL）
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=your_secure_password_here
MYSQL_DATABASE=cherry_studio

# JWT 配置
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d

# API 配置
API_PORT=3000
NODE_ENV=production
```

### 步骤 6: 运行数据库迁移

```bash
# 运行迁移
pnpm saas:migrate

# 预期输出:
# ✓ Database migration completed successfully
```

### 步骤 7: 构建应用

```bash
# 构建项目
pnpm build

# 验证构建
ls -la out/main/index.js
```

### 步骤 8: 启动服务

#### 开发模式

```bash
pnpm dev
```

#### 生产模式

```bash
# 直接运行
NODE_ENV=production node out/main/index.js

# 或使用 PM2（推荐）
npm install -g pm2
pm2 start out/main/index.js --name cherry-studio

# 查看状态
pm2 status

# 查看日志
pm2 logs cherry-studio

# 设置开机自启
pm2 startup
pm2 save
```

### 步骤 9: 验证部署

```bash
# 检查健康状态
curl http://localhost:3000/health

# 检查 API 文档
# 在浏览器中打开: http://localhost:3000/api-docs
```

---

## 配置说明

### 环境变量详解

详细的环境变量配置说明请查看：
- [环境变量配置完整指南](../ENV_CONFIG_GUIDE.md)
- [.env.example 文件说明](./ENV_EXAMPLE_README.md)

### 端口配置

| 服务 | 默认端口 | 说明 |
|------|---------|------|
| API 服务 | 3000 | 后端 API 服务端口 |
| MySQL | 3306 | 数据库端口 |

**修改端口**:
- 在 `.env` 文件中设置 `API_PORT=8080`（或其他端口）
- 在 `docker-compose.yml` 中修改端口映射

### 数据库配置

#### Docker 模式

- `MYSQL_HOST=mysql`（使用 Docker Compose 服务名）
- 数据持久化在 Docker 卷 `mysql_data` 中

#### 手动部署模式

- `MYSQL_HOST=localhost`（或远程 MySQL 服务器地址）
- 确保 MySQL 服务正在运行

---

## 验证部署

### 1. 健康检查

```bash
curl http://localhost:3000/health
```

**预期响应**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. API 文档

在浏览器中打开: http://localhost:3000/api-docs

应该看到 Swagger API 文档界面。

### 3. 注册用户

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!",
    "displayName": "Test User"
  }'
```

### 4. 登录

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 5. 检查数据库

```bash
# Docker 模式
docker exec -it cherry-studio-mysql mysql -u cherry_studio -p cherry_studio

# 手动部署模式
mysql -u cherry_studio -p cherry_studio
```

```sql
-- 查看用户表
SELECT id, email, username, display_name, created_at FROM users;

-- 查看表结构
SHOW TABLES;
```

---

## 生产环境部署

### 1. 使用 HTTPS

#### 使用 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/cherry-studio
server {
    listen 80;
    server_name your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 2. 防火墙配置

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 数据库备份

#### 自动备份脚本

```bash
#!/bin/bash
# /usr/local/bin/backup-cherry-studio.sh

BACKUP_DIR="/backup/cherry-studio"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="cherry_studio_${DATE}.sql"

mkdir -p $BACKUP_DIR

# Docker 模式
docker exec cherry-studio-mysql mysqldump \
  -u cherry_studio \
  -p${MYSQL_PASSWORD} \
  cherry_studio > ${BACKUP_DIR}/${FILENAME}

# 压缩备份
gzip ${BACKUP_DIR}/${FILENAME}

# 删除 30 天前的备份
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${FILENAME}.gz"
```

#### 设置定时任务

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * /usr/local/bin/backup-cherry-studio.sh
```

### 4. 监控和日志

#### 使用 PM2 监控（手动部署）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start out/main/index.js --name cherry-studio

# 监控
pm2 monit

# 查看日志
pm2 logs cherry-studio

# 设置日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Docker 日志管理

```bash
# 配置日志驱动
# 在 docker-compose.yml 中添加：
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 5. 性能优化

#### 数据库优化

```sql
-- 检查慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 优化表
OPTIMIZE TABLE users;
OPTIMIZE TABLE topics;
```

#### 应用优化

- 调整 `MYSQL_CONNECTION_LIMIT` 根据并发需求
- 使用 Redis 缓存（可选）
- 启用 Gzip 压缩
- 使用 CDN 加速静态资源

---

## 故障排除

### 常见问题

#### 1. 数据库连接失败

**错误信息**: `Error: connect ECONNREFUSED` 或 `ER_ACCESS_DENIED_ERROR`

**解决方案**:

```bash
# 检查 MySQL 服务状态
# Docker 模式
docker ps | grep mysql
docker logs cherry-studio-mysql

# 手动部署模式
sudo systemctl status mysql
sudo systemctl start mysql

# 测试连接
mysql -u cherry_studio -p -h localhost

# 检查防火墙
sudo ufw status
sudo firewall-cmd --list-all

# 验证环境变量
docker exec cherry-studio-backend env | grep MYSQL
```

#### 2. 端口已被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:

```bash
# 查找占用端口的进程
# Linux/Mac
lsof -i :3000
# 或
netstat -tulpn | grep 3000

# Windows
netstat -ano | findstr :3000

# 停止占用端口的进程
kill -9 <PID>

# 或修改端口
# 在 .env 文件中设置
API_PORT=8080
```

#### 3. JWT 验证失败

**错误信息**: `Unauthorized: invalid or expired token`

**解决方案**:

```bash
# 检查 JWT_SECRET 是否设置
docker exec cherry-studio-backend env | grep JWT_SECRET

# 确保 JWT_SECRET 至少 32 字符
# 重新生成 JWT_SECRET
openssl rand -base64 32

# 更新 .env 文件并重启服务
docker compose restart backend
```

#### 4. 数据库迁移失败

**错误信息**: `Migration failed` 或 `Table already exists`

**解决方案**:

```bash
# 检查数据库连接
docker exec -it cherry-studio-mysql mysql -u cherry_studio -p

# 查看现有表
SHOW TABLES;

# 检查用户权限
SHOW GRANTS FOR 'cherry_studio'@'%';

# 重新运行迁移
docker exec -it cherry-studio-backend pnpm saas:migrate

# 如果表已存在，可能需要手动删除（⚠️ 会删除数据）
# DROP TABLE IF EXISTS users, topics, ...;
```

#### 5. Docker 容器无法启动

**错误信息**: 容器立即退出

**解决方案**:

```bash
# 查看容器日志
docker logs cherry-studio-backend

# 查看容器状态
docker ps -a

# 检查环境变量
docker exec cherry-studio-backend env

# 进入容器调试
docker run -it --rm cherry-studio:latest sh

# 检查 Docker 资源
docker system df
docker system prune  # 清理未使用的资源
```

#### 6. 内存不足

**错误信息**: `JavaScript heap out of memory`

**解决方案**:

```bash
# 增加 Node.js 内存限制
# 在 .env 文件中设置
NODE_OPTIONS=--max-old-space-size=4096

# 或增加 Docker 内存限制
# 在 docker-compose.yml 中添加：
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 4G
```

### 日志查看

```bash
# Docker Compose 日志
docker compose logs -f backend
docker compose logs -f mysql

# 查看最近 100 行日志
docker compose logs --tail=100 backend

# 查看特定时间的日志
docker compose logs --since 1h backend

# PM2 日志（手动部署）
pm2 logs cherry-studio
pm2 logs cherry-studio --lines 100

# 系统日志（Linux）
journalctl -u docker -f
```

### 获取帮助

如果遇到无法解决的问题：

1. **查看文档**
   - [完整部署指南](./SAAS_DEPLOYMENT.md)
   - [环境变量配置指南](../ENV_CONFIG_GUIDE.md)
   - [API 文档](http://localhost:3000/api-docs)

2. **检查日志**
   - 查看应用日志
   - 查看系统日志
   - 查看 Docker 日志

3. **社区支持**
   - GitHub Issues: https://github.com/CherryHQ/cherry-studio/issues
   - Discord 社区: https://discord.gg/wez8HtpxqQ

---

## 维护和升级

### 备份数据

```bash
# 备份数据库
docker exec cherry-studio-mysql mysqldump \
  -u cherry_studio \
  -p${MYSQL_PASSWORD} \
  cherry_studio > backup_$(date +%Y%m%d).sql

# 备份配置文件
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup
```

### 升级应用

```bash
# 1. 备份数据
# （见上方）

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建镜像（Docker）
docker compose build --no-cache

# 4. 停止服务
docker compose down

# 5. 启动新版本
docker compose up -d

# 6. 运行数据库迁移（如果有）
docker exec -it cherry-studio-backend pnpm saas:migrate

# 7. 验证升级
curl http://localhost:3000/health
```

### 回滚

```bash
# 1. 停止服务
docker compose down

# 2. 恢复备份
docker exec -i cherry-studio-mysql mysql \
  -u cherry_studio \
  -p${MYSQL_PASSWORD} \
  cherry_studio < backup_YYYYMMDD.sql

# 3. 切换到旧版本
git checkout <old-version-tag>

# 4. 重新构建和启动
docker compose build
docker compose up -d
```

---

## 总结

本文档提供了 Cherry Studio SaaS 的完整安装和部署指南。主要步骤：

1. ✅ **准备环境** - 安装 Docker 和必要工具
2. ✅ **配置环境变量** - 设置数据库密码和 JWT 密钥
3. ✅ **启动服务** - 使用 Docker Compose 或手动部署
4. ✅ **运行迁移** - 初始化数据库表结构
5. ✅ **验证部署** - 检查服务健康状态
6. ✅ **注册用户** - 创建第一个用户账户

**推荐使用 Docker 部署方式**，它最简单、最可靠。

如有问题，请参考 [故障排除](#故障排除) 部分或查看相关文档。

---

**相关文档**:
- [SaaS 部署指南](./SAAS_DEPLOYMENT.md)
- [快速开始指南](../QUICK_START_SAAS.md)
- [环境变量配置指南](../ENV_CONFIG_GUIDE.md)
- [API 文档](http://localhost:3000/api-docs)
