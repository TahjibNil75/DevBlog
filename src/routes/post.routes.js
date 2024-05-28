import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { paginate } from "../middlewares/pagination_middleware.js";
import { 
    createBlogPost, 
    deleteBlogPost, 
    getAllPosts, 
    getBlogPostByTags, 
    getSingleBlogPost, 
    searchPosts, 
    updateBlogPost 
} from "../controllers/blogPostController.js";
import { Blog } from "../models/blogPost.models.js";

const router = Router()

router.route("/create-post").post(requireSignIn, createBlogPost)
router.route("/update-post/:id").put(requireSignIn, updateBlogPost)
router.route("/delete-post/:id").delete(requireSignIn, deleteBlogPost)
router.route("/get-post/:id").get(getSingleBlogPost)
router.route("/dashboard/all-posts").get(paginate(Blog), getAllPosts)
router.route("/tags/all-posts").get(paginate(Blog), getBlogPostByTags)
router.route("/search/all-posts").get(paginate(Blog), searchPosts)



export default router;