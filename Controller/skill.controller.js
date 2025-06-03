import ErrorHandler from "../middleware/error.js";
import {catchAsyncErrors} from '../middleware/catchAsyncErrors.js';
import {v2 as cloudinary} from 'cloudinary';
import {Skills} from '../models/skills.model.js';



export const addNewSkills = catchAsyncErrors(async (req, res , next)=> {
     if(!req.files || Object.keys(req.files).length === 0) {
        return next (new ErrorHandler("Skill Svg  required!!!", 400));
    }

    const {svg} = req.files;
    const {title, proficiency} = req.body;

    if(!title || !proficiency) {
        return next(new ErrorHandler("Please fill full form!",400 ));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        {folder: "PORTFOLIO_SKILLS_SVGS"}
    );

    if(!cloudinaryResponse|| cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error: ",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
    }

    const skill  = await Skills.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        },
    });

    res.status(200).json({
        success: true,
        message: "New Skill Added",
        skill
    })
});

export const deleteSkill = catchAsyncErrors(async (req, res , next)=> {
    const {id} = req.params;
    const skill = await Skills.findById(id);
    if(!skill) {
        return next(new ErrorHandler ("Skill not found!!", 400));
    }

    const skillSvgId = skill.svg.public_id;

    await cloudinary.uploader.destroy(skillSvgId);
    await skill.deleteOne();
    res.status(200).json({
        success: true,
        message:"skill deleted!!",
   });
});

export const updateSkill = catchAsyncErrors(async (req, res , next)=> {
    const {id} = req.params;

    let skill = await Skills.findById(id);

    if(!skill) {
        return next(new ErrorHandler("Skill not found!!", 400));
    }

    const {proficiency}  = req.body;

    skill = await Skills.findByIdAndUpdate(id , {proficiency} , {
        new: true, 
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Skill Updated",
        skill
    })
});

export const getAllSkills = catchAsyncErrors(async (req, res , next)=> { 
    const skills = await Skills.find();
        res.status(200).json({
            success: true,
            skills
        })
});