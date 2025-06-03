import {UserSchema} from '../models/user.model.js';
import ErrorHandler from "../middleware/error.js";
import {catchAsyncErrors} from '../middleware/catchAsyncErrors.js';
import jwt from 'jsonwebtoken';


export const isAuthenticated = catchAsyncErrors(async (req, res , next)=> {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("User Not authenticated!! ",400));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await UserSchema.findById(decoded.id);
    next();
});
