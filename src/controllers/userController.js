import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";



const updateAccountDetails = asyncHandler(async (req, res) => {
    const {username, firstName, lastName} = req.body; // Fix Bug: req.Body : Changed to req.body
    if (!username && !firstName && !lastName){
        throw new ApiError(400, "At least one feild is required to update")
    }

    // Build the update object dynamically
    const updateFeilds = {}
    if(username) updateFeilds.username = username
    if(firstName) updateFeilds.firstName = firstName
    if(lastName) updateFeilds.lastName = lastName

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFeilds,
        },
        {
            new: true // // Return the document after update
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    )
})

const getAllUsers = asyncHandler( async (req, res) => {
    try {
        return res.status(200)
        .json(
            new ApiResponse(200, res.paginatedResults, "Users retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve users");
    }
})

const searchUser = asyncHandler( async (req, res) => {
    const {username, email, firstName} = req.query
    if (!username && !email && !firstName){
        throw new ApiError(404, "username/email/firstName required")
    }

    // Build the search criteria
    const searchCriteria =  {};
    if (username) searchCriteria.username = username
    if (email) searchCriteria.email = email
    if (firstName) searchCriteria.firstName = firstName

    // Find the user and populate their blogs
    const user = await User.findOne(searchCriteria).populate({
        path: "userBlogList",
        model: "Blog"
    })
    if (!user){
        throw new ApiError(404, "User not found")
    }
    // Construct the response data
    const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        userBlogList: user.userBlogList
        
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200, userData, "User details retrieved successfully")
    )

})







export {
    updateAccountDetails,
    getAllUsers,
    searchUser
}