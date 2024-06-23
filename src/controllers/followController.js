import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Follow } from "../models/follow.models.js";

const followUnfollowUser = asyncHandler(async (req, res) => {
    // Id of user to follow
    const { toBeFollowedUserId } = req.params;

    // See if user that is being followed exist
    const toBeFollowed = await User.findById(toBeFollowedUserId);
    if (!toBeFollowed) {
        throw new ApiError(404, "User Does not exist")
    }

    // Check of the user who is being followed is not the one who is requesting
    if (toBeFollowedUserId === req.user._id.toString()) {
        throw new ApiError(422, "You cannot follow yourself");
    }
    // Check if logged user is already following the to be followed user
    const isAlreadyFollowing = await Follow.findOne({
        followerId: req.user._id,
        followeeId: toBeFollowed._id
    })
    if (!isAlreadyFollowing) {
        const follow = await Follow.create({
            followerId: req.user._id,
            followeeId: toBeFollowed._id
        });

        toBeFollowed.followersCount += 1;
        req.user.followingCount += 1;
        await toBeFollowed.save();
        await req.user.save();

        return res.status(200).json(
            new ApiResponse(200, follow, "Followed successfully")
        );
    } else {
        const unfollow = await Follow.findOneAndDelete({
            followerId: req.user._id,
            followeeId: toBeFollowed._id
        });

        toBeFollowed.followersCount -= 1;
        req.user.followingCount -= 1;
        await toBeFollowed.save();
        await req.user.save();

        return res.status(200).json(
            new ApiResponse(200, unfollow, "Un-followed successfully")
        );
    }
});




export {followUnfollowUser}

