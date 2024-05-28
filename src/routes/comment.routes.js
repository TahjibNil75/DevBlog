import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { createComment } from "../controllers/commentController.js";

const router = Router()


router.route("/create-comment/:blogId").post(requireSignIn, createComment)


export default router;
