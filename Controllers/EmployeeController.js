const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
const EmployeeModel = require("../Models/EmployeeModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { initImageKit } = require("../utils/imagekit");
const { sendmail } = require("../utils/nodemailer");
const { sendToken } = require("../utils/sendToken");
const path = require('path');

exports.homepage = catchAsyncErrors(async (req, res, next) => {
    res.json({message : 'secured employee page'});
});

exports.signup = catchAsyncErrors(async(req,res,next) => {
    const employee = await new EmployeeModel(req.body).save();
    sendToken(employee,201,res);
});

exports.signin = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findOne({email : req.body.email}).select('+password').exec();
    if (!employee) {
        return next(new ErrorHandler('User Not Found', 404))
    }
    const isMatch = employee.comparePasswords(req.body.password);
    if (!isMatch) {
        return next(new ErrorHandler('Wrong Credentials', 500));
    }
    sendToken(employee,200,res);
});

exports.signout = catchAsyncErrors(async(req,res,next) => {
    res.clearCookie('token').json({
        message : 'Signedout Succesfully!',
    });
});


exports.currentUser = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findById(req.id).exec();
    res.json({employee});
});

exports.forgotPasswordHandler = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findOne({email : req.body.email});
    if (!employee) {
        return next(new ErrorHandler('User not found!', 404));
    };

    employee.passwordUpdateToken = "1";
    await employee.save();

    const url = `${req.protocol}://${req.get('host')}/employee/forgot-password/${employee._id}`;
    sendmail(req,res,next,url);
});

exports.resetForgotPassword = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findById(req.params.id).exec();

    if (!employee) {
        return next(new ErrorHandler('User not found!', 404));
    };

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }

    if (employee.passwordUpdateToken === "1") {
        employee.passwordUpdateToken = "0";
        employee.password = req.body.password;
        await employee.save();
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

    const employee = await EmployeeModel.findById(req.id).exec();

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }
    
    employee.password = req.body.password;
    employee.save();
    sendToken(employee,201,res)

});

exports.updateProfile = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({
        message : 'profile updated successfully!'
    })
});

exports.updateAvatar = catchAsyncErrors(async(req,res,next) => {
    const employee = await EmployeeModel.findById(req.params.id);
    const file = req.files.orgLogo;
    const modfiedFileName = `logo-${Date.now()}${path.extname(file.name)}`;

    const imagekit = initImageKit();
    
    if (employee.orgLogo.fileID !== "") {
        await imagekit.deleteFile(employee.orgLogo.fileID);
    };

    const {fileID,url} = await imagekit.upload({
        file : file.data,
        fileName : modfiedFileName
    });

    employee.orgLogo = {fileID,url};
    await employee.save();
    res.json({
        message : 'file uploaded successfully!'
    })
});
