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

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const existingSub = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (existingSub) {
    await existingSub.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribe successfully"));
  }

  const subscriber = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, subscriber, "Subscribe successfully"));
});
export { getSubscribedChannels, toggleSubscription };
