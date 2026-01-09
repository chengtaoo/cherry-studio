# .env.example 文件编码问题解决指南

## ✅ 文件已修复

根据验证脚本，`.env.example` 文件已经使用正确的 UTF-8 编码（无 BOM），所有中文内容都正常。

## 🔍 如何验证文件是否正确

### 方法 1: 使用验证脚本（推荐）

```bash
# 运行验证脚本
pnpm env:verify

# 或直接运行
node scripts/verify-env-encoding.js
```

如果看到所有检查项都显示 `✓`，说明文件编码正确。

### 方法 2: 在 VS Code 中查看

1. **打开文件**

   ```bash
   code .env.example
   ```

2. **检查编码**

   - 查看 VS Code 右下角的编码显示
   - 应该显示 "UTF-8"
   - 如果显示其他编码，点击它 → "通过编码重新打开" → 选择 "UTF-8"

3. **查看内容**
   - 中文注释应该正常显示
   - 如果显示正常，说明文件没问题

### 方法 3: 使用 Node.js 验证

```bash
node -e "const fs=require('fs');const c=fs.readFileSync('.env.example','utf8');console.log(c.substring(0,200));"
```

如果输出中能看到正常的中文（如 "使用说明"、"环境变量配置示例"），说明文件正确。

## ⚠️ 如果仍然看到乱码

### 情况 1: PowerShell 控制台显示乱码

**这是控制台编码问题，不是文件问题！**

解决方法：

```powershell
# 设置 PowerShell 输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001

# 然后重新查看文件
Get-Content .env.example -Encoding UTF8
```

或者直接使用 VS Code 打开文件查看。

### 情况 2: 编辑器显示乱码

如果 VS Code 或其他编辑器显示乱码：

1. **检查编辑器编码设置**

   - VS Code: 右下角查看编码，如果不是 UTF-8，点击选择 UTF-8
   - Notepad++: 编码 → 转为 UTF-8 编码

2. **重新修复文件**

   ```bash
   pnpm env:fix-encoding
   ```

3. **验证修复**
   ```bash
   pnpm env:verify
   ```

### 情况 3: Git 显示乱码

如果 Git 提交或查看时显示乱码：

```bash
# 配置 Git 使用 UTF-8
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8

# Windows 额外配置
git config --global core.autocrlf true
```

## 🔧 修复脚本

如果文件确实有问题，使用修复脚本：

```bash
# 使用 npm 脚本
pnpm env:fix-encoding

# 或直接运行
node scripts/fix-env-encoding.js
```

修复脚本会：

1. 使用 Node.js 以 UTF-8 编码写入文件
2. 确保文件使用 UTF-8 无 BOM 编码
3. 验证中文内容是否正常

## 📋 文件编码标准

`.env.example` 文件应该使用：

- **编码格式**: UTF-8
- **BOM**: 无 BOM（UTF-8 without BOM）
- **换行符**: LF（Unix 风格）或 CRLF（Windows 风格）都可以

## ✅ 验证清单

在确认文件修复后，检查以下内容：

- [ ] 运行 `pnpm env:verify` 所有检查项通过
- [ ] 在 VS Code 中打开文件，中文正常显示
- [ ] 文件右下角显示 "UTF-8" 编码
- [ ] 文件大小约为 3000-4000 字节（根据内容而定）
- [ ] 文件不包含 BOM（UTF-8 without BOM）

## 🆘 仍然无法解决？

如果以上方法都无法解决问题：

1. **删除文件重新创建**

   ```bash
   # 删除旧文件
   rm .env.example

   # 运行修复脚本重新创建
   pnpm env:fix-encoding
   ```

2. **从 ENV_EXAMPLE_CONTENT.md 手动复制**

   - 打开 `ENV_EXAMPLE_CONTENT.md`
   - 复制代码块中的内容
   - 在 VS Code 中创建新文件 `.env.example`
   - 粘贴内容并保存为 UTF-8 编码

3. **检查系统区域设置**
   - Windows: 控制面板 → 区域 → 管理 → 更改系统区域设置
   - 确保设置为支持 UTF-8 的区域

## 📚 相关文档

- [.env.example 文件说明](./ENV_EXAMPLE_README.md)
- [环境变量配置指南](../ENV_CONFIG_GUIDE.md)
- [安装和部署指南](./INSTALLATION_AND_DEPLOYMENT.md)
