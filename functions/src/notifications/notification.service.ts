import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { TelegramProvider } from './providers/telegram.provider';
import { WxPusherProvider } from './providers/wxpusher.provider';
import { DingTalkProvider } from './providers/dingtalk.provider';
import { WeComProvider } from './providers/wecom.provider';

export interface NotificationProvider {
  type: string;
  enabled: boolean;
  token?: string;
  chatId?: string;
  appToken?: string;
  uid?: string;
  webhook?: string;
}

@Injectable()
export class NotificationService {
  private providers: Map<string, any> = new Map();

  constructor(
    private readonly telegramProvider: TelegramProvider,
    private readonly wxpusherProvider: WxPusherProvider,
    private readonly dingtalkProvider: DingTalkProvider,
    private readonly wecomProvider: WeComProvider,
  ) {
    this.providers.set('telegram', telegramProvider);
    this.providers.set('wxpusher', wxpusherProvider);
    this.providers.set('dingtalk', dingtalkProvider);
    this.providers.set('wecom', wecomProvider);
  }

  async checkAndNotifyUser(userId: string): Promise<void> {
    try {
      const db = admin.firestore();
      
      // 获取用户信息和设置
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.log(`用户 ${userId} 不存在`);
        return;
      }

      const userData = userDoc.data();
      const settings = userData?.settings;
      const notificationDays = settings?.notificationDays || 3;
      const notificationProviders = settings?.notificationProviders || [];

      // 获取用户的活跃订阅
      const subscriptionsSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('subscriptions')
        .where('isActive', '==', true)
        .get();

      const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 找出即将到期的订阅
      const now = new Date();
      const upcomingSubscriptions = subscriptions.filter(sub => {
        const nextPaymentDate = this.calculateNextPaymentDate(
          sub.firstPaymentDate.toDate(), 
          sub.cycle
        );
        const daysUntilPayment = Math.ceil(
          (nextPaymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilPayment <= notificationDays && daysUntilPayment >= 0;
      });

      if (upcomingSubscriptions.length === 0) {
        console.log(`用户 ${userId} 没有即将到期的订阅`);
        return;
      }

      // 生成通知消息
      const message = this.generateNotificationMessage(upcomingSubscriptions, userData.email);

      // 发送通知到所有启用的渠道
      const enabledProviders = notificationProviders.filter((provider: NotificationProvider) => provider.enabled);
      
      for (const providerConfig of enabledProviders) {
        try {
          const provider = this.providers.get(providerConfig.type);
          if (provider) {
            await provider.send(message, providerConfig);
            console.log(`通知已发送到 ${providerConfig.type} for user ${userId}`);
          }
        } catch (error) {
          console.error(`发送通知到 ${providerConfig.type} 失败:`, error);
        }
      }

    } catch (error) {
      console.error(`检查用户 ${userId} 订阅时发生错误:`, error);
      throw error;
    }
  }

  private calculateNextPaymentDate(firstPaymentDate: Date, cycle: any): Date {
    const now = new Date();
    let nextDate = new Date(firstPaymentDate);
    
    while (nextDate <= now) {
      switch (cycle.unit) {
        case 'day':
          nextDate.setDate(nextDate.getDate() + cycle.value);
          break;
        case 'week':
          nextDate.setDate(nextDate.getDate() + (cycle.value * 7));
          break;
        case 'month':
          nextDate.setMonth(nextDate.getMonth() + cycle.value);
          break;
        case 'year':
          nextDate.setFullYear(nextDate.getFullYear() + cycle.value);
          break;
      }
    }
    
    return nextDate;
  }

  private generateNotificationMessage(subscriptions: any[], userEmail: string): string {
    const now = new Date();
    let message = `📅 订阅续费提醒\n\n`;
    message += `用户: ${userEmail}\n`;
    message += `时间: ${now.toLocaleString('zh-CN')}\n\n`;
    
    subscriptions.forEach((sub, index) => {
      const nextPaymentDate = this.calculateNextPaymentDate(
        sub.firstPaymentDate.toDate(), 
        sub.cycle
      );
      const daysUntilPayment = Math.ceil(
        (nextPaymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      message += `${index + 1}. ${sub.name}\n`;
      message += `   💰 费用: ${sub.price} ${sub.currency}\n`;
      message += `   📂 分类: ${sub.category}\n`;
      message += `   📅 下次付款: ${nextPaymentDate.toLocaleDateString('zh-CN')}\n`;
      message += `   ⏰ 剩余天数: ${daysUntilPayment} 天\n\n`;
    });
    
    message += `💡 请及时处理订阅续费事宜。`;
    
    return message;
  }

  // 手动发送测试通知
  async sendTestNotification(userId: string, providerType: string): Promise<boolean> {
    try {
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error('用户不存在');
      }

      const userData = userDoc.data();
      const notificationProviders = userData?.settings?.notificationProviders || [];
      const providerConfig = notificationProviders.find((p: NotificationProvider) => p.type === providerType);
      
      if (!providerConfig || !providerConfig.enabled) {
        throw new Error('通知渠道未配置或未启用');
      }

      const provider = this.providers.get(providerType);
      if (!provider) {
        throw new Error('不支持的通知渠道');
      }

      const testMessage = `🧪 SubScribe 测试通知\n\n这是一条测试消息，用于验证通知配置是否正确。\n\n时间: ${new Date().toLocaleString('zh-CN')}`;
      
      await provider.send(testMessage, providerConfig);
      return true;
    } catch (error) {
      console.error('发送测试通知失败:', error);
      throw error;
    }
  }
} 