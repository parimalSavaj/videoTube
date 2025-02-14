import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoID } = req.params;

  if (!(videoID && mongoose.Types.ObjectId.isValid(videoID))) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoID);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoID,
    likedBy: req.user._id,
  });

  if (existingLike) {
    console.log("Deleting existing like");

    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  }

  const like = await Like.create({
    video: videoID,
    likedBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { like }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentID } = req.params;

  if (!(commentID && mongoose.Types.ObjectId.isValid(commentID))) {
    throw new ApiError(400, "Invalid comment id");
  }

  const existingLike = await Like.findOne({
    comment: commentID,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  }

  const like = await Like.create({
    comment: commentID,
    likedBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { like }, "Comment liked successfully"));
});

export { toggleVideoLike, toggleCommentLike };
