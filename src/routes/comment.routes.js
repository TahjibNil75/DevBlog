import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { createComment, deleteComment, updateComment } from "../controllers/commentController.js";

const router = Router()


router.route("/create-comment/:blogId").post(requireSignIn, createComment)
router.route("/update-comment/:commentId").put(requireSignIn, updateComment)
router.route("/delete-comment/blogs/:blogId/comments/:commentId").delete(requireSignIn, deleteComment)


export default router;
