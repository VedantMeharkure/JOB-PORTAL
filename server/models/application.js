const mongoose =require("mongoose")
const applicationSchema = new mongoose.Schema(
    {
        student:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required : true,
        },
        job : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job",
            required :true,
        },
        resume:{
            type:String,
            required:true,
        },
        coverLetter:{
            type: String,
            default:"",
        },
        status:{
            type:String,
            enum:[
                "Applied",
                "Shortlisted",
                "Interview",
                "Selected",
                "Rejected"
            ],
                default:"Applied"
        },
        interview: {
            date: {
                type: Date,
                default: null
            },

            time: {
                type: String,
                default: ""
            },

            type: {
                type: String,
                enum: ["Online", "Offline"],
                default: "Online"
            },

            meetingLink: {
                type: String,
                default: ""
            },

            notes: {
                type: String,
                default: ""
            }
        },
    },
    {
        timestamps:true
    }
);
applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);
module.exports=mongoose.model("Application",applicationSchema);