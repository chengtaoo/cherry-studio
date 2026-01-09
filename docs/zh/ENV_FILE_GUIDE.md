# .env.example 文件完整说明

## 📖 什么是 .env.example？

`.env.example` 是一个**配置模板文件**，它的作用是：

1. **提供配置示例** - 告诉开发者需要配置哪些环境变量
2. **版本控制友好** - 可以安全地提交到 Git（不包含真实密码）
3. **快速开始** - 新开发者可以复制它来创建自己的 `.env` 文件

## 🔍 您项目中的 .env.example 文件

### 当前内容说明

您项目中的 `.env.example` 文件目前包含：

```env
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
```

**这些配置的含义**:

| 配置项 | 说明 | 用途 |
|--------|------|------|
| `NODE_OPTIONS` | Node.js 运行参数 | 设置最大内存为 8GB，防止内存溢出 |
| `API_KEY` | API 密钥 | 用于调用 AI 服务的 API（示例值） |
| `BASE_URL` | API 基础地址 | AI 服务的 API 端点地址 |
| `MODEL` | 默认模型 | 默认使用的 AI 模型名称 |
| `CSLOGGER_MAIN_LEVEL` | 主进程日志级别 | 控制主进程的日志输出（info/warn/error/debug） |
| `CSLOGGER_RENDERER_LEVEL` | 渲染进程日志级别 | 控制渲染进程的日志输出 |

**这些是项目原有的配置，用于开发和生产环境。**

## ✅ 可以修改 .env.example 吗？

**完全可以！** 实际上，`.env.example` 文件就是用来修改的：

### ✅ 可以做的：

1. **添加新配置项** - 添加 SaaS 相关的配置示例
2. **更新示例值** - 更新为更合适的示例值
3. **添加注释说明** - 帮助用户理解每个配置的作用
4. **组织配置结构** - 使用注释分组，让配置更清晰

### ❌ 不应该做的：

1. **不要放入真实密码** - 这是模板文件，会被提交到 Git
2. **不要放入敏感信息** - 只放示例值

### 🔄 修改的影响

**修改 `.env.example` 不会影响运行**，因为：

- ✅ 它只是模板文件
- ✅ 实际运行使用的是 `.env` 文件（不会被提交到 Git）
- ✅ 修改 `.env.example` 只是更新了模板，不会影响现有配置
- ✅ 新开发者克隆项目后，会看到更新后的模板

## 🚀 建议的更新

我已经为您更新了 `.env.example` 文件，添加了 SaaS 相关配置。现在文件包含：

### 1. 原有配置（保持不变）

```env
NODE_OPTIONS=--max-old-space-size=8000
API_KEY="sk-xxx"
BASE_URL="https://api.siliconflow.cn/v1/"
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507"
CSLOGGER_MAIN_LEVEL=info
CSLOGGER_RENDERER_LEVEL=info
```

### 2. 新增 SaaS 配置

```env
# SaaS 功能开关
ENABLE_SAAS=true

# MySQL 配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=cherry_studio_password_change_me
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=rootpassword_change_me

# JWT 配置
JWT_SECRET=change-this-secret-key-in-production-use-a-strong-random-string-at-least-32-characters
JWT_EXPIRES_IN=7d

# API 配置
API_PORT=3000
NODE_ENV=production
```

## 📋 使用流程

### 1. 查看模板

```bash
# 查看 .env.example 文件
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
# 或
code .env
```

### 3. 修改真实值

在 `.env` 文件中：
- 替换所有示例值（如 `change_me`）为真实值
- 生成强密码和密钥
- 根据实际环境调整配置

## 🔐 安全说明

### .gitignore 配置

您的项目 `.gitignore` 文件中有：

```gitignore
# ENV
.env
.env.*
!.env.example
```

**含义**:
- `.env` - 忽略实际的配置文件（包含真实密码）
- `.env.*` - 忽略所有以 `.env.` 开头的文件
- `!.env.example` - **不忽略** `.env.example`（可以提交到 Git）

### 为什么这样设计？

1. **`.env.example` 可以提交** - 它是模板，不包含敏感信息
2. **`.env` 不能提交** - 它包含真实密码和密钥
3. **新开发者友好** - 克隆项目后立即知道需要配置什么

## 📝 配置项分类

### 原有配置（项目基础）

这些配置用于项目的基础运行：

- `NODE_OPTIONS` - Node.js 运行参数
- `API_KEY` - API 密钥
- `BASE_URL` - API 地址
- `MODEL` - 默认模型
- `CSLOGGER_*` - 日志配置

### 新增配置（SaaS 功能）

这些配置用于 SaaS 云端同步功能：

- `ENABLE_SAAS` - 启用/禁用 SaaS
- `MYSQL_*` - 数据库配置
- `JWT_*` - 认证配置
- `API_PORT` - API 端口
- `NODE_ENV` - 运行环境

## 🎯 快速参考

### 最小配置（快速测试）

如果只想快速测试，只需要配置：

```env
ENABLE_SAAS=true
MYSQL_PASSWORD=test123456
MYSQL_ROOT_PASSWORD=root123456
JWT_SECRET=test-secret-key-for-development-only-12345678901234567890
```

其他项都有默认值。

### 完整配置（生产环境）

生产环境需要配置所有项，并使用强密码和密钥。

## 📚 相关文档

- [环境变量配置完整指南](../ENV_CONFIG_GUIDE.md) - 详细配置说明
- [.env.example 完整内容](../ENV_EXAMPLE_CONTENT.md) - 完整示例内容
- [SaaS 部署指南](./SAAS_DEPLOYMENT.md) - 部署流程
- [环境变量配置文档](./ENV_CONFIGURATION.md) - 中文详细文档

## ❓ 常见问题

### Q1: 修改 .env.example 会影响运行吗？

**A**: 不会。`.env.example` 只是模板，实际运行使用的是 `.env` 文件。

### Q2: 需要提交 .env.example 到 Git 吗？

**A**: 是的，应该提交。它是模板文件，不包含敏感信息，可以帮助其他开发者快速开始。

### Q3: .env 文件应该提交吗？

**A**: **绝对不要！** `.env` 文件包含真实密码和密钥，已经在 `.gitignore` 中被忽略。

### Q4: 如何快速生成所有密钥？

**A**: 使用提供的脚本：

```bash
pnpm env:generate        # Linux/Mac
pnpm env:generate:win    # Windows
```

---

**总结**: `.env.example` 是模板文件，可以安全地修改和提交到 Git。我已经为您更新了文件，添加了 SaaS 相关配置，同时保留了原有配置。
