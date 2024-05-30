import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { likeBlog, unlikeBlog } from "../controllers/likeController.js";


const router = Router()


router.route("/likeblog/:blogId").post(requireSignIn, likeBlog)
router.route("/unlikeblog/:blogId").post(requireSignIn, unlikeBlog)


export default router;