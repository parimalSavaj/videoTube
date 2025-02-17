import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/channel/:channelId").get(getSubscribedChannels).post(toggleSubscription);

export default router;
