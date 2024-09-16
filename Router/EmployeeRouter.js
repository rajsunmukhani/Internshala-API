const express = require('express');
const { isAuthenticated } = require('../Middlewares/Auth');
const { homepage, signup, signout, signin, currentUser, forgotPasswordHandler, resetForgotPassword, updateProfile, updateAvatar, createNewPassword } = require('../Controllers/EmployeeController');
const router = express();

router.get('/', isAuthenticated, homepage);

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', isAuthenticated ,signout);

router.post('/user', isAuthenticated ,currentUser);

router.post('/forgot-password', forgotPasswordHandler);
router.get('/forgot-password/:id', resetForgotPassword);
router.post('/reset-password/:id', isAuthenticated ,createNewPassword);

router.post('/update-profile/:id', isAuthenticated , updateProfile);
router.post('/update-logo/:id', isAuthenticated , updateAvatar);


module.exports = router;