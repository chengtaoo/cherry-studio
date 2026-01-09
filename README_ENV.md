# .env 文件配置说明

## 📋 概述

`.env` 文件用于配置 Cherry Studio SaaS 服务的环境变量。本文档说明如何创建和配置此文件。

## 🚀 快速开始

### 方法 1: 使用脚本生成（最简单，推荐）

```bash
# Linux/Mac
pnpm env:generate

# Windows
pnpm env:generate:win
```

脚本会自动生成所有必需的密钥和密码，并输出完整的配置内容。

### 方法 2: 手动创建

1. **查看示例内容**: 打开 [ENV_EXAMPLE_CONTENT.md](./ENV_EXAMPLE_CONTENT.md) 文件
2. **复制内容**: 复制文件中的完整 `.env.example` 内容
3. **创建文件**: 保存为 `.env` 文件
4. **修改配置**: 根据您的环境修改配置值

### 方法 3: 从模板创建

如果项目中已有 `.env.example` 文件：

```bash
cp .env.example .env
nano .env  # 编辑配置文件
```

---

## ✅ 必需配置项（4项）

至少需要配置以下 4 项，其他项都有默认值：

### 1. ENABLE_SAAS

```env
ENABLE_SAAS=true
```

**说明**: 启用 SaaS 模式，设置为 `true`。

---

### 2. MYSQL_PASSWORD

```env
MYSQL_PASSWORD=your_secure_password_here
```

**要求**:
- ⚠️ 生产环境必须更改！
- 至少 16 个字符
- 包含大小写字母、数字、特殊字符

**生成方法**:
```bash
openssl rand -base64 24
```

---

### 3. MYSQL_ROOT_PASSWORD

```env
MYSQL_ROOT_PASSWORD=your_root_password_here
```

**要求**:
- ⚠️ 生产环境必须更改！
- 仅 Docker Compose 模式需要
- 使用强密码

**生成方法**:
```bash
openssl rand -base64 24
```

---

### 4. JWT_SECRET

```env
JWT_SECRET=your_jwt_secret_at_least_32_characters
```

**要求**:
- ⚠️ 生产环境必须更改！
- 至少 32 个字符
- 使用强随机字符串

**生成方法**:
```bash
openssl rand -base64 32
```

---

## 📝 完整配置示例

### 开发环境（最小配置）

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=dev_password_123
MYSQL_ROOT_PASSWORD=root_dev_123
JWT_SECRET=dev-secret-key-not-for-production-12345678901234567890
```

### Docker Compose（推荐配置）

```env
# SaaS 功能
ENABLE_SAAS=true

# MySQL 配置
MYSQL_HOST=mysql
MYSQL_PORT=3306
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

---

## 🔐 一键生成所有密钥

### Linux/Mac

```bash
#!/bin/bash
echo "MySQL 密码: $(openssl rand -base64 24)"
echo "MySQL Root 密码: $(openssl rand -base64 24)"
echo "JWT Secret: $(openssl rand -base64 32)"
```

### Windows PowerShell

```powershell
function Generate-Password {
    $bytes = New-Object byte[] 24
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

Write-Host "MySQL 密码: $(Generate-Password)"
Write-Host "MySQL Root 密码: $(Generate-Password)"
Write-Host "JWT Secret: $((New-Object byte[] 32 | ForEach-Object { [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($_); [Convert]::ToBase64String($_) }))"
```

### 使用项目脚本（最简单）

```bash
# Linux/Mac
pnpm env:generate

# Windows
pnpm env:generate:win
```

---

## 📚 详细文档

- **[环境变量配置完整指南](./ENV_CONFIG_GUIDE.md)** - 详细的配置说明和示例
- **[.env.example 内容](./ENV_EXAMPLE_CONTENT.md)** - 完整的示例文件内容
- **[环境变量配置文档](./docs/zh/ENV_CONFIGURATION.md)** - 中文详细文档
- **[SaaS 部署指南](./docs/zh/SAAS_DEPLOYMENT.md)** - 完整部署流程

---

## ❓ 常见问题

### Q1: .env.example 文件在哪里？

**A**: 
- 如果文件不存在，请查看 [ENV_EXAMPLE_CONTENT.md](./ENV_EXAMPLE_CONTENT.md) 获取完整内容
- 或使用 `pnpm env:generate` 脚本自动生成

### Q2: 最小配置需要哪些项？

**A**: 只需要 4 项：
- `ENABLE_SAAS=true`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`（Docker 模式）
- `JWT_SECRET`

### Q3: 如何快速生成所有密钥？

**A**: 使用脚本：
```bash
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

### Q4: Docker Compose 模式下 MYSQL_HOST 应该设置什么？

**A**: 使用服务名 `mysql`：
```env
MYSQL_HOST=mysql
```

---

## 🔒 安全提醒

⚠️ **生产环境必须更改**:
1. `MYSQL_PASSWORD` - 使用强密码
2. `MYSQL_ROOT_PASSWORD` - 使用强密码
3. `JWT_SECRET` - 使用强随机字符串（至少32字符）

不要使用默认值或示例值！

---

**提示**: 使用 `pnpm env:generate` 脚本可以自动生成所有必需的密钥！
