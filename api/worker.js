// Cloudflare Worker API入口文件
import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 初始化Firebase
// 注意：在Cloudflare Worker中使用Firebase需要特殊配置
// 这里使用KV或D1作为替代存储方案

// 订阅API路由
router.get('/api/subscriptions', async (request) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: '缺少用户ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 从KV或D1获取订阅数据
    // 示例代码，实际实现需要根据Cloudflare环境调整
    const subscriptions = await SUBSCRIBE_KV.get(`subscriptions:${userId}`, { type: 'json' }) || [];
    
    return new Response(JSON.stringify(subscriptions), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取订阅失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 通知API路由
router.post('/api/notifications/send', async (request) => {
  try {
    const body = await request.json();
    const { userId, channel, message } = body;
    
    if (!userId || !channel || !message) {
      return new Response(JSON.stringify({ error: '参数不完整' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取用户通知设置
    const userData = await SUBSCRIBE_KV.get(`user:${userId}`, { type: 'json' });
    if (!userData) {
      return new Response(JSON.stringify({ error: '用户不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const channelConfig = userData.notificationChannels?.[channel];
    if (!channelConfig) {
      return new Response(JSON.stringify({ error: '通知渠道未配置' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 发送通知
    // 实际实现需要调用各通知提供商API
    
    return new Response(JSON.stringify({ success: true, message: '通知已发送' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '发送通知失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 捕获所有其他路由
router.all('*', () => new Response('404 Not Found', { status: 404 }));

// 处理请求
export default {
  async fetch(request, env, ctx) {
    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }
    
    // 将环境变量绑定到全局，以便路由处理函数使用
    globalThis.SUBSCRIBE_KV = env.SUBSCRIBE_KV;
    
    // 处理请求
    const response = await router.handle(request);
    
    // 添加CORS头到响应
    Object.keys(corsHeaders).forEach(key => {
      response.headers.set(key, corsHeaders[key]);
    });
    
    return response;
  }
}; 