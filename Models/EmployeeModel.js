const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const employerSchema = mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        select : false,
        minLength : [6, 'Password Length should contain atleast 6 characters'],
        maxLength : [15, 'Password Length should not be more than 15 characters'],
    },
    passwordUpdateToken : {
        type : String,
        default : "0"
    },
    firstName : {
        type : String,
        required : [true, 'First Name is required!'],
        minLength : [2, 'First name should have atleast 2 charaters'],
        maxLength : [10, 'First name should have atmost 10 charaters']
    },
    lastName : {
        type : String,
        required : [true, 'Last Name is required!'],
        minLength : [2, 'Last name should have atleast 2 charaters'],
        maxLength : [10, 'Last name should have atmost 10 charaters']
    },
    orgName : {
        type : String,
        required : [true, 'Last Name is required!'],
        minLength : [2, 'Last name should have atleast 2 charaters'],
        maxLength : [25, 'Last name should have atmost 25 charaters']
    },
    orgLogo : {
        type : Object,
        default : {
            fileID : '' ,
            url : 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1725688022~exp=1725688622~hmac=4c4f4f3c818313851dd5eaeeedc28fa1bde78df11330d5f3ed59c5e0e6f78498'
        }
    },
    internships :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'internships'
    }],
    jobs :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'jobs'
    }],
    
},{timestamps : true});

employerSchema.pre('save',function(){
    if (!this.isModified('password')) {
        return;
    };
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

employerSchema.methods.comparePasswords = function(password){
    return bcrypt.compareSync(password, this.password);
};

employerSchema.methods.genToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRY});
};

const employer = mongoose.model('employer', employerSchema);

module.exports = (employer);