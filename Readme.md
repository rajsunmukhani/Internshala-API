## Commit 1 : Basic Set-up to create an API

1. Create a app.js file

2. run following command : *npm init --y*

3. edit package.json from :
    *"test": "echo \"Error: no test specified\" && exit 1"* tp,
    *"start": "node app.js"*

4. write in app.js *console.log('hello)* and run the terminal with command : *nodemon*
if your get hello on terminal, that means your project is working.

5. install following packages : 
    *npm i express morgan mongoose dotenv*

6. update app.js with following code :
    const express = require('express');
    const app = express();

    app.listen(
        3000,
        console.log(`your server is running on port : 3000`)
    )

7. Now, we can not define port like this openly therefore we will make a file on root named .env and inside it add : 
    PORT=3000

    Now, accessing it in app.js as the updated code will be : 

        require('dotenv').config('./.env')
        const express = require('express');
        const app = express();

        app.listen(
            process.env.PORT,
            console.log(`your server is running on port : ${process.env.PORT}`)
        )

8. Now, create a file in root directory named .gitignore and add these confedential files and folders names as:
    .env
    node_modules
    package-lock.json

9. add following code, as making a route and checking it working, above app.listen:
    app.use('/',(req,res,next) => {
        res.json({message : homepage});
    });

Now, check on postman by getting to route localhost:3000/ if you are getting the json output or not, if yes, then code is successfull.

10. Make a folder named Routes on root and make a file inside it named indexRoutes.js inside it cut the function inside from app.js and add as:
    inside indexRoutes.js:

        const express = require(('express'));
        const router = express();

        router.get('/',(req,res,next) => {
            res.json({message : homepage});
        })

        module.exports = router;

    And, function route under app.js will look like this:
        *app.use('/', require('./routes/indexRoutes'));*

11. Now, update the indexRoutes as :

    const { homepage } = require("../controllers/indexController");

    const express = require(('express'));
    const router = express();

    router.get('/', homepage)

    module.exports = router;

    And add the function in indexController.js, hence it will look as :
        exports.homepage = (req,res,next) => {
            res.json({message : homepage});
        }   


## Commit 2 : Error Handling setUp


1. create a route in app.js

app.all('*', (req,res,next) => {});

2. Create a folder named utils in root which will keep all our helper functions and inside it create a new file named ErrorHandler.js under it make a class as:

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = ErrorHandler;

3. update the route in app.js as :

app.all('*', (req,res,next) => {
    next(new ErrorHandler(`Requested URL Not Found`,404));
});

4. Now, create a folder at root named "middlewares".
Inside it create a file named error.js and inside it write following code as :

const generatedError = (err,req,res,next) => {};

5. Now, come to app.js and in the errorhandling section write as:

app.use(generatedErrors);   // generated error will get imported from newlymade middleware named error.js.

6. Now, update the generatedError function as :
const generatedError = (err,req,res,next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message : err.message
        errName : err.name
    });
};

7. Now,as we know that till now all the functions are synchronicized which will get asynchronous as soon as we host the webapp, make use of API calls, or attach it with database, to deal with that errors we will use try-catch for controllers as in indexController.js :

exports.homepage = async(req,res,next) => {
    try {
        res.json({message : 'homepage'})
    } catch (error) {
        console.log(error);
        
    }
}


8. Now, we know that in an API, there will be no. of routes, which means no. of controllers which means no. of try-catch in each controller.
To avoid the use of try-catch again and again, we can simply make the catch part once, so if the code is successful it will run and if not, it will get directed to catch vala part.

Create a file in Middleware directory named 'catchAsyncErrors' and inside it:

exports.catchAsyncErrors = (func) => (req,res,next) => {
    Promise.resolve(func(req,res,next)).catch(next);
};

now update the indexController.js page as :
exports.homepage = catchAsyncErrors(async(req,res,next) => {
        res.json({message : 'homepage'})
});

## Commit 3 : Connecting Database and Schema

1. Create a new database by creating a new folder named models on root level and file named database.js inside it with data : 

const mongoose = require('mongoose');

exports.connectDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connection Estabilished!!');
    } catch (error) {
        console.log(error);
    }
}

2. update .env file as by adding : 
MONGODB_URL = 'mongodb://127.0.0.1:27017/DBName'

3. connect databse with app.js by adding following in app.js

//db connection
require('./Models/Database').connectDatabase();

4. Make Schema :- 
    Make a file named StudentModel.js in Models and add following code :
    const mongoose = require('mongoose');

    const studentSchema = mongoose.Schema({
        email : {
            type : String,
            unique : true,
            required : true,
            match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password : {
            type : String,
            minLength : [6, 'Password Length should contain atleast 6 characters'],
            maxLength : [15, 'Password Length should not be more than 15 characters'],
        }
    },{timeStamp : true});

    const student = mongoose.model('student', studentSchema);

    module.exports =  student;

5. Create a function createJobSeeker in indexController.js as : 

    exports.createJobSeeker = catchAsyncErrors(async(req,res,next) => {
        res.json(req.body);
    });

6. Now, create a route to register jobSeekers in indexRouter.js as :
    router.post('/student/signup', createJobSeeker);

    dont forget to import createJobSeeker.

7. You will not get data until there is body parser activated in app.js which helps in connecting database with express and showing data from req.body. 
For that, simply add following code in app.js above routes bwing initialized :

    app.use(express.json());
    app.use(express.urlencoded({extender : false}))

8. Now, here we can see that even without sending a valid info still the request is getting fetched.
This is because we are just checking the data is coming or not and not updating or saving the data in mongoose.
If we will save or update the data in mongoose then it will give us the error as well as surpass all validations to save the data in database.
For it simply go to : indexController.js and update 
   *res.json(req.body)*
   to
    *const students = await new student(req.body).save();
    res.status(200).json(students);*

** Dont forget to require student from studentModel.js

## Commit 4 - 6 Updated Readme.md : Fixed Errors

## Commit 7  : Continued Connecting Databse and Schema Enabled signin and errorhandling

9. Now, at the time of signing up with same email id twice it gives as error named E11000 duplicate key which is not looking good, hence we will make this readable by going *Error.js* in folder *Middleware* and there we will make an update and add the following code :

    if (err.message.includes('E11000 duplicate key') && err.name == 'MongoServerError') {
        err.message = 'User Already Registered with this Email Address!'
    }

And this will make that particular Error readable for user!

10. Now, as we can see on the databse, that we are getting password directly, which is not good for our code, so for that we will be using an outsourced package named *bcrypt* to make our passwords encoded.

For that go to StudentModel.js file under folder Models and above the last two lines of code add the following code chunk :

    studentSchema.pre('save', function() {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    });

NOTE: Don't forget to import bcrypt.

11. Now, here is one issue, everytime we save the data the salt for the password will get updated which is not good for our code, salts should only be updated only when password is updated. For that update the above chunk of code as:

    studentSchema.pre('save', function() {

        if (!this.isModified('password')) {
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    });

12. Now, signup is completed and we will be working on Signin, For this create two controllers on indexController.js as : 

    exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {});
    exports.signoutJobSeeker = catchAsyncErrors(async(req,res,next) => {});

    And, two routes in indexRouter.js as :

    router.post('/student/signin', signinJobSeeker);
    router.get('/student/signout', signoutJobSeeker);

*NOTE : Dont forget to import signinJobSeeker and signoutJobSeeker form indexController.js*

13. Creating signin

    First of all check whether your are getting the data in backend or not, for that update the signinJobSeeker controller as :

    exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {
        res.json(req.body);
    });
    
    If you get data in backend using postman, update the controller as:

    exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findOne({email : req.body.email}).select('+password').exec();
        res.json(student);
    });

    Now, there will be chances when the user is not registered bu trying to login for them update the code as :

    exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findOne({email : req.body.email}).select('+password').exec();

        if (!student) {
            next(new ErrorHandler('User Not Found', 404))
        };

        res.json(student);
    });
    
    Also, there will be chances when user tries to enter wrong password for them we will make a method in studentModel.js and use it in controller.js to check the password entered is correct or not in the following way:

        Add following code in StudentModel.js

        studentSchema.methods.comparePassword = function(password){
            return bcrypt.compareSync(password, this.password);
        };

        This will return the value of true or false, by checking the coded value of password with the currently entered password.

        Use this method in signin controller as the updated signin controller will look like : 

        exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {
            const student = await StudentModel.findOne({email : req.body.email}).select('+password').exec();

            if (!student) {
                next(new ErrorHandler('User Not Found', 404))
            };

            const isMatch = student.comparePassword(req.body.password);

            if (!isMatch) {
                return next(new ErrorHandler ('invalid credentials!' , 500));
            };

            res.json(student);
        });

        Here, if the password doesn't matches the saved coded password, then it will return a error with invalid credentials.


## Commit 8-9 : Updating Readme (as per commit 7 code), fixed some mistakes in readme.md;

## Commit 10 : Creating Sessions and Authentications

1. install following packages:
    *npm i express-session cookie-parser jsonwebtoken*

2. Setup all three step by step.
    => **express-session**
        Go to app.js and besided logger add following code :

            const session = require('express-session');

            app.use(session({
                resave : true,
                saveUninitialized : true,
                secret : process.env.SESSION_SECRET
            }))

    => **cookie-parser**
        along with express-session add following code : 

        const cookieparser = require('cookie-parser');
        app.use(cookieparser());

    => **jsonwebtoken**
        this package will be basically used to create a token whenever user either logsin or signsup, hence in studentModel.js file make a function which does so:

        const jwt = require('jsonwebtoken');

        studentModel.genToken = function(){
            return jwt.sign({id : this._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRY})
        };

**Note : dont forget to introduce all env endpoints with data**

3. Now, as we introduced the function to create token, now we need to save token to session everytime user signsup or logsin, instead using it twice, we will create a file in utils named sendToken.js and use it in both the signin and signup controllers.

**sendToken.js**

exports.sendToken = (student,statusCode,res) => {
    const token = student.genToken();
    res.json(token);
}

**use for signin controller :**
replace res.json() with sendToken(student, 201, res);
**use for signup controller :**
replace res.json() with sendToken(student, 200, res);

check if you are getting data or note by applying the function to any controller first, if yes proceed further and update function as :


exports.sendToken = (student,statusCode,res) => {
    const token = student.genToken();
    const options = {
        expiresIn : new Date(
            Date.now() + process.env.TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
        ),
        httpOnly : true,
        // secured : true
    }
    res.status(statusCode).cookie('token',token,options).json({
        success : true,
        id : student._id,
        token
    })
}

now according to above code sendToken function takes in input as student,statusCode, and response and then generates token and saves it in variable token and other data in options.Now, gives the response status as statusCode , and creates cookie named 'token with data available with token and options variables and json does the print of  *success : true, id : student._id, token:token*.

4. Create signout route to clear cookie at the time of logout as :

    **signout controller :**
    exports.signoutJobSeeker = catchAsyncErrors(async(req,res,next) => {
            res.clearCookie('token').json({
                message : 'Signedout Succesfully!',
            });
        });

    This, will clear the cookie at the time of signout.

5. Adding Authentication to */* route to access homepage and to */signout* route to sign out only when user is already logged in(i.e. token is already available).

create a new file in Middleware folder named Auth.js and add following code :

    const ErrorHandler = require("../utils/ErrorHandler");
    const { catchAsyncErrors } = require("./catchAsyncErrors");

    exports.isAuthenticated = catchAsyncErrors((req, res, next) => {
        const {token} = req.cookies;
        if (!token) {
            return next(new ErrorHandler("Login to Access Resources!", 401));
        }
        res.json(token);
    });

If the token is already available then this middleware will access the token form cookie, and give us output in json format, or will give an error login to access resources.

Apply the middleware to '/' route and '/signout' route in indexRouter.js as :

    router.get('/', isAuthenticated ,homepage);
    router.get('/signout/jobSeeker', isAuthenticated, signoutJobSeeker);

**If getting token in json on test replace *res.json(token);* in isAuthenticated middleware with *next()*.**

6. Now, if we want to get the details of user or student accessing login, for it we will simply at the time of authentication add the id in req.id for further use as 

    exports.isAuthenticated = catchAsyncErrors((req, res, next) => {
        const {token} = req.cookies;
        if (!token) {
            return next(new ErrorHandler("Login to Access Resources!", 401));
        }
        const {id} = jwt.verify(token,process.env.JWT_SECRET)
        req.id = id;
        res.json(token);
    });


    Now, make a route in indexRouter.js as :

        router.post('/student', isAuthenticated, currentUser);

    and create a currentUser controller in indexController.js as : 

        exports.currentUser = catchAsyncErrors(async(req,res,next) => {
            const student = await StudentModel.findById(req.id).exec();
            res.json({student});
        });

**Note : dont forget to replace res.json in isAuthenticated middleware with next();**
**Also, dont forget to require jsonwebtoken in jwt variable in the isAuthenticated middleware.**


## Commit 11 : Creating Forgot Password and Reset Password Functionality

**Forgot Password**

1. Go to indexRouter.js and create a route as : 

    *router.post('/student/forgot-password', forgotPasswordHandler);*

2. Create the function *forgotPasswordHandler* in indexController.js as :

    exports.forgotPasswordHandler = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findOne({email : req.body.email});
        if (!student) {
            return next(new ErrorHandler('User not found!', 404));
        };

        res.json({student});
    });

    And import the function in indexRouter.js.

    If you are getting desired output by hitting the route.Update the controller function as :

    exports.forgotPasswordHandler = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findOne({email : req.body.email});
        if (!student) {
            return next(new ErrorHandler('User not found!', 404));
        };

        const url = `${req.protocol}/${req.get('host')}/student/${student._id}`;

        res.json({student,url});
    });

    Check the url you are getting is ok or not.

3. Now, we have to send this url on mail to the user logged in. For this we will be using *nodemailer* to send mails. Hence,
    
    => **npm i nodemailer**
    => create a file in utils folder named naodemailer.js.
    => Add the following code in the file : 

        const nodemailer = require('nodemailer');
        const ErrorHandler = require('./ErrorHandler');

        exports.sendmail = (req,next,url) => {
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
                    message : 'mail sent successfully!'
                })
            })

        }

Mail is sent successfully to the user and, now we have to make generate the controller which will take action when the link sent on mail is hit by the user, for that :

4. Make a route in indexRouter.js as :

router.get('/student/forgot-password/:id', resetForgotPassword);

Now, creating the controller resetForgotPassword in indexController.js as :

exports.resetForgotPassword = catchAsyncErrors(async(req,res,next) => {
    res.json('Route Working!')
});

If the route is working, update the controller as : 

    exports.resetForgotPassword = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findById(req.params.id).exec();
        if (!student) {
            return next(new ErrorHandler('User not found!', 404));
        };

        if (req.body.password === null || req.body.password === undefined) {
            return next(new ErrorHandler('Please enter password!', 500));
        }

        student.password = req.body.password;
        await student.save();
        res.status(200).json({
            message : 'password updated successfully!'
        })
    });

5. Now, here is an issue that we can update the password as many times as we want using the same link again and again.Hence we will expire the usage of link after on use as:

    => add a feild in studentModel.js as :

        passwordUpdateToken : {
            type : String,
            default : "0"
        };

    => add following code snippet in forgotPasswordHandler:

        student.passwordUpdateToken = "1";
        await student.save();

        above url initialization and declaration
    
    => update resetForgotPassword controller as :

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

And now the link will only work when the student follows particular step or it will not work!

**Reset Password**


6. As we know that this route will get accessed by the already logged in user therefore create a route on indexRouter.js which will be authenticated as:

router.get('/student/reset-password/:id', isAuthenticated ,createNewPassword);

7. Create createNewPassword controller in indexController.js as:

exports.createNewPassword = catchAsyncErrors(async(req,res,next) => {

    const student = await StudentModel.findById(req.id).exec();
    student.password = req.body.password;
    student.save();

});

Dont forget to import this controller in your indexRouter.js file.

8. Now, we have a choice that either we want to logout the user to make him login with new password or keep him logged in.
Here we will be simple add this following code snippet to keep him logged in in the above controller as:

**sendToken(student,201,res);**

and you are donw with reset route.

ErrorHandling in above step as :


exports.createNewPassword = catchAsyncErrors(async(req,res,next) => {

    const student = await StudentModel.findById(req.id).exec();

    if (req.body.password === null || req.body.password === undefined) {
        return next(new ErrorHandler('Please enter password!', 500));
    }
    
    student.password = req.body.password;
    student.save();
    sendToken(student,201,res)

});

## Commit 12 : Making user update profile

1. To make user update profile, first of all lets add data feilds in studentSchema like : firstName, lastName, gender, city contact etc. with feilds like required : true, type : String and minLength, maxLength.

**NOTE : Delete the existing user and create new user with new Schema and new values**

2. Create a route on indexRouter.js as:

    *router.post('/student/update-profile/:id', isAuthenticated , updateProfile);*

    Create a controller in indexController.js named updateProfile and dont forget to import it in indexRouter.js:

    exports.updateProfile = catchAsyncErrors(async(req,res,next) => {
        const student = await StudentModel.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).json({
            message : 'profile updated successfully!'
        })
    });


    Check by updating data and sending request from postman that is it working or not in moogdb.

3. Now, we will be working on uploading image, for that at first create a feild in studentModel named avatar and its data as : 

    avatar : {
        type : Object,
        default : {
            fileID : '' ,
            url : ''
        }
    }

    and add a default user url in avatar url section.
    Delete the model from mongodb and again make it signup with avatar feild as well.

4. now to upload a file we have to use a package made for express named : *npm i express-fileupload*

    and we want to keep images uploaded on cloud so, that no storage of our aplication is affected and we can also access images therefore we ill be using *imagekit.io* to use it we need to install its package as *npm i imagekit*

    or install them combinely using following command as : *npm i express-fileupload imagekit*

    Now, setting up express file upload goes as in app.js beside cookie-parser and express-session add following snippet : 

    //express fileupload
    const upload = require('express-fileupload');
    app.use(upload());

    Now, as we upload the image or file from postman, we can see the data there by directing *update-avatar* controller as : 
    *res.json({file : req.files})*

    Now, as we are getting data, we need to save the image in cloude in imagekit.io


5. For that get to imagekit.io website > sign in > left navigation bar > developer options > get the code for node js > create a file in utils folder named imagekit.js and inside it make a function as :

    const ImageKit = require('imagekit');

    exports.initImageKit = () => {
    // Paste the copied code for node js here (remove the require line)
    };

    save the keys in .env and update the function as : 

    const ImageKit = require('imagekit');

    exports.initImageKit = () => {
        var imagekit = new ImageKit({
            publicKey : process.env.IMAGEKIT_PUBLICKEY ,
            privateKey : process.env.IMAGEKIT_PRIVATEKEY ,
            urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT 
        })
        return imagekit;
    };

6. To upload image, update the updateAvatar controller as:

    exports.updateAvatar = catchAsyncErrors(async(req,res,next) => {
        const file = req.files.avatar;
        const modfiedFileName = `resumebuilder-${Date.now()}${path.extname(file.name)}`

        res.json({modfiedFileName,file})
    });

    **NOTE : Dont forget to require path at top before use.**

        To upload the image on cloud update the above controller as : 

        exports.updateAvatar = catchAsyncErrors(async(req,res,next) => {
            const student = await StudentModel.findById(req.params.id);
            const file = req.files.avatar;
            const modfiedFileName = `resumebuilder-${Date.now()}${path.extname(file.name)}`;

            const imagekit = initImageKit();

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

    **NOTE : Dont forget to require initImageKit at top before use.**

7. Now, we want that new image should replace the old image in cloud, for that we will simply update the controller to following, just by adding a conditional:

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

## Commit 13 : Resume making and data uploading

Step 1 : Make Following changes in app.js.
    Change,
        app.use('/', require('./Router/IndexRouter'));
    to,
        app.use('/user', require('./Router/IndexRouter'));

    And also create a new route for resume as : 
        app.use('/resume', require('./Router/ResumeRouter.js'));

Step 2 : Create ResumeRouter.js and ResumeController.js in Routers and Controllers dir respectively as :
        ResumeRouter.js:

            const express = require('express');
            const { isAuthenticated } = require('../Middlewares/Auth');
            const { resume } = require('../Controllers/ResumeController');
            const router = express();

            router.get('/', isAuthenticated, resume );

            module.exports = router;

        ResumeController.js:

            const { catchAsyncErrors } = require("../Middlewares/catchAsyncErrors");
            const StudentModel = require("../Models/StudentModel");

            exports.resume = catchAsyncErrors(async(req, res, next) => {
                const {resume} = StudentModel.findById(req.id).exec();
                res.json({
                    message : 'Secured Resume : ',
                    resume,
                })
            });

Step 3 : Create resume in StudentSchema to access it as:

        resume : {
            education : [],
            skills : [],
            accomoplishments : [],
            courses : [],
            projects : [],
            skills : [],
            responsiblities : [],
            jobs : []
        }

Step 4: check resume on */resume/* route on postman :
        If you are getting desred output then, create add,update and delete feature all the fields in the resume object.

        as for example for education let the flow go as follows:

**Add Education :**

    Create addEducation Controller as:

        exports.addEducation = catchAsyncErrors(async(req, res, next) => {
        const Student = await StudentModel.findById(req.id);
        Student.resume.education.push({...req.body, id : uuid()});
        await Student.save();

        res.json({
            message : 'Update Education Successfull!',
            Student
            })
        });

    Create addEducation Router as:

        router.post('/add-edu', isAuthenticated, addEducation );

**Edit Education :**

    Create editEducation Controller as:

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

    Create editEducation Route as:

        router.post('/edit-edu/:id', isAuthenticated, editEducation );

**Delete Education :**
    
    Create deleteEducation Controller as:

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

    Create deleteEducation Route as:

        router.post('/delete-edu/:id', isAuthenticated, deleteEducation );


Similarly make routes for other fields in the resume.

## Commit 14 : Making login and functionality for employer

Step 1 : Create a file named EmployerModel.js, in Model dir and inside it define the EmployeModel almost as same as for student as:
            => Similar to studentSchema
            => add organisationName feild
            => modify avatar to organisationLogo field
            => add jobs and intership field as :

                    jobs : [{
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'jobs'
                    }],
                    internships : [{
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'internships'
                    }]

Step 2 : Create EmployerController.js in Controllers folder and make it similar to indexController.js but this will be for employers, therefore modify the word **student** to **employer**.

Step 3 : Start working on each controller by attaching it to a employerRouter file similar to indexRouterfile, by adding a new route in app.js file as : 
        app.use('/employer', require('./Router/EmployerRouter'));

    Now define routes and controller names as per as per the employer where the controller will be same as index controller.

**Note : Updated exisitng routes for better and easy understanding**

## Commit 15 : Making employer add vacancies for jobs and internships

Step 1 : Create a new Model in Models folder named internships.js and inside it we should have the following feilds : 

    profile : {
        type : String,
        required : true,
    },
    internshipType : {
        type : String,
        enum : ["in office", "remote"],
        required : true,
    },
    openings : {
        type : Number,
        default : 1,
        required : true,
    },
    skillsRequired : {
        type : Array,
        default : [],
        required : true,
    },
    from : {
        type : Date,
        required : true,
    },
    to : {
        type : Date,
        required : true,
    },
    responsibility : {
        type : String,
        required : true,
    },
    duration : {
        type : Number,
        default : 1,
        required : true,
    },
    stipend : {
        status: {
            type: String,
            enum: ['Fixed', 'Negotiable', 'Performance Based', 'Unpaid'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }
    },
    perks : {
        type : String,
        required : true,
    },
    assessment : {
        type : String,
        required : true,
    }

Step 2 : Similarly create a model for the job with the following fields:

    profile : {
        type : String,
        required : true,
    },
    jobType : {
        type : String,
        enum : ["in office", "remote"],
        required : true,
    },
    openings : {
        type : Number,
        default : 1,
        required : true,
    },
    skillsRequired : {
        type : Array,
        default : [],
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    salary : {
        amount: {
            type: Number,
            required: true,
        }
    },
    preferences : {
        type : String,
        required : true,
    },
    perks : {
        type : String,
        required : true,
    },
    assessment : {
        type : String,
        required : true,
    }

Step 3 : Introduce routes in EmployerRouter to add jobs and internships as follows : 

    router.post('/create/internship', isAuthenticated , createInternship);
    router.post('/create/job', isAuthenticated , createJob);

Step 4 : Create the controllers in EmployerController.js for the above made routes as per the names as createInternship and createJob as:

    exports.createInternship = catchAsyncErrors(async(req,res,next) => {
        const internship = await new Internships(req.body).save();

        res.status(201).json({
            success : true,
            internship
        })
    });


    exports.createJob = catchAsyncErrors(async(req,res,next) => {
        const job = await new jobs(req.body).save();

        res.status(201).json({
            success : true,
            job
        });
    });

Step 5 : Check whether the routes are working or not by adding data in raw format in postman. data for reference and testing :

        => For adding internship:

            {
                "profile": "Frontend Developer",
                "internshipType": "remote",
                "openings": 3,
                "skillsRequired": ["React", "Node.js", "MongoDB"],
                "from": "2024-09-01",
                "to": "2024-12-01",
                "responsibility": "Develop frontend using React",
                "duration": 3,
                "stipend": {
                    "status": "Fixed",
                    "amount": 5000
                },
                "perks": "Flexible hours, Certification",
                "assessment": "Technical Interview"
            }

        => For adding jobs:

            {
                "profile": "Software Development Intern",
                "jobType": "remote",
                "openings": 3,
                "skillsRequired": ["JavaScript", "Node.js", "MongoDB", "React"],
                "description": "Work on developing a full-stack web application using the MERN stack. Collaborate with a team to design and implement various features and improve user experience.",
                "salary": {
                    "amount": 15000
                },
                "preferences": "Available to work full-time for at least 3 months. Preferred candidates with MERN stack experience.",
                "perks": "Flexible working hours, Certificate of Completion, Letter of Recommendation",
                "assessment": "Technical interview followed by a coding challenge"
            }

## Commit 16 : Creating the functionality of Read, update and delete of JOB and INTERNSHIP.

**1. Creating the functionality of Read and Read One.**

Step 1: Create two routes in employerRouter.js as:

*router.post('/internships', isAuthenticated , viewInternships);*
*router.post('/internship/:id', isAuthenticated , viewSingleInternships);*

Step 2: Now, create the controllers named viewInternships and viewSingleInternships in EmployerController.js as:

exports.viewInternships = catchAsyncErrors(async(req,res,next) => {
    const {internships} = await EmployerModel.findById(req.id).populate('internships').exec();

    res.status(200).json({
        success : true,
        internships
    });

});

exports.viewSingleInternships = catchAsyncErrors(async(req,res,next) => {
    const internship = await Internships.findById(req.params.id).exec();;
    
    res.status(200).json({
        success : true,
        internship
    });
});

Step 3 : Add the following employer field in both internship model as well as job model as:

employer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'employer'
}

This will store the data of employer who posted the internship or job opening.

Step 4: Update createInternship controller as :

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

Similarly, update createJob as : 

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

Step 5 : Add ErrorHandler to viewSingleInternship as:

    if (!internship) {
            return next(new ErrorHandler('Internship not found', 404));
    }

Step 6 : Similarly create the route to view and viewSingle controller for job also as:

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

Step 7 : Making the functionality to get the number of applies a job or internship got.

add the following code snippet to internship model as well as job model as:

students : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'student'
}]

Step 8 : Now making the functionality for the student by keeping the information about the applied internships and jobs in the database. 
For this add the following feild in studentModel.js as :

