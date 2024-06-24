import { Router } from "express";

import { healthcheck } from "../controllers/healthCheckController.js";


const router = Router()

router.route("/").get(healthcheck)
router.route("/test").get(healthcheck)

export default router