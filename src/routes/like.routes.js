import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { likeUnlikeComment, likeUnlikePost } from "../controllers/likeController.js";


const router = Router()


router.route("/post/:postId").post(requireSignIn, likeUnlikePost)
router.route("/comment/:commentId").post(requireSignIn, likeUnlikeComment)


export default router;