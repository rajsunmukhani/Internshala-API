const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const StudentModel = require("../Models/StudentModel");
const ErrorHandler = require('../utils/ErrorHandler')

exports.homepage = catchAsyncErrors(async(req,res,next) => {
    res.json({message : 'homepage'})   
});

exports.createJobSeeker = catchAsyncErrors(async(req,res,next) => {
    const student = await new StudentModel(req.body).save();
    res.status(200).json(student);
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
    res.json(student);
});

exports.signoutJobSeeker = catchAsyncErrors(async(req,res,next) => {});