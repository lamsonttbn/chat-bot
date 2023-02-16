import {
  Controller,
  Get,
  Post,
  Body,
  ForbiddenException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  handleMessage(@Body() body: any) {
    if (body.object === 'page') {
      body.entry.forEach((entry: any) => {
        const webhookEvent = entry.messaging[0];
        console.log(webhookEvent);

        const senderPsid = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsid);

        if (webhookEvent.message) {
          return this.webhookService.handleMessage(
            senderPsid,
            webhookEvent.message,
          );
        } else {
          console.log(
            '🚀 ~ file: webhook.controller.ts:37 ~ WebhookController ~ body.entry.forEach ~ webhookEvent',
            webhookEvent,
          );
          return this.webhookService.handlePostback(
            senderPsid,
            webhookEvent.postback,
          );
        }
      });
    } else {
      return new NotFoundException('Not Found');
    }
  }

  @Get()
  verifyWebhook(@Query() query) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return challenge;
      } else {
        return new ForbiddenException('Forbidden');
      }
    }
  }
}
