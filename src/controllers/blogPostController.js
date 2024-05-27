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



const updateBlogPost = asyncHandler(async (req, res) =>{

    const {id} = req.params
    const blogPost = await Blog.findOne({_id:id})
    if (!blogPost) {
        throw new ApiError(404, "Blog post not found");
    }

    const {title, content, tags } = req.body
    const updateFeilds = {}
    if (title){
        updateFeilds.title = title
    }
    if (content){
        updateFeilds.content = content
    }
    if (tags){
        updateFeilds.tags = tags
    }
    // If no fields are provided in the request body, return a response indicating no changes were made
    if (Object.keys(updateFeilds).length == 0){
        return res.status(400)
        .json(
            400, null, "No fields provided for update"
        )
    }

    const updatePost = await Blog.findByIdAndUpdate(id,
        {
            $set: updateFeilds,
        },
        {
            new: true // Return the document after update
        });
    return res.status(200)
    .json(
        new ApiResponse(200, updatePost, "Blog post updated successfully")
    )

})

const getAllPosts = asyncHandler(async(req, res) => {
    try {
        return res.status(200)
        .json(
            new ApiResponse(200, res.paginatedResults, "Posts retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve posts");
    }
})



const deleteBlogPost = asyncHandler(async (req, res) =>{})




export {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllPosts,
}