import { Router } from "express";
import {
    login, 
    logout, 
    refreshAccessToken, 
    userSignUp
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer_middleware.js";
import { requireSignIn } from "../middlewares/auth_middleware.js";

const router = Router()



router.route("/user-signup").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]), userSignUp)

router.route("/login").post(login)
router.route("/logout").post(requireSignIn, logout)
router.route("/refresh").post(requireSignIn,refreshAccessToken)





export default router;