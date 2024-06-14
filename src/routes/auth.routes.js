import { Router } from "express";
import {
    login, 
    logout, 
    refreshAccessToken, 
    userSignUp,
    socialLogin
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer_middleware.js";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import passport from "passport";



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


// SSO Routes
router.route("/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"]
    }),
    (req, res) => {
        res.send("redirecting to google...")
    }
);
router
  .route("/google/callback")
  .get(passport.authenticate("google"), socialLogin);







export default router;