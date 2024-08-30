const express = require('express');
const { homepage, createJobSeeker, signinJobSeeker, signoutJobSeeker, currentUser, forgotPasswordHandler, resetForgotPassword, createNewPassword } = require('../Controllers/IndexController');
const { isAuthenticated } = require('../Middlewares/Auth');
const router = express();

router.get('/', isAuthenticated ,homepage);

router.post('/signup/jobSeeker', createJobSeeker);

router.post('/signin/jobSeeker', signinJobSeeker);
router.get('/signout/jobSeeker', isAuthenticated, signoutJobSeeker);

router.post('/student', isAuthenticated, currentUser);

router.post('/student/forgot-password', forgotPasswordHandler);
router.get('/student/forgot-password/:id', resetForgotPassword);
router.get('/student/reset-password/:id', isAuthenticated ,createNewPassword);

module.exports = router;