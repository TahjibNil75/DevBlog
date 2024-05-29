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


const updateComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params
    const {content} = req.body
    const updateComment = await Comment.findByIdAndUpdate(
        commentId, {content},
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

// TODO: Fix It: Cast to ObjectId failed for value ":6653626d2f246085783b7f58" (type string) at path "_id" for model "Blog"
const deleteComment = asyncHandler(async (req, res) =>{
    const {commentId, blogId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment){
        throw new ApiError(404, "Comment is not found");
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




// TODO: Fix this api
// const createComment = asyncHandler(async(req, res)=> {
//     const { blogId } = req.params;
//     const { content } = req.body;
//     try {
//         // Combine blog retrieval and comment creation in a single transaction
//         const [blog, newComment] = await Promise.all([
//             Blog.findByIdAndUpdate(
//                 blogId,
//                 {
//                     $push:{comments: content},
//                 }, {new: true},
//             ),
//             new Comment({
//                 content,
//                 blog: blogId
//             }).save()
//         ])
//         if (!blog) {
//             throw new ApiError(404, "Blog is not found");
//           }
//           return res
//           .status(201)
//           .json(
//             new ApiResponse(201, newComment, "Comment Posted")
//           );  
        
//     } catch (error) {
//         return res
//         .status(500)
//         .json(
//             new ApiError (500, "Error creating comment")
//         )
//     }
// })