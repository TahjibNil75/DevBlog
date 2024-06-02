import { Router } from "express";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { bookMarkUnbookMarkPost } from "../controllers/bookMarkController.js";


const router = Router()

router.route("/mark-unmark/:postId").post(requireSignIn, bookMarkUnbookMarkPost)

export default router