const express = require('express');
const { homepage, createJobSeeker } = require('../Controllers/IndexController');
const router = express();

router.get('/', homepage);

router.post('/signup/jobSeeker', createJobSeeker);

module.exports = router;