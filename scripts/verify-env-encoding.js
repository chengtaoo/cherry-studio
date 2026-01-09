// Verify .env.example file encoding
const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('验证 .env.example 文件编码...\n');

try {
  // Read file as UTF-8
  const content = fs.readFileSync(envExamplePath, 'utf8');

  // Check for Chinese characters
  const checks = [
    '使用说明',
    '环境变量配置示例',
    'MySQL 数据库配置',
    '设置为 true 启用',
    '生产环境必须更改',
    'JWT 密钥',
    'API 服务端口'
  ];

  console.log('中文内容检查:');
  let allPass = true;
  checks.forEach((str, i) => {
    const found = content.includes(str);
    const status = found ? '✓' : '✗';
    const color = found ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${status}\x1b[0m Check ${i + 1}: ${str} - ${found ? '找到' : '未找到'}`);
    if (!found) allPass = false;
  });

  console.log('\n文件信息:');
  const stats = fs.statSync(envExamplePath);
  console.log(`  文件大小: ${stats.size} 字节`);
  console.log(`  文件路径: ${envExamplePath}`);

  // Check for BOM
  const buffer = fs.readFileSync(envExamplePath);
  const hasBom = buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF;
  console.log(`  BOM: ${hasBom ? '有 (不推荐)' : '无 (正确)'}`);

  // Show first few lines
  console.log('\n文件前 10 行:');
  const lines = content.split('\n').slice(0, 10);
  lines.forEach((line, i) => {
    console.log(`  ${i + 1}: ${line}`);
  });

  if (allPass) {
    console.log('\n\x1b[32m✓ 文件编码正确，中文内容正常！\x1b[0m');
    console.log('\n提示: 如果 PowerShell 显示乱码，这是控制台编码问题，不是文件问题。');
    console.log('请在 VS Code 或其他编辑器中打开文件查看，应该正常显示。');
  } else {
    console.log('\n\x1b[31m✗ 文件编码可能有问题，请运行修复脚本:\x1b[0m');
    console.log('  pnpm env:fix-encoding');
  }

} catch (error) {
  console.error('\x1b[31m✗ 读取文件失败:\x1b[0m', error.message);
  process.exit(1);
}
