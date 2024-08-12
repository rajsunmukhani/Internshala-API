const express = require('express');
const { homepage } = require('../Controllers/IndexController');
const router = express();

router.get('/', homepage);

module.exports = router;