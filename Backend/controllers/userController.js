import {cathAsyncErrors} from "../middlewears/catchAsyncErrors.js";
import ErrorHandler from "../middlewears/error.js";
import { User } from "../modals/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

// User registration
export const register = cathAsyncErrors(async(req, res, next)=>{
    const{name, email, password, phone, role} = req.body;

    if(!name || !email || !password || !phone || !role) {
        return next(new ErrorHandler("Please fill full registration form"));
    }
    const isEmail = await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists"));
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role,
    });
    sendToken(user, 200, res, "User Registered Successfully!");
});


// User Login
export const login = cathAsyncErrors(async(req, res, next)=>{
    const {email, password, role} = req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Please provide email, password and role", 400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("user with this role not found", 400));
    }
    sendToken(user, 200, res, "user Logged in Successfully!");
});

// User Logout
export const logout = cathAsyncErrors(async(req, res, next)=>{
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User Logged out successfully!",
    });
})

// function to get the user for frontend
export const getUser = cathAsyncErrors((req, res, next)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,

    })
})