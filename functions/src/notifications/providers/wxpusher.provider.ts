import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NotificationProvider } from '../notification.service';

@Injectable()
export class WxPusherProvider {
  async send(message: string, config: NotificationProvider): Promise<void> {
    if (!config.appToken || !config.uid) {
      throw new Error('WxPusher 配置不完整：缺少 appToken 或 uid');
    }

    const url = 'https://wxpusher.zjiecode.com/api/send/message';
    
    try {
      const response = await axios.post(url, {
        appToken: config.appToken,
        content: message,
        summary: 'SubScribe 订阅续费提醒',
        contentType: 1, // 文本
        uids: [config.uid]
      });

      if (response.data.code !== 1000) {
        throw new Error(`WxPusher API 错误: ${response.data.msg}`);
      }

      console.log('WxPusher 消息发送成功');
    } catch (error) {
      console.error('WxPusher 消息发送失败:', error);
      throw error;
    }
  }

  // 验证配置是否有效
  async validateConfig(config: NotificationProvider): Promise<boolean> {
    if (!config.appToken || !config.uid) {
      return false;
    }
    
    try {
      // WxPusher API没有提供验证接口，发送一条测试消息
      const url = 'https://wxpusher.zjiecode.com/api/send/message';
      const response = await axios.post(url, {
        appToken: config.appToken,
        content: '配置验证测试',
        summary: 'SubScribe 配置测试',
        contentType: 1,
        uids: [config.uid]
      });
      
      return response.data.code === 1000;
    } catch (error) {
      console.error('WxPusher 配置验证失败:', error);
      return false;
    }
  }
} 