import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';
import { TelegramProvider } from './providers/telegram.provider';
import { WxPusherProvider } from './providers/wxpusher.provider';
import { DingTalkProvider } from './providers/dingtalk.provider';
import { WeComProvider } from './providers/wecom.provider';

@Module({
  providers: [
    NotificationService,
    TelegramProvider,
    WxPusherProvider,
    DingTalkProvider,
    WeComProvider,
  ],
  controllers: [NotificationsController],
  exports: [NotificationService],
})
export class NotificationsModule {} 