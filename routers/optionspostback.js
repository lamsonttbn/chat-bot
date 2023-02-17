const express = require('express');
const router = express.Router();
const {callSendAPI} = require('../helper/handleMessage');

router.get('/', (req, res) => {
  let body = req.query;
  let response = {
      "text": `Great, I will book you a ${body.bed} bed, with ${body.pillows} pillows and a ${body.view} view.`
  };

  res.status(200).send('Please close this window to return to the conversation thread.');
  callSendAPI(body.psid, response);
});

module.exports = router;