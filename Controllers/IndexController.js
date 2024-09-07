const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const StudentModel = require("../Models/StudentModel");
const ErrorHandler = require('../utils/ErrorHandler');
const { initImageKit } = require("../utils/imagekit");
const { sendmail } = require("../utils/nodemailer");
const { sendToken } = require("../utils/sendToken");
const path = require('path');


exports.homepage = catchAsyncErrors(async(req,res,next) => {
    res.json({message : 'homepage'})   
});

exports.createJobSeeker = catchAsyncErrors(async(req,res,next) => {
    const student = await new StudentModel(req.body).save();
    sendToken(student,200,res);
});

exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findOne({email : req.body.email}).select('+password').exec();
    if (!student) {
        return next(new ErrorHandler('User Not Found', 404))
    }
    const isMatch = student.comparePasswords(req.body.password);
    if (!isMatch) {
        return next(new ErrorHandler('Wrong Credentials', 500));
    }
    sendToken(student,201,res);
});

exports.signoutJobSeeker = catchAsyncErrors(async(req,res,next) => {
    res.clearCookie('token').json({
        message : 'Signedout Succesfully!',
    });
});

exports.currentUser = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findById(req.id).exec();
    res.json({student});
});

exports.forgotPasswordHandler = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findOne({email : req.body.email});
    if (!student) {
        return next(new ErrorHandler('User not found!', 404));
    };

    student.passwordUpdateToken = "1";
    await student.save();

    const url = `${req.protocol}://${req.get('host')}/student/forgot-password/${student._id}`;
    sendmail(req,res,next,url);
});

exports.resetForgotPassword = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findById(req.params.id).exec();

    if (!student) {
        return next(new ErrorHandler('User not found!', 404));
    };

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }

    if (student.passwordUpdateToken === "1") {
        student.passwordUpdateToken = "0";
        student.password = req.body.password;
        await student.save();
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

    const student = await StudentModel.findById(req.id).exec();

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }
    
    student.password = req.body.password;
    student.save();
    sendToken(student,201,res)

});

exports.updateProfile = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({
        message : 'profile updated successfully!'
    })
});

exports.updateAvatar = catchAsyncErrors(async(req,res,next) => {
    const student = await StudentModel.findById(req.params.id);
    const file = req.files.avatar;
    const modfiedFileName = `resumebuilder-${Date.now()}${path.extname(file.name)}`;

    const imagekit = initImageKit();

    if (student.avatar.fileId !== "") {
        await imagekit.deleteFile(student.avatar.fileId);
    };
    
    const {fileId,url} = await imagekit.upload({
        file : file.data,
        fileName : modfiedFileName
    });

    student.avatar = {fileId,url};
    await student.save();
    res.json({
        message : 'file uploaded successfully!'
    })
});






