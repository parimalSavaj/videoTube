import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!(channelId && mongoose.Types.ObjectId.isValid(channelId))) {
    throw new ApiError(400, "Invalid video id");
  }

  const subscriber = await Subscription.find({ channel: channelId });

  res
    .status(201)
    .json(
      new ApiResponse(201, subscriber, "get all subscriber based on channel")
    );
});

export { getSubscribedChannels };
