import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";
import { Blog } from "../models/blogPost.models.js";



const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    try {
        // Check if the user has already liked the post
        const existingLike = await Like.findOne({
            blog: blogId,
            likedBy: req.user._id,
        });

        if (existingLike) {
            throw new ApiError(400, "You have already liked this post");
        } else {
            // Like the post
            const like = await Like.create({
                blog: blogId,
                likedBy: req.user._id,
            });

            blog.likesCount += 1;
            await blog.save()

            return res.status(201).json(new ApiResponse(201, like, "Post liked successfully"));
        }
    } catch (error) {
        throw new ApiError(500, "Failed to like post");
    }
});

const unlikeBlog = asyncHandler(async(req, res) =>{

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    try {
        const existingLike = await Like.findOne({
            blog: blogId,
            likedBy: req.user._id,
        });
        if (!existingLike) {
            throw new ApiError(400, "You have not liked the post")
        } else {
            blog.likesCount -= 1
            await blog.save()
            return res.status(201)
            .json(new ApiResponse(201, null, "Post unlike successfully"))
        }
        
    } catch (error) {
        throw new ApiError(500, "Failed to unlike post");
    }

})




export {
    likeBlog,
    unlikeBlog
}


