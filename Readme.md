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

    module.exports = ('student' , student);

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
