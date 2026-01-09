#!/bin/bash

# Cherry Studio SaaS 环境变量生成脚本
# 用途: 快速生成 .env 文件所需的所有密钥和密码

echo "=========================================="
echo "Cherry Studio SaaS 配置生成器"
echo "=========================================="
echo ""

# 生成 MySQL 密码
MYSQL_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')
echo "MySQL 密码:"
echo "$MYSQL_PASSWORD"
echo ""

# 生成 MySQL Root 密码
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')
echo "MySQL Root 密码:"
echo "$MYSQL_ROOT_PASSWORD"
echo ""

# 生成 JWT Secret
JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
echo "JWT Secret:"
echo "$JWT_SECRET"
echo ""

echo "=========================================="
echo "生成的 .env 配置内容:"
echo "=========================================="
echo ""
cat << EOF
# Cherry Studio SaaS 环境变量配置
# 生成时间: $(date)

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
EOF

echo ""
echo "=========================================="
echo "请将上述内容保存到 .env 文件中"
echo "=========================================="
