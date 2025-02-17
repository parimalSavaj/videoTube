import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/channel/:channelId").get(getSubscribedChannels);

export default router;
