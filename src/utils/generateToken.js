import { User } from "../models/user.models.js"

const generateAccessAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // used to avoid password re-save

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


export{generateAccessAndRefreshToken}

