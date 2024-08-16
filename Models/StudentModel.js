const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = mongoose.Schema({
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
    }
},{timestamps : true});

studentSchema.pre('save',function(){
    if (!this.isModified('password')) {
        return;
    };
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

studentSchema.methods.comparePasswords = function(password){
    return bcrypt.compareSync(password, this.password);
};

const student = mongoose.model('student', studentSchema);

module.exports = (student);