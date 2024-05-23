import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadToS3 } from "../utils/awsS3.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";


const userSignUp = asyncHandler( async(req, res) => {

    const {username, email, firstName, lastName, password} = req.body
    if ([username,email, password, firstName, lastName].some((feilds) => feilds?.trim() === "")){
        throw new ApiError(400, "All feilds are required")
    }

    const existingUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if (existingUser){
        throw new ApiError(409, "User already exists")
    }

    // Get the local path of the uploaded profile picture, if it exists
    const  profilePictureLocalPath = req.files?.profilePicture?.[0]?.path || null;
    // If a profile picture is provided, upload it to S3 and get the uploaded file's URL
    // const profilePicture = profilePictureLocalPath ? await uploadToS3(profilePictureLocalPath): null; 
    const profilePictureUrl = profilePictureLocalPath ? (await uploadToS3(profilePictureLocalPath)).Location : null;  // Fix Bug: added .Location to get the profile picture url from s3


    const newUser = await User.create({
        username,
        email,
        firstName,
        lastName,
        password,
        profilePicture: profilePictureUrl || "",

    })
    const createdUser = await User.findById(newUser._id).select("-password")
    if (!createdUser){
        throw new ApiError (400, "Somwthing went wrong while creating User")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
})

const login = asyncHandler ( async (req, res) => {
    const {email, username, password} = req.body
    if (!email && !username){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })
    if (!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new ApiError(400, "Invalid User credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // Options to configure the cookies
    const options = {
        httpOnly: true, // Ensures the cookie is only accessible via web server, helps mitigate XSS attacks
        secure: true    // Ensures the cookie is sent over HTTPS only, helps protect data in transit
    };
    return res.status(200)
    .cookie("accessToken", accessToken, options) // Set the accessToken cookie with the configured options
    .cookie("refreshToken", refreshToken, options) // Set the refreshToken cookie with the configured options
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser
            },
            "User Logged In"
        )
    )
})

const logout = asyncHandler(async (req, res) => {
    // Clear user's session data
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: true // Remove the refreshToken field from the document
            }
        },
        {new: true}
    )
    // Clear cookies from the client-side
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out")
    );
})


export {
    userSignUp,
    login,
    logout
}