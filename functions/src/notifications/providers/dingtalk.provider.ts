import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NotificationProvider } from '../notification.service';

@Injectable()
export class DingTalkProvider {
  async send(message: string, config: NotificationProvider): Promise<void> {
    if (!config.webhook) {
      throw new Error('钉钉 配置不完整：缺少 webhook');
    }

    try {
      const response = await axios.post(config.webhook, {
        msgtype: 'text',
        text: {
          content: message
        }
      });

      if (response.data.errcode !== 0) {
        throw new Error(`钉钉 API 错误: ${response.data.errmsg}`);
      }

      console.log('钉钉 消息发送成功');
    } catch (error) {
      console.error('钉钉 消息发送失败:', error);
      throw error;
    }
  }

  // 验证配置是否有效
  async validateConfig(config: NotificationProvider): Promise<boolean> {
    if (!config.webhook) {
      return false;
    }
    
    try {
      const response = await axios.post(config.webhook, {
        msgtype: 'text',
        text: {
          content: '配置验证测试'
        }
      });
      
      return response.data.errcode === 0;
    } catch (error) {
      console.error('钉钉 配置验证失败:', error);
      return false;
    }
  }
} 