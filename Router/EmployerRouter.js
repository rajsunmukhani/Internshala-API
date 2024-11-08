const express = require('express');
const { isAuthenticated } = require('../Middlewares/Auth');
const { homepage, signup, signout, signin, currentUser, forgotPasswordHandler, resetForgotPassword, updateProfile, updateAvatar, createNewPassword, createInternship, createJob, viewInternships, viewSingleInternships, viewJobs, viewSingleJob } = require('../Controllers/EmployerController');
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

router.post('/create/internship', isAuthenticated , createInternship);
router.post('/internships', isAuthenticated , viewInternships);
router.post('/internship/:id', isAuthenticated , viewSingleInternships);

router.post('/create/job', isAuthenticated , createJob);
router.post('/jobs', isAuthenticated , viewJobs);
router.post('/job/:id', isAuthenticated , viewSingleJob);


module.exports = router;