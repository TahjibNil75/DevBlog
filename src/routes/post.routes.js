import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { paginate } from "../middlewares/pagination_middleware.js";
import { createBlogPost, getAllPosts, updateBlogPost } from "../controllers/blogPostController.js";
import { Blog } from "../models/blogPost.models.js";

const router = Router()

router.route("/create-post").post(requireSignIn, createBlogPost)
router.route("/update-post/:id").put(requireSignIn, updateBlogPost)
router.route("/dashboard/all-posts").get(paginate(Blog), getAllPosts)


export default router;