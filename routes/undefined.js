const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (_req, res, _next) => {
  res.render('index', {
    title: 'Нет такого маршрута'
  });
});

module.exports = router;