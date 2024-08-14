const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors")

exports.homepage = catchAsyncErrors(async(req,res,next) => {
    res.json({message : 'homepage'})   
});

exports.createJobSeeker = catchAsyncErrors(async(req,res,next) => {
    res.json(req.body);
});