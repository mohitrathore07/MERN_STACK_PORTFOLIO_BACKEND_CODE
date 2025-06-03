import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type:String,
        minLength: [2, "Name must contain at least 2 charcters!!"],
    },
    
    subject: {
        type:String,
        minLength: [2, "Subject must contain at least 2 charcters!!"],
    },

    message: {
        type:String,
        minLength: [2, "Message must contain at least 2 charcters!!"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Message = mongoose.model("message_collection" , messageSchema);