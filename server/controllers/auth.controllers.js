const User=require("../models/user");
const bcrypt=require("bcryptjs");
const { generateToken } =require("../utils/auth");

async function registerUser(req,res) {
    const {name,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(409).json({
            message:"User already exists"
        });
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await User.create({
        name,
        email,
        password :hashedPassword,
    })  
    return res.status(201).json({
        message:"User registered successfully"
    });
};
async function getCurrentUser(req,res) {

    const user = await User
        .findById(req.user.id)
        .select("-password");

    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }

    return res.status(200).json({
        user
    });
}
async function loginUser(req,res)
{
    const { email , password }=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"Invalid email or password",
        });
    }
    const isPasswordCorrect =await bcrypt.compare(
        password,
        user.password,
    );
    if(!isPasswordCorrect)
    {
        return res.status(401).json({
            message:"Invalid email or password"
        });
    }

    const token = generateToken(user);

    res.cookie("token",token,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax",
        maxAge : 7*24*60*60*1000
    });
    return res.status(200).json({
        message :"Login successful",
        user :{
            id: user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    })
};
async function logoutUser(req,res){
    res.clearCookie("token",{
        httpOnly:true,
        secure :process.env.NODE_ENV === "production",
        sameSite :"lax"
    });
    return res.status(200).json({
        message:"Logout successful"
    })
}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
}; 