#!/bin/bash

# 显示执行的命令
set -x

# 停止脚本在出错时退出
set -e

echo "开始部署 SubScribe 应用..."

# 更新代码
echo "正在更新代码..."
git pull

# 安装依赖
echo "正在安装依赖..."
npm run install:all

# 构建前端
echo "正在构建前端..."
cd frontend && npm run build && cd ..

# 构建后端
echo "正在构建后端..."
cd functions && npm run build && cd ..

# 部署到Firebase
echo "正在部署到Firebase..."
firebase deploy

echo "部署完成!" 