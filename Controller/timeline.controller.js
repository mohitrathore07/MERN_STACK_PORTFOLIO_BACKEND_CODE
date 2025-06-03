import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import {TimeLine} from '../models/timeline.model.js';

export const postTimeline = catchAsyncErrors(async (req, res , next) => {
    const {title , description , from , to } = req.body;

    const newTimeLine = await TimeLine.create({title , description , timeline: {from , to}});
    
    res.status(200).json({
        success: true,
        message: "Timeline Added",
        newTimeLine,
    })
})

export const deleteTimeline = catchAsyncErrors(async (req, res , next) => {
    const {id} = req.params || {};
    const timeline = await TimeLine.findById(id);

    if(!timeline) {
        return next(new ErrorHandler("Timeline not found!!!", 404));
    }

    await timeline.deleteOne();
    res.status(200).json({
        success: true,
        message: "Time Line deleted"
    })
})

export const getAllTimeLines = catchAsyncErrors(async (req, res , next) => {
    const timeLines = await TimeLine.find();
    res.status(200).json({
        success: true,
        timeLines
    })
})