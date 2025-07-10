// Vercel API入口文件
const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// 初始化Firebase Admin
const app = initializeApp();
const db = getFirestore();

const server = express();
server.use(cors());
server.use(express.json());

// 订阅相关API
server.get('/api/subscriptions', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }
    
    const subscriptionsSnapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .get();
    
    const subscriptions = [];
    subscriptionsSnapshot.forEach(doc => {
      subscriptions.push({ id: doc.id, ...doc.data() });
    });
    
    return res.json(subscriptions);
  } catch (error) {
    console.error('获取订阅失败:', error);
    return res.status(500).json({ error: '获取订阅失败' });
  }
});

// 通知相关API
server.post('/api/notifications/send', async (req, res) => {
  try {
    const { userId, channel, message } = req.body;
    
    if (!userId || !channel || !message) {
      return res.status(400).json({ error: '参数不完整' });
    }
    
    // 获取用户通知设置
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    const userData = userDoc.data();
    const channelConfig = userData.notificationChannels?.[channel];
    
    if (!channelConfig) {
      return res.status(400).json({ error: '通知渠道未配置' });
    }
    
    // 根据不同渠道发送通知
    // 实际实现会调用各通知提供商API
    
    return res.json({ success: true, message: '通知已发送' });
  } catch (error) {
    console.error('发送通知失败:', error);
    return res.status(500).json({ error: '发送通知失败' });
  }
});

// 监听端口
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`API服务运行在端口 ${port}`);
});

module.exports = server; 