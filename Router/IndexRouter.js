const express = require('express');
const { homepage } = require('../Controllers/IndexController');
const router = express();

router.use('/', homepage);

module.exports = router;