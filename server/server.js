require("dotenv").config();
const connectDB =require("./config/db.js");
const app =require("./app.js")
const PORT=process.env.PORT || 8000;
connectDB();
app.listen(PORT,() => console.log(`Server connected to the Port:${PORT}`));
