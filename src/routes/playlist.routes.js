import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/user/:userID").get(getUserPlaylist);
router.route("/:playListID").get(getPlaylistById).patch(updatePlaylist);
router.route("/add/:videoID/:playListID").patch(addVideoToPlaylist);
router.route("/remove/:videoID/:playListID").patch(removeVideoFromPlaylist);

export default router;
