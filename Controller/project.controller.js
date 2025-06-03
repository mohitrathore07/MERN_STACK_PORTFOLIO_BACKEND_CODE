import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import { Project } from "../models/project.model.js";
import ErrorHandler from "../middleware/error.js";
import {v2 as cloudinary} from 'cloudinary';


export const addNewProject = catchAsyncErrors(async (req , res, next) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Project Banner image required!!"));
    }
    const {projectBanner} = req.files;
    const {
        title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed,
    }  = req.body;

    if(   
        !title || 
        !description || 
        !gitRepoLink|| 
        !projectLink|| 
        !technologies|| 
        !stack|| 
        !deployed) {
        return next(new ErrorHandler("all fields are required!!"));    
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        { folder: "Project_Images"}
    );

     if(!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error: ",
            cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return next(new ErrorHandler("Failed to upload project banner to cloudinary!!",500));    
    }

    const  project = await Project.create({
        title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed,
        projectBanner: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "New Project added",
        project
    })
});


export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
        return next(new ErrorHandler("Project not found!", 404));
    }

    const newProjectData = { ...req.body };


    if (req.files && req.files.projectBanner) {
        const projectBanner = req.files.projectBanner;

        if (project.projectBanner) {
            const projectBannerId = project.projectBanner.public_id;
            await cloudinary.uploader.destroy(projectBannerId);
        }

        
        const cloudinaryResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            { folder: "Project_Images" }
        );

        newProjectData.projectBanner = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    if (Object.keys(newProjectData).length === 0) {
        return res.status(200).json({
            success: true,
            message: "No updates were made.",
            project,
        });
    }


    const updatedProject = await Project.findByIdAndUpdate(id, newProjectData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Project updated successfully!",
        project: updatedProject,
    });
});


export const deleteProject = catchAsyncErrors(async (req , res, next) => {
    const {id} = req.params;

    const project  = await Project.findById(id);

    if(!project) {
        return next(new ErrorHandler("Project not found!", 404));
    }

    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: "Message Deleted"
    })
})

export const  getAllProject = catchAsyncErrors(async (req , res, next) => {
    const projects = await Project.find();
    res.status(200).json({
        success: true,
        projects
    })
})

export const getSingleProject = catchAsyncErrors(async (req , res, next) => {
    const {id} = req.params;

    const project = await Project.findById(id);

    if (!project) {
        return next(new ErrorHandler("Project not found!", 404));
    }

    res.status(200).json({
        success: true,
        project
    });
});