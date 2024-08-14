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