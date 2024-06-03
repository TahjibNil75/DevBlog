import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";
import { Blog } from "../models/blogPost.models.js";
import { Comment } from "../models/comment.models.js";


const likeUnlikePost = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const post = await Blog.findOne(blogId)
    if (!post) {
        throw new ApiError(404, "Blog is not found");
    }
    // See if user has already liked the post
    const isAlreadyLiked = await Like.findOne({
        blog: blogId,
        likedBy: req.user?._id
    })
    if (isAlreadyLiked){
        await Like.findOneAndDelete({
            blog: blogId,
            likedBy: req.user?._id
        })

        post.likesCount -= 1
        await post.save()

        return res.status(200).json(
            new ApiResponse(200, null, "unliked")
        );
    } else {
        const like = await Like.create({
            blog: blogId,
            likedBy: req.user?._id
        })

        post.likesCount += 1;
        await post.save()

        return res.status(200).json(
            new ApiResponse(200, like, "liked")
        );
    }
})

const likeUnlikeComment = asyncHandler(async (req, res)=>{
    const { commentId } = req.params
    const comment = await Comment.findOne({_id:commentId})
    if (!comment){
        throw new ApiError(404, "comment is not found");
    }
    const isAlreadyLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })
    if (isAlreadyLiked){
        await Like.findOneAndDelete({
            comment: commentId,
            likedBy: req.user?._id
        })
        comment.likesCount -= 1
        await comment.save()

        return res.status(200).json(
            new ApiResponse(200, null, "unliked")
        );

    }else {
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        comment.likesCount += 1
        await comment.save()

        return res.status(200).json(
            new ApiResponse(200, like, "liked")
        );
    }
})






export {
    likeUnlikePost,
    likeUnlikeComment
}


