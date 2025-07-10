import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NotificationProvider } from '../notification.service';

@Injectable()
export class TelegramProvider {
  async send(message: string, config: NotificationProvider): Promise<void> {
    if (!config.token || !config.chatId) {
      throw new Error('Telegram 配置不完整：缺少 token 或 chatId');
    }

    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;
    
    try {
      const response = await axios.post(url, {
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML'
      });

      if (!response.data.ok) {
        throw new Error(`Telegram API 错误: ${response.data.description}`);
      }

      console.log('Telegram 消息发送成功');
    } catch (error) {
      console.error('Telegram 消息发送失败:', error);
      throw error;
    }
  }

  // 验证配置是否有效
  async validateConfig(config: NotificationProvider): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${config.token}/getMe`;
      const response = await axios.get(url);
      return response.data.ok;
    } catch (error) {
      console.error('Telegram 配置验证失败:', error);
      return false;
    }
  }
} 