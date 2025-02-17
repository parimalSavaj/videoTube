import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikeVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/video/:videoID").post(toggleVideoLike);
router.route("/toggle/comment/:commentID").post(toggleCommentLike);
router.route("/toggle/tweet/:tweetID").post(toggleTweetLike);
router.route("/videos").get(getLikeVideos);

export default router;
