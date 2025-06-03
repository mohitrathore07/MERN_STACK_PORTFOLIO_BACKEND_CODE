import mongoose from "mongoose";

const SoftwareApplcationSchema  = new mongoose.Schema({
    name: String,
    svg: {
        public_id: {
            type:String, 
            required: true,
        },
        url: {
            type: String,
            required: true
        },
    },
});


export const SoftwareApplication = mongoose.model(
    "SoftwareApplication_collection", SoftwareApplcationSchema
);