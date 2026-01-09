# .env.example 文件编码修复说明

## 问题描述

如果 `.env.example` 文件中的中文注释显示为乱码（如 `?`），这通常是文件编码问题导致的。

## 解决方案

### 方法 1: 使用修复脚本（推荐）

```bash
# Windows PowerShell
pnpm env:fix-encoding

# 或直接运行
powershell -ExecutionPolicy Bypass -File scripts/fix-env-example-encoding.ps1
```

### 方法 2: 手动修复

1. **使用 VS Code 打开文件**
   ```bash
   code .env.example
   ```

2. **检查编码**
   - 点击右下角的编码显示（如 "UTF-8"）
   - 如果显示 "UTF-8 with BOM" 或其他编码，需要转换

3. **转换为 UTF-8 无 BOM**
   - 点击右下角编码 → "通过编码保存" → 选择 "UTF-8"
   - 或使用命令面板（Ctrl+Shift+P）→ "Change File Encoding" → "Save with Encoding" → "UTF-8"

4. **保存文件**

### 方法 3: 使用其他编辑器

#### Notepad++

1. 打开 `.env.example` 文件
2. 菜单：编码 → 转为 UTF-8 编码
3. 保存文件

#### Sublime Text

1. 打开 `.env.example` 文件
2. File → Save with Encoding → UTF-8
3. 保存文件

## 验证修复

### 在 VS Code 中验证

1. 打开 `.env.example` 文件
2. 检查中文注释是否正常显示
3. 如果正常，说明文件编码已修复

### 在命令行中验证

```bash
# Windows PowerShell（可能需要设置编码）
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Get-Content .env.example -Encoding UTF8 | Select-Object -First 10

# Linux/Mac
cat .env.example | head -10
```

## 文件编码说明

`.env.example` 文件应该使用：
- **编码格式**: UTF-8
- **BOM**: 无 BOM（UTF-8 without BOM）

这是标准的环境变量文件格式，兼容性最好。

## 常见问题

### Q: PowerShell 显示乱码，但文件本身正常？

**A**: 这是 PowerShell 控制台编码问题，不是文件问题。文件在 VS Code 或其他编辑器中应该正常显示。

解决方法：
```powershell
# 设置 PowerShell 输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

### Q: 如何确保文件使用正确的编码？

**A**: 使用修复脚本：
```bash
pnpm env:fix-encoding
```

### Q: Git 提交时显示编码警告？

**A**: 确保文件使用 UTF-8 无 BOM 编码。可以使用以下命令检查：
```bash
# 检查文件编码（需要 file 命令）
file -bi .env.example
# 应该显示: text/plain; charset=utf-8
```

## 预防措施

1. **使用 UTF-8 编码的编辑器**
   - VS Code（推荐）
   - Notepad++
   - Sublime Text

2. **避免使用 Windows 记事本**
   - 记事本默认使用 ANSI 编码，可能导致编码问题

3. **使用修复脚本**
   - 在修改 `.env.example` 后运行修复脚本
   - 确保编码正确

## 相关文档

- [.env.example 文件说明](./ENV_EXAMPLE_README.md)
- [环境变量配置指南](../ENV_CONFIG_GUIDE.md)
