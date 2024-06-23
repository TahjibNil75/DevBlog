import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Blog } from "../models/blogPost.models.js";
import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/apiResponse.js";



const createComment = asyncHandler(async (req, res) => {
    const {blogId} = req.params
    const {content} = req.body
    const blog = await Blog.findById(blogId)
     if (!blog){
         throw new ApiError(404, "Blog is not found");
     }
    
     const newComment = new Comment({content, blog:blogId})
     await newComment.save()
     blog.comments.push(newComment._id)
     await blog.save()

     return res
     .status(201)
     .json(
         new ApiResponse(201, newComment, "Comment Posted")
     )

})

// Todo: fix bug: only comment owner can update comments
const updateComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params
    const {content} = req.body
    const userId = req.user._id


    const updateComment = await Comment.findByIdAndUpdate(
        {_id: commentId, user: userId}, // Ensure the comment ID matches and the user is the owner
        {content},
        {new: true}
    )
    if (!updateComment){
        throw new ApiError(404, "Comment not found")
    }
    return res
     .status(201)
     .json(
         new ApiResponse(201, updateComment, "Comment Updated")
     )

})

// Comment owner can delete this only
const deleteComment = asyncHandler(async (req, res) =>{
    const {commentId, blogId} = req.params
    const userId = req.user._id

    const deleteComment = await Comment.findByIdAndDelete(
        {_id: commentId, user: userId}, // Ensure the comment ID matches and the user is the owner
        {new:true}
    )
    if (!deleteComment){
        throw new ApiError(404, "Comment not found")
    }
    await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: {comments: commentId}
        }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(201,null, "Comment Deleted")
    )

})

export {
    createComment,
    updateComment,
    deleteComment,
}