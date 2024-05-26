import { Router } from "express";
import { authenticationVerifier } from "../middlewares/auth_middleware.js";
import { createBlogPost } from "../controllers/blogPostController.js";

const router = Router()

router.route("/create-post").post(authenticationVerifier, createBlogPost)


export default router;