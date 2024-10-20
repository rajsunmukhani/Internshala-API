const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const EmployerModel = require("../Models/EmployerModel");
const Internships = require("../Models/Internships");
const jobs = require("../Models/jobs");
const ErrorHandler = require("../utils/ErrorHandler");
const { initImageKit } = require("../utils/imagekit");
const { sendmail } = require("../utils/nodemailer");
const { sendToken } = require("../utils/sendToken");
const path = require('path');

exports.homepage = catchAsyncErrors(async (req, res, next) => {
    res.json({message : 'secured employer page'});
});

exports.signup = catchAsyncErrors(async(req,res,next) => {
    const employer = await new EmployerModel(req.body).save();
    sendToken(employer,201,res);
});

exports.signin = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findOne({email : req.body.email}).select('+password').exec();
    if (!employer) {
        return next(new ErrorHandler('User Not Found', 404))
    }
    const isMatch = employer.comparePasswords(req.body.password);
    if (!isMatch) {
        return next(new ErrorHandler('Wrong Credentials', 500));
    }
    sendToken(employer,200,res);
});

exports.signout = catchAsyncErrors(async(req,res,next) => {
    res.clearCookie('token').json({
        message : 'Signedout Succesfully!',
    });
});


exports.currentUser = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findById(req.id).exec();
    res.json({employer});
});

exports.forgotPasswordHandler = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findOne({email : req.body.email});
    if (!employer) {
        return next(new ErrorHandler('User not found!', 404));
    };

    employer.passwordUpdateToken = "1";
    await employer.save();

    const url = `${req.protocol}://${req.get('host')}/employer/forgot-password/${employer._id}`;
    sendmail(req,res,next,url);
});

exports.resetForgotPassword = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findById(req.params.id).exec();

    if (!employer) {
        return next(new ErrorHandler('User not found!', 404));
    };

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }

    if (employer.passwordUpdateToken === "1") {
        employer.passwordUpdateToken = "0";
        employer.password = req.body.password;
        await employer.save();
        res.status(200).json({
            message : 'password updated successfully!'
        })
    }else{
        res.status(500).json({
            message : 'Internal Server Error!'
        })
    }

});

exports.createNewPassword = catchAsyncErrors(async(req,res,next) => {

    const employer = await EmployerModel.findById(req.id).exec();

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }
    
    employer.password = req.body.password;
    employer.save();
    sendToken(employer,201,res)

});

exports.updateProfile = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({
        message : 'profile updated successfully!'
    })
});

exports.updateAvatar = catchAsyncErrors(async(req,res,next) => {
    const employer = await EmployerModel.findById(req.params.id);
    const file = req.files.orgLogo;
    const modfiedFileName = `logo-${Date.now()}${path.extname(file.name)}`;

    const imagekit = initImageKit();
    
    if (employer.orgLogo.fileID !== "") {
        await imagekit.deleteFile(employer.orgLogo.fileID);
    };

    const {fileID,url} = await imagekit.upload({
        file : file.data,
        fileName : modfiedFileName
    });

    employer.orgLogo = {fileID,url};
    await employer.save();
    res.json({
        message : 'file uploaded successfully!'
    })
});

exports.createInternship = catchAsyncErrors(async(req,res,next) => {
    const internship = await new Internships(req.body).save();
    const employer = await EmployerModel.findById(req.id).exec();

    employer.internships.push(internship._id);
    internship.employer = employer._id;

    await employer.save();
    await internship.save();

    res.status(201).json({
        success : true,
        internship
    })
});


exports.viewInternships = catchAsyncErrors(async(req,res,next) => {
    const {internships} = await EmployerModel.findById(req.id).populate('internships').exec();
    
    res.status(200).json({
        success : true,
        internships
    });
    
});


exports.viewSingleInternships = catchAsyncErrors(async(req,res,next) => {
    const internship = await Internships.findById(req.params.id).exec();

    if (!internship) {
        return next(new ErrorHandler('Internship not found', 404));
    }
    
    res.status(200).json({
        success : true,
        internship
    });
});



exports.createJob = catchAsyncErrors(async(req,res,next) => {
    const job = await new jobs(req.body).save();
    const employer = await EmployerModel.findById(req.id).exec();
    
    employer.jobs.push(job._id);
    job.employer = employer._id;
    
    await employer.save();
    await job.save();
    
    res.status(201).json({
        success : true,
        job
    });
});

exports.viewJobs = catchAsyncErrors(async(req,res,next) => {
    const {jobs} = await EmployerModel.findById(req.id).populate('jobs').exec();
    
    res.status(200).json({
        success : true,
        jobs
    });
    
});


exports.viewSingleJob = catchAsyncErrors(async(req,res,next) => {
    const job = await jobs.findById(req.params.id).exec();

    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    }
    
    res.status(200).json({
        success : true,
        job
    });
});