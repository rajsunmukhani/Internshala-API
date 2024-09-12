const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const StudentModel = require("../Models/StudentModel");
const {v4 : uuid} = require('uuid');

exports.resume = catchAsyncErrors(async(req, res, next) => {
    const {resume} = await StudentModel.findById(req.id).exec();
    res.json({
        message : 'Secured Resume : ',
        resume,
    })
});

// --------------- Education Routes --------------------

exports.addEducation = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.education.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Education Successfull!',
        Student
    })
});

exports.editEducation = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const eduIndex = Student.resume.education.findIndex(i => i.id === req.params.id)
    Student.resume.education[eduIndex] = {...Student.resume.education[eduIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Education Successfull!',
        Student
    })
});

exports.deleteEducation = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredEdu = Student.resume.education.filter(i => i.id !== req.params.id);
    Student.resume.education = filteredEdu;
    await Student.save();

    res.json({
        message : 'Update Education Successfull!',
        Student
    })
});

// --------------- Skills Routes --------------------

exports.addSkills = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.skills.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Skills Successfull!',
        Student
    })
});

exports.editSkills = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const skillsIndex = Student.resume.skills.findIndex(i => i.id === req.params.id)
    Student.resume.skills[skillsIndex] = {...Student.resume.skills[skillsIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Skills Successfull!',
        Student
    })
});

exports.deleteSkills = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredSkills = Student.resume.skills.filter(i => i.id !== req.params.id);
    Student.resume.skills = filteredSkills;
    await Student.save();

    res.json({
        message : 'Update Skills Successfull!',
        Student
    })
});

// --------------- Accomplishments Routes --------------------

exports.addAccomplishments = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.accomplishments.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Accomplishments Successfull!',
        Student
    })
});

exports.editAccomplishments = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const AccomplishmentsIndex = Student.resume.accomplishments.findIndex(i => i.id === req.params.id)
    Student.resume.accomplishments[AccomplishmentsIndex] = {...Student.resume.accomplishments[AccomplishmentsIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Accomplishments Successfull!',
        Student
    })
});

exports.deleteAccomplishments = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredAccomplishments = Student.resume.accomplishments.filter(i => i.id !== req.params.id);
    Student.resume.accomplishments = filteredAccomplishments;
    await Student.save();

    res.json({
        message : 'Update Accomplishments Successfull!',
        Student
    })
});

// --------------- Courses Routes --------------------

exports.addCourses = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.courses.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Courses Successfull!',
        Student
    })
});

exports.editCourses = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const CoursesIndex = Student.resume.courses.findIndex(i => i.id === req.params.id)
    Student.resume.courses[CoursesIndex] = {...Student.resume.courses[CoursesIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Courses Successfull!',
        Student
    })
});

exports.deleteCourses = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredCourses = Student.resume.courses.filter(i => i.id !== req.params.id);
    Student.resume.courses = filteredCourses;
    await Student.save();

    res.json({
        message : 'Update Courses Successfull!',
        Student
    })
});

// --------------- Projects Routes --------------------

exports.addProjects = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.projects.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Projects Successfull!',
        Student
    })
});

exports.editProjects = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const ProjectsIndex = Student.resume.projects.findIndex(i => i.id === req.params.id)
    Student.resume.projects[ProjectsIndex] = {...Student.resume.projects[ProjectsIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Projects Successfull!',
        Student
    })
});

exports.deleteProjects = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredProjects = Student.resume.projects.filter(i => i.id !== req.params.id);
    Student.resume.projects = filteredProjects;
    await Student.save();

    res.json({
        message : 'Update Projects Successfull!',
        Student
    })
});

// --------------- Responsibilities Routes --------------------

exports.addResponsibilities = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.responsiblities.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Responsibilities Successfull!',
        Student
    })
});

exports.editResponsibilities = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const ResponsibilitiesIndex = Student.resume.responsiblities.findIndex(i => i.id === req.params.id)
    Student.resume.responsiblities[ResponsibilitiesIndex] = {...Student.resume.responsiblities[ResponsibilitiesIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Responsibilities Successfull!',
        Student
    })
});

exports.deleteResponsibilities = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredResponsibilities = Student.resume.responsiblities.filter(i => i.id !== req.params.id);
    Student.resume.responsiblities = filteredResponsibilities;
    await Student.save();

    res.json({
        message : 'Update Responsibilities Successfull!',
        Student
    })
});

// --------------- Jobs Routes --------------------

exports.addJobs = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.jobs.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Jobs Successfull!',
        Student
    })
});

exports.editJobs = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const JobsIndex = Student.resume.jobs.findIndex(i => i.id === req.params.id)
    Student.resume.jobs[JobsIndex] = {...Student.resume.jobs[JobsIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Jobs Successfull!',
        Student
    })
});

exports.deleteJobs = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredJobs = Student.resume.jobs.filter(i => i.id !== req.params.id);
    Student.resume.jobs = filteredJobs;
    await Student.save();

    res.json({
        message : 'Update Jobs Successfull!',
        Student
    })
});

// --------------- Internships Routes --------------------

exports.addInternships = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    Student.resume.internships.push({...req.body, id : uuid()});
    await Student.save();

    res.json({
        message : 'Update Internships Successfull!',
        Student
    })
});

exports.editInternships = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);

    const InternshipsIndex = Student.resume.internships.findIndex(i => i.id === req.params.id)
    Student.resume.internships[InternshipsIndex] = {...Student.resume.internships[InternshipsIndex],...req.body};

    await Student.save();
    
    res.json({
        message : 'Update Internships Successfull!',
        Student
    })
});

exports.deleteInternships = catchAsyncErrors(async(req, res, next) => {
    const Student = await StudentModel.findById(req.id);
    
    const filteredInternships = Student.resume.internships.filter(i => i.id !== req.params.id);
    Student.resume.internships = filteredInternships;
    await Student.save();

    res.json({
        message : 'Update Internships Successfull!',
        Student
    })
});