# SubScribe - 订阅管理系统

SubScribe是一个现代化的订阅管理系统，帮助用户追踪和管理各种订阅服务。

[![部署到Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRY-zzcn%2FSubScribe)
[![部署到Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RY-zzcn/SubScribe)

## 功能特点

- 订阅管理：添加、编辑和删除订阅
- 费用跟踪：监控订阅费用和总支出
- 通知提醒：到期和续费提醒
- 多渠道通知：支持Telegram、WxPusher、钉钉、企业微信
- 数据分析：订阅费用趋势和分类统计

## 技术栈

- 前端：React + Vite + Tailwind CSS + shadcn/ui
- 后端：NestJS / Express / Cloudflare Workers
- 数据库：Firebase Firestore / Cloudflare KV / D1
- 身份验证：Firebase Authentication
- 部署：Firebase / Docker / Vercel / Cloudflare

## 一键部署

### Vercel 一键部署

点击上方的"部署到Vercel"按钮，然后按照以下步骤操作：

1. 连接您的GitHub账户
2. 配置项目名称和环境变量
3. 点击"Deploy"按钮

部署完成后，您需要在Vercel仪表板中设置以下环境变量：

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Cloudflare Pages 一键部署

点击上方的"部署到Cloudflare Pages"按钮，然后按照以下步骤操作：

1. 连接您的GitHub账户
2. 配置项目名称和构建设置
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
3. 点击"Save and Deploy"按钮

部署完成后，您需要在Cloudflare Pages仪表板中设置以下环境变量：

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

对于Cloudflare Workers API，您还需要：

1. 创建KV命名空间：`wrangler kv:namespace create SUBSCRIBE_KV`
2. 更新`wrangler.toml`中的KV命名空间ID

> **注意**：如果使用"一键部署到Cloudflare Workers"按钮时遇到错误提示"在提供的目录中找不到wrangler.json、wrangler.jsnc或wrangler.toml文件"，请按照以下步骤手动部署：
>
> 1. 克隆仓库: `git clone https://github.com/RY-zzcn/SubScribe.git`
> 2. 进入目录: `cd SubScribe`
> 3. 安装依赖: `npm run install:all`
> 4. 构建前端: `npm run build`
> 5. 部署到Cloudflare: `npm run deploy:cloudflare`
>
> 或者使用Cloudflare Pages部署前端，然后单独部署Workers API。

## 部署指南

### Firebase部署

1. 安装Firebase CLI:
```bash
npm install -g firebase-tools
```

2. 登录Firebase:
```bash
firebase login
```

3. 初始化项目:
```bash
firebase init
```

4. 部署到Firebase:
```bash
firebase deploy
```

### Docker部署

1. 构建Docker镜像:
```bash
docker build -t subscribe .
```

2. 运行容器:
```bash
docker-compose up -d
```

### Vercel部署

1. 安装Vercel CLI:
```bash
npm install -g vercel
```

2. 登录Vercel:
```bash
vercel login
```

3. 部署前端:
```bash
cd frontend
vercel
```

4. 部署API:
```bash
cd api
vercel
```

5. 生产环境部署:
```bash
vercel --prod
```

### Cloudflare部署

1. 安装Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登录Cloudflare:
```bash
wrangler login
```

3. 部署前端到Cloudflare Pages:
```bash
cd frontend
wrangler pages publish dist
```

4. 部署API到Cloudflare Workers:
```bash
cd api
wrangler publish
```

5. 配置KV命名空间:
```bash
wrangler kv:namespace create SUBSCRIBE_KV
```

6. 使用项目根目录的wrangler.toml进行完整部署:
```bash
wrangler deploy
```

## 环境变量配置

### 前端环境变量 (.env)

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=your-api-url
```

### 后端环境变量 (.env)

```
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
WXPUSHER_APP_TOKEN=your-wxpusher-app-token
DINGTALK_ACCESS_TOKEN=your-dingtalk-access-token
WECOM_CORP_ID=your-wecom-corp-id
WECOM_CORP_SECRET=your-wecom-corp-secret
WECOM_AGENT_ID=your-wecom-agent-id
```

## 开发指南

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

### 后端开发

```bash
cd functions
npm install
npm run start:dev
```

### Cloudflare Worker开发

```bash
cd api
npm install
npm run dev:worker
```

### 使用Wrangler开发整个项目

```bash
npm install
npm run dev:cloudflare
```

## 许可证

MIT 