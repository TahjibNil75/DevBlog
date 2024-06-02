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
    if (!author){
        throw new ApiError(404, "Invalid request")
    }
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

const deleteBlogPost = asyncHandler(async (req, res) =>{
    const {id} = req.params
    const blogPost = await Blog.findOne({_id:id})
    if (!blogPost){
        throw new ApiError(404, "Blog post not found")
    }

    await Blog.findByIdAndDelete(id)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {blogPost: blogPost._id} // Pull (remove) the specified blog post ID from the user's blogPost array
        }, {new: true}
    )
    return res.status(204)
    .json(
        new ApiResponse(204, {}, "Blog post deleted")
    )
})


const getSingleBlogPost = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params
        const blogPost = await Blog.findById({_id:id})
        if (!blogPost){
            throw new ApiError(404, "Blog post not found")
        }
        return res.status(200)
        .json(
            new ApiResponse(200, blogPost, "Post retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve post");
    }
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

const getBlogPostByTags = asyncHandler(async(req, res) =>{
    try {
        return res.status(200)
        .json(
            new ApiResponse(200, res.paginatedResults, "Posts retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve posts");
    }
})

const getBookMarkedPosts = asyncHandler(async(req, res) => {
    try {
        return res.status(200)
        .json(
            new ApiResponse(200, res.paginatedResults, "Posts retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve posts");
    }
})

// Combined Api of getALLPosts and getBlogPostByTags
const searchPosts = asyncHandler(async(req, res) =>{
    try {
        return res.status(200)
        .json(
            new ApiResponse(200, res.paginatedResults, "Posts retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve posts")
    }
})






export {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllPosts,
    getBlogPostByTags,
    searchPosts,
    getSingleBlogPost,
    getBookMarkedPosts,
}






// const getBlogPostByTags = asyncHandler(async(req, res) =>{
//     try {
//         // The ? is a ternary operator, which is a shorthand for an if-else statement. It checks if req.query.tags is truthy (i.e., it exists and is not empty).
//         // If req.query.tags is truthy (the tags parameter is provided), the code executes req.query.tags.split(',').
//         // The : is part of the ternary operator's syntax, separating the true case from the false case.
//         // f req.query.tags is falsy (the tags parameter is not provided or is empty), the code executes []. [] creates an empty array.
//         /*
//         Combining it all:
//         If req.query.tags is provided and not empty, tags will be an array of strings split by commas (e.g., ['AWS', 'GOLANG']).
//         If req.query.tags is not provided or is empty, tags will be an empty array ([]).
//         */
//         const tags = req.query.tags ? req.query.tags.split(',') : [];
//         if (tags.length === 0) {
//             throw new ApiError(400, "No tags provided")
//         }
//         const posts = await Blog.find(
//             {
//                 $tags: {$in: tags}
//             }
//         )
//         return res.status(200)
//         .json(
//             new ApiResponse (200, posts, "Posts retrieved successfully")
//         )
        
//     } catch (error) {
//         throw new ApiError(500, "Failed to retrieve posts")
//     }
// })