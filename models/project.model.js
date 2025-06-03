import mongoose from "mongoose";

const projectSchma = new mongoose.Schema({
    title: String,
    description: String,
    gitRepoLink: String,
    projectLink: String,
    technologies: String,
    stack: String,
    deployed: String,
    projectBanner: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required : true
        },
    },
});

export const Project = mongoose.model("project_collection" , projectSchma);