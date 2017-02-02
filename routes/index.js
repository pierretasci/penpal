const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('index', { title: 'PenPal', username: req.user.name });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'PenPal - Login' });
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
