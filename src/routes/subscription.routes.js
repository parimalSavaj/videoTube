import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannels,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/channel/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/user").get(getUserChannels);

export default router;
