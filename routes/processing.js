const express = require('express');
const FB = require('fb');
const router = express.Router();

/* GET home page. */
router.get('/facebook', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  // Look up all of the user's facebook friends at place them in the db.
  FB.api('me/friends', (response) => {
    console.log(response);
    res.send('Done');
  });
});

module.exports = router;
