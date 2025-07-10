import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { NotificationService } from './notifications/notification.service';

// 初始化Firebase Admin
admin.initializeApp();

// 创建Express实例
const server = express();

// 创建NestJS应用
const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  return app.init();
};

// 初始化NestJS应用
createNestServer(server)
  .then(() => console.log('NestJS应用已初始化'))
  .catch(err => console.error('NestJS应用初始化失败:', err));

// 导出HTTP函数
export const api = functions.https.onRequest(server);

// 每天检查订阅并发送通知
export const checkSubscriptions = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Asia/Shanghai')
  .onRun(async () => {
    try {
      console.log('开始检查订阅...');
      
      // 获取所有用户
      const usersSnapshot = await admin.firestore().collection('users').get();
      const notificationService = new NotificationService();
      
      // 遍历每个用户，检查订阅
      for (const userDoc of usersSnapshot.docs) {
        try {
          const userId = userDoc.id;
          console.log(`检查用户 ${userId} 的订阅`);
          await notificationService.checkAndNotifyUser(userId);
        } catch (error) {
          console.error(`处理用户订阅时出错:`, error);
        }
      }
      
      console.log('订阅检查完成');
      return null;
    } catch (error) {
      console.error('订阅检查失败:', error);
      return null;
    }
  }); 