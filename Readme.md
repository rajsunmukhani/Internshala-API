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
    router.post('/signup/jobSeeker', createJobSeeker);

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

        if (!studentSchema.isModified('password')) {
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    });

12. Now, signup is completed and we will be working on Signin, For this create two controllers on indexController.js as : 

    exports.signinJobSeeker = catchAsyncErrors(async(req,res,next) => {});
    exports.signoutJobSeeker = catchAsyncErrors(async(req,res,next) => {});

    And, two routes in indexRouter.js as :

    router.post('/signin/jobSeeker', signinJobSeeker);
    router.get('/signout/jobSeeker', signoutJobSeeker);

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

## Commit 10 : Creating Sessions and Authntications

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


