const express = require('express');
const { homepage, createJobSeeker, signinJobSeeker, signoutJobSeeker } = require('../Controllers/IndexController');
const router = express();

router.get('/', homepage);

router.post('/signup/jobSeeker', createJobSeeker);

router.post('/signin/jobSeeker', signinJobSeeker);
router.post('/signout/jobSeeker', signoutJobSeeker);

module.exports = router;