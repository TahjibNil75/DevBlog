import { Router } from "express";
import { authenticationVerifier } from "../middlewares/auth_middleware.js";
import { createBlogPost, updateBlogPost } from "../controllers/blogPostController.js";

const router = Router()

router.route("/create-post").post(authenticationVerifier, createBlogPost)
router.route("/update-post/:id").put(authenticationVerifier, updateBlogPost)


export default router;