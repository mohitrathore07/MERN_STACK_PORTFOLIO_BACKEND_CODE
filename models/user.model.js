import mongoose from "mongoose";
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema =  mongoose.Schema({
    fullName: {
        type:String,
        requred: [true, "Name required"],
    },
    email: {
        type: String,
        requred: [true, "email required"],
    },
    phone: {
        type: String,
        requred: [true, "phone required"],
    },
    aboutMe: {
        type: String,
        required: [true , "about me required"]
    },
    password: {
        type:String,
        required: [true, "Password is required"],
        minLengt: [ 8, "Password must contain at least 8 characters!!"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type:String , 
            required : true,
        }
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type:String , 
            required : true,
        }
    },
    portfolioURL: {
        type: String ,
        required: [true, "Portfolio URL is required"]
    },
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    twitterURL: String, 
    linkedInURL: String,
    resetPasswordToken: String,
    resetPasswordExpired: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); 
    }

    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword  = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({id: this._id } , process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES ,    
    });
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpired = Date.now()  + 15 * 60 * 1000;
    return resetToken;
}



export const UserSchema = mongoose.model("user_collection" , userSchema);