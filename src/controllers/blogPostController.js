import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { Blog } from "../models/blogPost.models.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createBlogPost = asyncHandler(async (req, res) => {
    const {title, content, tags} = req.body
    if (!title || !content){
        throw new ApiError(400, "Title and Content are required")
    }

    const author = req.user._id  // Get the authenticated user's ID from the request
    const createBlog = new Blog({
        title,
        content,
        author,
        tags,
    })
    const newBlogPost = await createBlog.save()

    await User.findByIdAndUpdate(req.user._id,{
        $push: {userBlogList: newBlogPost._id}
    })

    return res.status(201)
    .json(
        new ApiResponse(201, newBlogPost, "Blog post created successfully")
    )
})


const updateBlogPost = asyncHandler(async (req, res) =>{})


const deleteBlogPost = asyncHandler(async (req, res) =>{})




export {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
}