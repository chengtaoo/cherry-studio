# Cherry Studio SaaS 环境变量生成脚本 (PowerShell)
# 用途: 快速生成 .env 文件所需的所有密钥和密码

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Cherry Studio SaaS 配置生成器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 生成随机密码的函数
function Generate-RandomPassword {
    param([int]$Length = 24)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# 生成 MySQL 密码
$MYSQL_PASSWORD = Generate-RandomPassword -Length 24
Write-Host "MySQL 密码:" -ForegroundColor Green
Write-Host $MYSQL_PASSWORD
Write-Host ""

# 生成 MySQL Root 密码
$MYSQL_ROOT_PASSWORD = Generate-RandomPassword -Length 24
Write-Host "MySQL Root 密码:" -ForegroundColor Green
Write-Host $MYSQL_ROOT_PASSWORD
Write-Host ""

# 生成 JWT Secret
$JWT_SECRET = Generate-RandomPassword -Length 32
Write-Host "JWT Secret:" -ForegroundColor Green
Write-Host $JWT_SECRET
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "生成的 .env 配置内容:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$envContent = @"
# Cherry Studio SaaS 环境变量配置
# 生成时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# SaaS 功能开关
ENABLE_SAAS=true

# MySQL 数据库配置
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=cherry_studio
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_DATABASE=cherry_studio
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD

# JWT 认证配置
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# API 服务器配置
API_PORT=3000
NODE_ENV=production
"@

Write-Host $envContent

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "请将上述内容保存到 .env 文件中" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 询问是否直接保存到文件
$save = Read-Host "是否直接保存到 .env 文件? (y/n)"
if ($save -eq "y" -or $save -eq "Y") {
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "配置已保存到 .env 文件" -ForegroundColor Green
} else {
    Write-Host "请手动复制上述内容到 .env 文件" -ForegroundColor Yellow
}
