import mongoose, {Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const validTags = [
                    "AWS", "GOLANG", "JAVASCRIPT", "Typescript", "nodejs", "reactjs", "GCP", 
                    "Kubernetes", "python", "Docker", "Database", "SQL", "NoSQL", "Azure"
];

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: [5, "Title Name is too small"],
            maxLength: [100, "Title is too Long"]
        },
        content:{
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: {
            type: [String], // Fixed Bug: To set multiple tags. Updated this line from String to [String] accept an array of strings
            maxLength: [30, "Tag Name is too long"],
            enum: {
                values: validTags,
                message: "Please enter a  valid tag name: AWS, GOLANG, JAVASCRIPT, Typescript, nodejs, reactjs, GCP, Kubernetes"
            }
        },
        status: {
            type: String,
            enum: ["published", "archived"],
            default: "published"
        }
    }, {timestamps: true}
)

blogSchema.plugin(mongoosePaginate);



export const Blog = mongoose.model("Blog", blogSchema)