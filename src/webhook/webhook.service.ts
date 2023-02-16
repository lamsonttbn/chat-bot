import { Injectable } from '@nestjs/common';
import request from 'request';
@Injectable()
export class WebhookService {
  handleMessage(senderPsid, receivedMessage) {
    let response: any;

    if (receivedMessage.text) {
      response = {
        text: `You sent the message: "${receivedMessage.text}". Now send me an image!`,
      };
    } else if (receivedMessage.attachments[0].payload.url) {
      const attachmentUrl = receivedMessage.attachments[0].payload.url;
      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this the right picture?',
                subtitle: 'Tap a button to answer.',
                image_url: attachmentUrl,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Yes!',
                    payload: 'yes',
                  },
                  {
                    type: 'postback',
                    title: 'No!',
                    payload: 'no',
                  },
                ],
              },
            ],
          },
        },
      };
    }
    this.callSendAPI(senderPsid, response);
  }

  handlePostback(senderPsid, receivedPostback) {
    let response;

    const payload = receivedPostback.payload;
    if (payload === 'yes') {
      response = { text: 'Thanks!' };
    } else if (payload === 'no') {
      response = { text: 'Oops, try sending another image.' };
    }
  }

  callSendAPI(senderPsid, response) {
    try {
      const request_body = {
        recipient: {
          id: senderPsid,
        },
        message: response,
      };

      request(
        {
          uri: 'https://graph.facebook.com/v2.6/me/messages',
          qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
          method: 'POST',
          json: request_body,
        },
        (err, _res, _body) => {
          if (!err) {
            console.log('Message sent!');
          } else {
            console.error('Unable to send message:' + err);
          }
        },
      );
    } catch (error) {
      console.error('Unable to send message:' + error);
    }
  }
}
