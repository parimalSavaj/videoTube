import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  getVideoById,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/publishVideo")
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    uploadVideo
  )
  .get(getAllVideos);

router
  .route("/:videoID")
  .get(getVideoById)
  .patch(upload.single("thumbnail"), updateVideo);

export default router;
