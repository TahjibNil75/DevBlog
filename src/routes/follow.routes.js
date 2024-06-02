import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { followUnfollowUser } from "../controllers/followController.js";

const router = Router()

router.route("/follow-unfollow/:toBeFollowedUserId").post(requireSignIn, followUnfollowUser)

export default router