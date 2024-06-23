import { Router } from "express";
import {
    login, 
    logout, 
    refreshAccessToken, 
    userSignUp,
    socialLogin,
    assignRole
} from "../controllers/authController.js";
import { upload } from "../middlewares/multer_middleware.js";
import { requireSignIn, verifyPermission } from "../middlewares/auth_middleware.js";
import passport from "passport";
import { UserRolesEnum } from "../constants.js";
// import { userAssignRoleValidator } from "../validator/user.validators.js";
import { userAssignRoleValidator } from "../validator/user.validators.js"; // Corrected path and name



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
router.route("/assign-role/:userId").post(
    requireSignIn,
    verifyPermission([UserRolesEnum.ADMIN]),
    userAssignRoleValidator,
    assignRole
)



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