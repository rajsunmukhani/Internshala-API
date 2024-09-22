const mongoose = require('mongoose');

const Internships = mongoose.Schema({
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
},{timestamps : true});

const internship = mongoose.model('internship', Internships);

module.exports = (internship);