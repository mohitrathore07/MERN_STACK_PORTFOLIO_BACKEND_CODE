import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type:String,
        required: [true, "Title Required!!"],
    },
    
    description: {
        type:String,
        required: [true, "description Required!!"],
    },
    
    timeline: {
        from: {
            type: String, 
            required: [true , "Timeline starting date is required"],
        }, 
        to: String,
    }
});

export const TimeLine = mongoose.model("timeline_collection" , timelineSchema);