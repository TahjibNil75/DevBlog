import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { createBlogPost, updateBlogPost } from "../controllers/blogPostController.js";

const router = Router()

router.route("/create-post").post(requireSignIn, createBlogPost)
router.route("/update-post/:id").put(requireSignIn, updateBlogPost)


export default router;