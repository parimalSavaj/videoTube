import fs from "node:fs";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!(title && description && videoLocalPath && thumbnailLocalPath)) {
    if (videoLocalPath) {
      fs.unlinkSync(videoLocalPath);
    }
    if (thumbnailLocalPath) {
      fs.unlinkSync(thumbnailLocalPath);
    }
    throw new ApiError(400, "All fields are required");
  }
  const uploadVideoResponse = await uploadOnCloudinary(videoLocalPath);
  const uploadThumbnailResponse = await uploadOnCloudinary(thumbnailLocalPath);

  if (!(uploadVideoResponse?.url && uploadThumbnailResponse?.url)) {
    throw new ApiError(400, "Error while uploading on video or thumbnail");
  }

  const videoObj = await Video.create({
    videoFile: uploadVideoResponse.url,
    thumbnail: uploadThumbnailResponse.url,
    title,
    description,
    duration: uploadVideoResponse.duration.toFixed(2),
    owner: req.user._id,
  });

  if (!videoObj) {
    throw new ApiError(400, "fail to creating video Object.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, videoObj, "Video upload successfully"));
});

export { uploadVideo };
