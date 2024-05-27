import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";



// Middleware to verify JWT token
export const requireSignIn = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user by ID from the decoded token, excluding password and refreshToken fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user is not found, throw an invalid access token error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach the user object to the request for use in next middleware or route
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
