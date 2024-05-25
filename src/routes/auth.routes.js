import { Router } from "express";
import {
    login, 
    logout, 
    refreshAccessToken, 
    userSignUp
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer_middleware.js";
import { authenticationVerifier } from "../middlewares/auth_middleware.js";

const router = Router()

router.route("/user-signup").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]), userSignUp)

router.route("/login").post(login)
router.route("/logout").post(authenticationVerifier, logout)
router.route("/refresh").post(refreshAccessToken)





export default router;