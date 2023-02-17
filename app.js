/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * Starter Project for Messenger Platform Webview Tutorial
 *
 * Use this project as the starting point for following the
 * Messenger Platform webview tutorial.
 *
 * https://blog.messengerdevelopers.com/using-the-webview-to-create-richer-bot-to-user-interactions-ed8a789523c6
 *
 */

'use strict';

// Imports dependencies and set up http server
const express = require('express');
const body_parser = require('body-parser');
require('dotenv').config();
const routerWebhook = require('./routers/webhook');
const routerOptions = require('./routers/options');
const routerOptionsPostback = require('./routers/optionspostback');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(body_parser.json());
app.use(express.static('public'));

app.use('/webhook', routerWebhook);
app.use('/options', routerOptions);
app.use('/optionspostback', routerOptionsPostback);
app.get('/', (req, res) => {
    res.send('Hello world, I am a chat bot');
});
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;




