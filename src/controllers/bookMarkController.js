import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Blog } from "../models/blogPost.models.js";
import { BookMark } from "../models/bookmark.models.js";

const bookMarkUnbookMarkPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Check for post existence
    const post = await Blog.findById(postId);
    if (!post) {
        throw new ApiError(404, "Blog is not found");
    }

    // See if user has already bookmarked the post
    const isAlreadyBookmarked = await BookMark.findOne({
        blog: postId, // Use 'blog' instead of 'postId'
        bookmarkedBy: req.user?._id,
    });

    if (isAlreadyBookmarked) {
        // Delete the bookmark
        await BookMark.findOneAndDelete({
            blog: postId, // Use 'blog' instead of 'postId'
            bookmarkedBy: req.user?._id,
        });

        return res.status(200).json(
            new ApiResponse(200, null, "Bookmark removed successfully")
        );
    } else {
        // Create a new bookmark
        const bookMark = await BookMark.create({
            blog: postId, // Use 'blog' instead of 'postId'
            bookmarkedBy: req.user?._id,
        });

        return res.status(200).json(
            new ApiResponse(200, bookMark, "Bookmarked successfully")
        );
    }
});

export { bookMarkUnbookMarkPost };
