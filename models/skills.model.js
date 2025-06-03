import mongoose from 'mongoose';

const skillSchema = mongoose.Schema({
    title: String,
    proficiency: String,
    svg: {
        public_id: {
            type:String, 
            required: true,
        },
        url: {
            type: String,
            required: true
        },
    }
})

export const Skills = mongoose.model("skill_collection", skillSchema);