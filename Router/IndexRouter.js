const express = require('express');
const { homepage, signin, signout, currentUser, forgotPasswordHandler, resetForgotPassword, createNewPassword, updateProfile, updateAvatar, signup } = require('../Controllers/IndexController');
const { isAuthenticated } = require('../Middlewares/Auth');
const router = express();

router.get('/', isAuthenticated ,homepage);

router.post('/signup', signup);

router.post('/signin', signin);
router.get('/signout', isAuthenticated, signout);

router.post('/user', isAuthenticated, currentUser);

router.post('/forgot-password', forgotPasswordHandler);
router.get('/forgot-password/:id', resetForgotPassword);
router.post('/reset-password/:id', isAuthenticated ,createNewPassword);

router.post('/update-profile/:id', isAuthenticated , updateProfile);
router.post('/update-avatar/:id', isAuthenticated , updateAvatar);


module.exports = router;