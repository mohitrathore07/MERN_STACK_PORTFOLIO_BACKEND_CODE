import ErrorHandler from "../middleware/error.js";
import {catchAsyncErrors} from '../middleware/catchAsyncErrors.js';
import {UserSchema} from '../models/user.model.js';
import {v2 as cloudinary} from 'cloudinary';
import {generateToken} from '../utils/jwtToken.js';
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';


export const register = catchAsyncErrors (async (req , res , next) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return next (new ErrorHandler("Avatar and Resume are required!!!", 400));
    }

    const {avatar, resume } = req.files;

    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder: "AVATARS"}
    );

    if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        console.error(
            "Cloudinary Error: ",
            cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error"
        );
    }

    
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {folder: "MY_RESUME"}
    );

    if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        console.error(
            "Cloudinary Error: ",
            cloudinaryResponseForResume.error || "Unknown Cloudinary Error"
        );
    }

    const {  
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL, 
        twitterURL, 
        linkedInURL }  = req.body;


        const user = await UserSchema.create({
                fullName,
                email,
                phone,
                aboutMe,
                password,
                portfolioURL,
                githubURL,
                instagramURL,
                facebookURL, 
                twitterURL, 
                linkedInURL,
                avatar: {
                    public_id: cloudinaryResponseForAvatar.public_id,
                    url: cloudinaryResponseForAvatar.secure_url,
                },
                
                resume: {
                    public_id: cloudinaryResponseForResume.public_id,
                    url: cloudinaryResponseForResume.secure_url,
                },
        });

       generateToken(user , "User registered" , 201 , res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email , password} = req.body || {};

    if(!email || !password) {
        return next(new ErrorHandler("Email and Password are required!!!"));
    }

    const user = await UserSchema.findOne({email}).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid email or password!!"));
    }
    const isPasswordMatched  = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password!"));
    }
    generateToken(user, "Logged In" , 200, res);
})


export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "" , {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully..."
    });
})


export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user  = await UserSchema.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioURL: req.body.portfolioURL,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        facebookURL: req.body.facebookURL, 
        twitterURL: req.body.twitterURL, 
        linkedInURL: req.body.linkedInURL,
    };
    
    if(req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await UserSchema.findById(req.user.id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder: "AVATARS"}
        );
        newUserData.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    if(req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await UserSchema.findById(req.user.id);
        const resumeId = user.resume.public_id;
        await cloudinary.uploader.destroy(resumeId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {folder: "MY_RESUME"}
        );
        newUserData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    const user = await UserSchema.findByIdAndUpdate(req.user.id, newUserData ,{ 
        new:true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
        message: "Profile Updated",
        user
    })
})


export const updatePassword = catchAsyncErrors(async (req, res , next) => {
    const {currentPassword , newPassword, confirmNewPassword} = req.body || {};

    if (!currentPassword || !newPassword ||  !confirmNewPassword) {
        return next(new ErrorHandler("Please fill all fields..!!!", 400));
    }

    const user  = await UserSchema.findById(req.user.id).select("+password");

    const isPasswordMatched  = await user.comparePassword(currentPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Incorrect Current Password..!!!", 400));
    } 

    if(newPassword !== confirmNewPassword) {
        return next( 
            new ErrorHandler(
                "New Password And Confirm New Password Do Not Match...",
                400
            )
        )
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password Updated"
    })
})


export const getUserForPortfolio = catchAsyncErrors(async ( req, res , next) => {
    const id = "683d3cd6925c591445802e31";
    const user = await UserSchema.findById(id);
    res.status(200).json({
        success: true,
        user
    })
})


export const forgotPassword = catchAsyncErrors(async (req, res ,next) => {

    const user = await UserSchema.findOne({email: req.body.email});
    if(!user) {
        return next(new ErrorHandler("User not found!",404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordURL  = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

    const message = `Your reset password token is:- \n\n ${resetPasswordURL} \n\n If u have not requested Please ignore it`;

    try {
        await sendEmail ({
            email: user.email,
            subject: "Personal Portfolio Dashboard Recovery Password",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch(error) {
        user.resetPasswordExpired = undefined;
        user.getResetPasswordToken = undefined;
        await user.save();
        return next(new ErrorHandler(error.message, 500));
    }
});


export const resetPassword = catchAsyncErrors(async (req, res ,next) => {
    const {token} = req.params;

    const resetPasswordToken  = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserSchema.findOne({
        resetPasswordToken,
        resetPasswordExpired: { $gt: Date.now() },
    });

    if(!user) {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler(" Password and confirm password not matched"))
    }
    user.password = req.body.password;
    user.resetPasswordExpired=undefined
    user.resetPasswordToken=undefined;
    await user.save();
    generateToken(user, "Reset Password Successfully!!", 200 , res);
});