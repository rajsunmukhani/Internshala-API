const express = require('express');
const { homepage, createJobSeeker, signinJobSeeker, signoutJobSeeker, currentUser } = require('../Controllers/IndexController');
const { isAuthenticated } = require('../Middlewares/Auth');
const router = express();

router.get('/', isAuthenticated ,homepage);

router.post('/signup/jobSeeker', createJobSeeker);

router.post('/signin/jobSeeker', signinJobSeeker);
router.get('/signout/jobSeeker', isAuthenticated, signoutJobSeeker);

router.post('/student', isAuthenticated, currentUser);

module.exports = router;