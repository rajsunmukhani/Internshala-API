const express = require('express');
const { homepage, createJobSeeker, signinJobSeeker, signoutJobSeeker, currentUser, forgotPasswordHandler, resetForgotPassword, createNewPassword, updateProfile, updateAvatar } = require('../Controllers/IndexController');
const { isAuthenticated } = require('../Middlewares/Auth');
const router = express();

router.get('/', isAuthenticated ,homepage);

router.post('/student/signup', createJobSeeker);

router.post('/student/signin', signinJobSeeker);
router.get('/student/signout', isAuthenticated, signoutJobSeeker);

router.post('/student', isAuthenticated, currentUser);

router.post('/student/forgot-password', forgotPasswordHandler);
router.get('/student/forgot-password/:id', resetForgotPassword);
router.post('/student/reset-password/:id', isAuthenticated ,createNewPassword);

router.post('/student/update-profile/:id', isAuthenticated , updateProfile);
router.post('/student/update-avatar/:id', isAuthenticated , updateAvatar);


module.exports = router;