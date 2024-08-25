const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const StudentModel = require("../Models/StudentModel");
const ErrorHandler = require('../utils/ErrorHandler');
const { sendToken } = require("../utils/sendToken");

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


