import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!(videoId && mongoose.Types.ObjectId.isValid(videoId))) {
    throw new ApiError(400, "Invalid video id");
  }

  const comments = await Comment.find({ video: videoId })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Comment.countDocuments({ video: videoId });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
      "Comments fetched successfully"
    )
  );
});

export { getVideoComments };
