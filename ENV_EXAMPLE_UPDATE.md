# .env.example 文件更新说明

## 📋 文件作用

`.env.example` 是一个**配置模板文件**，用于：

1. ✅ **提供配置示例** - 告诉开发者需要配置哪些环境变量
2. ✅ **版本控制** - 可以安全地提交到 Git（不包含敏感信息）
3. ✅ **快速开始** - 新开发者可以复制它来创建 `.env` 文件

## 🔍 原有内容说明

您项目中的 `.env.example` 文件原本包含：

```env
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
```

**这些配置的含义**:

- `NODE_OPTIONS` - Node.js 运行参数，设置最大内存为 8GB
- `API_KEY` - API 密钥（示例值）
- `BASE_URL` - AI 服务的 API 地址
- `MODEL` - 默认使用的 AI 模型
- `CSLOGGER_*` - 日志级别配置

**这些是项目原有的配置，用于项目的基础运行。**

## ✅ 已更新内容

我已经为您更新了 `.env.example` 文件，**保留了所有原有配置**，并添加了 SaaS 相关配置。

### 更新内容：

1. ✅ **保留原有配置** - 所有原有配置项都保留
2. ✅ **添加 SaaS 配置** - 新增云端同步相关配置
3. ✅ **添加详细注释** - 每个配置项都有说明
4. ✅ **组织配置结构** - 使用注释分组，更清晰

### 新增的配置项：

- `ENABLE_SAAS` - 启用/禁用 SaaS 模式
- `MYSQL_HOST` - MySQL 服务器地址
- `MYSQL_PORT` - MySQL 端口
- `MYSQL_USER` - MySQL 用户名
- `MYSQL_PASSWORD` - MySQL 密码
- `MYSQL_DATABASE` - 数据库名
- `MYSQL_ROOT_PASSWORD` - MySQL Root 密码
- `MYSQL_CONNECTION_LIMIT` - 连接池大小
- `JWT_SECRET` - JWT 密钥
- `JWT_EXPIRES_IN` - Token 过期时间
- `API_PORT` - API 端口
- `NODE_ENV` - 运行环境

## 🔄 修改的影响

### ✅ 可以安全修改

**修改 `.env.example` 文件是安全的**，因为：

1. ✅ 它只是模板文件，不会影响运行
2. ✅ 实际运行使用的是 `.env` 文件
3. ✅ 修改模板不会影响现有配置
4. ✅ 可以提交到 Git（不包含敏感信息）

### ❌ 不会影响运行

- 修改 `.env.example` **不会**影响当前运行的应用
- 修改 `.env.example` **不会**影响现有的 `.env` 文件
- 修改 `.env.example` **不会**改变任何配置值

### ✅ 会帮助新用户

- 新开发者克隆项目后，会看到更新后的模板
- 可以快速了解需要配置哪些环境变量
- 可以快速复制模板创建自己的 `.env` 文件

## 📝 如何使用

### 1. 查看更新后的模板

```bash
cat .env.example
# 或
type .env.example  # Windows
```

### 2. 创建自己的配置

```bash
# 复制模板
cp .env.example .env

# 编辑配置
nano .env
```

### 3. 修改真实值

在 `.env` 文件中：
- 替换所有 `change_me` 为真实值
- 生成强密码和密钥
- 根据实际环境调整

## 🔐 安全说明

### .gitignore 配置

项目中的 `.gitignore` 文件配置：

```gitignore
# ENV
.env          # 忽略实际配置文件（包含真实密码）
.env.*        # 忽略所有 .env.* 文件
!.env.example # 不忽略 .env.example（可以提交）
```

**含义**:
- ✅ `.env.example` **可以提交** - 它是模板，不包含敏感信息
- ❌ `.env` **不能提交** - 它包含真实密码和密钥

### 为什么这样设计？

1. **模板可以共享** - `.env.example` 帮助所有开发者快速开始
2. **真实配置保密** - `.env` 包含敏感信息，不能提交
3. **版本控制友好** - 模板更新可以跟踪，真实配置保持私有

## 📋 配置项分类

### 原有配置（项目基础）

这些配置用于项目的基础运行，**已全部保留**：

```env
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
```

### 新增配置（SaaS 功能）

这些配置用于 SaaS 云端同步功能：

```env
# SaaS 功能开关
ENABLE_SAAS=true

# MySQL 数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=cherry_studio_password_change_me
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=rootpassword_change_me

# JWT 认证配置
JWT_SECRET=change-this-secret-key-in-production-use-a-strong-random-string-at-least-32-characters
JWT_EXPIRES_IN=7d

# API 服务器配置
API_PORT=3000
NODE_ENV=production
```

## 🎯 快速开始

### 步骤 1: 复制模板

```bash
cp .env.example .env
```

### 步骤 2: 编辑配置

```bash
nano .env
```

### 步骤 3: 修改必需项

至少修改以下 4 项：

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=your_secure_password
MYSQL_ROOT_PASSWORD=your_root_password
JWT_SECRET=your_jwt_secret_at_least_32_characters
```

### 步骤 4: 生成密钥（推荐）

```bash
# 使用脚本自动生成
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

## 📚 相关文档

- [.env.example 文件说明](./docs/zh/ENV_FILE_EXPLANATION.md) - 详细说明
- [环境变量配置完整指南](./ENV_CONFIG_GUIDE.md) - 完整配置说明
- [.env.example 完整内容](./ENV_EXAMPLE_CONTENT.md) - 完整示例内容
- [SaaS 部署指南](./docs/zh/SAAS_DEPLOYMENT.md) - 部署流程

## ❓ 常见问题

### Q1: 修改 .env.example 会影响运行吗？

**A**: **不会**。`.env.example` 只是模板文件，实际运行使用的是 `.env` 文件。

### Q2: 需要提交 .env.example 到 Git 吗？

**A**: **是的，应该提交**。它是模板文件，不包含敏感信息，可以帮助其他开发者快速开始。

### Q3: .env 文件应该提交吗？

**A**: **绝对不要！** `.env` 文件包含真实密码和密钥，已经在 `.gitignore` 中被忽略。

### Q4: 原有配置会被覆盖吗？

**A**: **不会**。我已经保留了所有原有配置，只是添加了新的 SaaS 配置。

### Q5: 如何快速生成所有密钥？

**A**: 使用提供的脚本：

```bash
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

---

## ✅ 总结

1. **`.env.example` 是模板文件** - 可以安全地修改和提交到 Git
2. **已更新文件** - 保留了所有原有配置，添加了 SaaS 配置
3. **不影响运行** - 修改模板不会影响现有配置
4. **帮助新用户** - 新开发者可以快速了解需要配置什么

**文件已更新完成！** 🎉
