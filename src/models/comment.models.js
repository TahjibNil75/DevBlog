import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    blog:{
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    content:{
        type: String,
        required: true,
    }
},{timestamps: true}
);

export const Comment = mongoose.model("Comment", commentSchema)







/* 
NOTES:
In MongoDB with Mongoose, there isn't a specific "text" type like in some other databases. 
Generally, for longer text fields such as comments, it's common to use the String
*/