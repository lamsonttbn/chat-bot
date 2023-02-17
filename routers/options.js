const express = require('express');
const router = express.Router();

// Serve the options path and set required headers
router.get('/', (req, res, next) => {
  let referer = req.get('Referer');
  if (referer) {
      if (referer.indexOf('www.messenger.com') >= 0) {
          res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
      } else if (referer.indexOf('www.facebook.com') >= 0) {
          res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
      }
      res.sendFile('public/options.html', {root: __dirname});
  }
});

module.exports = router;