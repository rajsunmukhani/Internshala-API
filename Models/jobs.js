const mongoose = require('mongoose');

const Jobs = mongoose.Schema({
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
},{timestamps : true});

const jobs = mongoose.model('job', Jobs);

module.exports = (jobs);