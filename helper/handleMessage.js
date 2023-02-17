request = require('request'),
// Handles messages events
exports.handleMessage = (sender_psid, received_message) => {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
      switch (received_message.text.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
          case "room preferences":
              response = this.setRoomPreferences(sender_psid);
              break;
          default:
              response = {
                  "text": `You sent the message: "${received_message.text}".`
              };
              break;
      }
  } else {
      response = {
          "text": `Sorry, I don't understand what you mean.`
      }
  }

  // Send the response message
  this.callSendAPI(sender_psid, response);
}

// Define the template and webview
exports.setRoomPreferences = (sender_psid) => {
  let response = {
      attachment: {
          type: "template",
          payload: {
              template_type: "button",
              text: "OK, let's set your room preferences so I won't need to ask for them in the future.",
              buttons: [{
                  type: "web_url",
                  url: SERVER_URL + "/options",
                  title: "Set preferences",
                  webview_height_ratio: "compact",
                  messenger_extensions: true
              }]
          }
      }
  };

  return response;
}

// Sends response messages via the Send API
exports.callSendAPI = (sender_psid, response) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  // Construct the message body
  let request_body = {
      "recipient": {
          "id": sender_psid
      },
      "message": response
  };
  console.log(request_body);
  // Send the HTTP request to the Messenger Platform
  request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": {"access_token": PAGE_ACCESS_TOKEN},
      "method": "POST",
      "json": request_body
  }, (err, res, body) => {
      if (!err) {
          console.log('message sent!')
      } else {
          console.error("Unable to send message:" + err);
      }
  });
}

exports.handlePostback = (senderPsid, receivedPostback) => {
    let response;
  
    // Get the payload for the postback
    let payload = receivedPostback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
      response = { 'text': 'Oops, try sending another image.' };
    }
    // Send the message to acknowledge the postback
    this.callSendAPI(senderPsid, response);
  }