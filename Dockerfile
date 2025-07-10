# 构建阶段
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制前端依赖文件
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 复制前端源代码并构建
COPY frontend ./frontend/
RUN cd frontend && npm run build

# 复制后端依赖文件
COPY functions/package*.json ./functions/
RUN cd functions && npm install

# 复制后端源代码并构建
COPY functions ./functions/
RUN cd functions && npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 安装 Firebase CLI
RUN npm install -g firebase-tools

# 复制前端构建产物
COPY --from=builder /app/frontend/dist ./frontend/dist

# 复制后端构建产物
COPY --from=builder /app/functions/lib ./functions/lib
COPY --from=builder /app/functions/package*.json ./functions/

# 复制Firebase配置文件
COPY firebase.json .
COPY firestore.rules .
COPY firestore.indexes.json .
COPY .firebaserc .

# 安装后端生产依赖
RUN cd functions && npm install --only=production

# 暴露端口
EXPOSE 5000 5001 8080 9099

# 启动Firebase模拟器
CMD ["firebase", "emulators:start"] 