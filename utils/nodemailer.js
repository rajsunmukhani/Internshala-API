const nodemailer = require('nodemailer');
const ErrorHandler = require('./ErrorHandler');

exports.sendmail = (req,res,next,url) => {
    const transport = nodemailer.createTransport({
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 465,
        auth : {
            user : process.env.US_MAIL,
            pass : process.env.US_PASS,
        }
    });

    const mailOptions = {
        from : 'Raj Sunmukhani',
        to : req.body.email,
        subject : 'Password Reset Link',
        html : `<h1>Click the below link to Reset Password!</h1><a href="${url}">Password Reset Link</a>`
    };

    transport.sendMail(mailOptions, (err,info) => {
        if (err) {
            return next(new ErrorHandler(err,500));
        }
        console.log(info);
        res.status(200).json({
            message : 'mail sent successfully!',
            url
        })
    })

}