import { Router } from "express";
import { getAllUsers, searchUser, updateAccountDetails } from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/auth_middleware.js";
import { paginate } from "../middlewares/pagination_middleware.js";
import { User } from "../models/user.models.js";

const router = Router()

router.route("/update-account-details").patch(requireSignIn, updateAccountDetails)
router.route("/users").get(paginate(User),getAllUsers)
router.route("/searchUser").get(searchUser) // search by username, email, firstName




export default router;