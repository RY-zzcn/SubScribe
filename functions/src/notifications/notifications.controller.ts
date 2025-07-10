import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('test')
  async testNotification(
    @Headers('x-user-id') userId: string,
    @Body() body: { type: string },
  ) {
    if (!userId) {
      throw new BadRequestException('缺少用户ID');
    }

    if (!body.type) {
      throw new BadRequestException('缺少通知类型');
    }

    try {
      await this.notificationService.sendTestNotification(userId, body.type);
      return { success: true, message: '测试通知发送成功' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('check')
  async checkNotifications(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new BadRequestException('缺少用户ID');
    }

    try {
      await this.notificationService.checkAndNotifyUser(userId);
      return { success: true, message: '通知检查完成' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
} 