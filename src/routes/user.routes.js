import { Router } from "express";
import { getAllUsers, searchUser, updateAccountDetails } from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/auth_middleware.js";

const router = Router()

router.route("/update-account-details").patch(requireSignIn, updateAccountDetails)
router.route("/users").get(getAllUsers)
router.route("/searchUser").get(searchUser) // search by username, email, firstName




export default router;