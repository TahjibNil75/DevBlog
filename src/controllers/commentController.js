import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Blog } from "../models/blogPost.models.js";
import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createComment = asyncHandler(async (req, res) => {})


const updateComment = asyncHandler(async(req, res)=>{})


const deleteComment = asyncHandler(async (req, res) =>{})

export {
    createComment,
    updateComment,
    deleteComment,
}