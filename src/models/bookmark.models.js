import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const bookMarkSchema = new Schema(
    {
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },
        bookmarkedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, 
    { timestamps: true }
);

// Apply the pagination plugin to the bookMarkSchema
bookMarkSchema.plugin(mongoosePaginate);

export const BookMark = mongoose.model("Bookmark", bookMarkSchema);
