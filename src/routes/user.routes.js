import { Router } from "express";
import { getAllUsers, searchUser, updateAccountDetails } from "../controllers/userController.js";
import { authenticationVerifier } from "../middlewares/auth_middleware.js";

const router = Router()

router.route("/update-account-details").patch(authenticationVerifier, updateAccountDetails)
router.route("/users").get(getAllUsers)
router.route("/searchUser").get(searchUser)




export default router;