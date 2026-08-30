const mongoose = require("mongoose")
const jobSchema = new mongoose.Schema(
    {
        title:{
            type :String,
            required :true,
            trim:true,
        },
        description : {
            type : String,
            required : true,
        },
        company : {
            type :String,
            required : true,
            trim : true
        },
        location:{
            type: String,
            required: true,
            trim: true
        },
        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship"],
            required: true
        },
        salary: {
            type: Number
        },
        skills: {
            type: [String],
            required: true
        },
        experience: {
            type: String,
            default: "Fresher"
        },
        deadline: {
            type: Date,
            required: true
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps:true
    }
);
const Job =mongoose.model("Job",jobSchema);
module.exports=Job;