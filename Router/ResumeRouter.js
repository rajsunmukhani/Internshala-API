const express = require('express');
const { isAuthenticated } = require('../Middlewares/Auth');
const { resume, addEducation, editEducation, deleteEducation, addSkills, editSkills, deleteSkills, addAccomplishments, editAccomplishments, deleteAccomplishments, addCourses, editCourses, deleteCourses, addProjects, editProjects, deleteProjects, addResponsibilities, editResponsibilities, deleteResponsibilities, addJobs, editJobs, deleteJobs, addInternships, editInternships, deleteInternships } = require('../Controllers/ResumeController');
const router = express();

router.get('/', isAuthenticated, resume );

// --------------- Education Routes --------------------

router.post('/add-edu', isAuthenticated, addEducation );
router.post('/edit-edu/:id', isAuthenticated, editEducation );
router.post('/delete-edu/:id', isAuthenticated, deleteEducation );


// --------------- Skills Routes --------------------

router.post('/add-skills', isAuthenticated, addSkills );
router.post('/edit-skills/:id', isAuthenticated, editSkills );
router.post('/delete-skills/:id', isAuthenticated, deleteSkills );


// --------------- Accomplishments Routes --------------------

router.post('/add-accomplishments', isAuthenticated, addAccomplishments );
router.post('/edit-accomplishments/:id', isAuthenticated, editAccomplishments );
router.post('/delete-accomplishments/:id', isAuthenticated, deleteAccomplishments );


// --------------- Courses Routes --------------------

router.post('/add-course', isAuthenticated, addCourses );
router.post('/edit-course/:id', isAuthenticated, editCourses );
router.post('/delete-course/:id', isAuthenticated, deleteCourses );


// --------------- Projects Routes --------------------

router.post('/add-project', isAuthenticated, addProjects );
router.post('/edit-project/:id', isAuthenticated, editProjects );
router.post('/delete-project/:id', isAuthenticated, deleteProjects );


// --------------- Responsibilities Routes --------------------

router.post('/add-resp', isAuthenticated, addResponsibilities );
router.post('/edit-resp/:id', isAuthenticated, editResponsibilities );
router.post('/delete-resp/:id', isAuthenticated, deleteResponsibilities );


// --------------- Jobs Routes --------------------

router.post('/add-jobs', isAuthenticated, addJobs );
router.post('/edit-jobs/:id', isAuthenticated, editJobs );
router.post('/delete-jobs/:id', isAuthenticated, deleteJobs );

// --------------- Internships Routes --------------------

router.post('/add-internships', isAuthenticated, addInternships );
router.post('/edit-internships/:id', isAuthenticated, editInternships );
router.post('/delete-internships/:id', isAuthenticated, deleteInternships );

module.exports = router;