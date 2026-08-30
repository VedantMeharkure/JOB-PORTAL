const mongoose = require("mongoose")
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGOURL);
        console.log("Database connected Successfully");
    }
    catch(error){
        console.error("Database Connection Failed:",error.message)
        process.exit(1);
    }
};
module.exports=connectDB;
