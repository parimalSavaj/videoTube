import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { text } from "express";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (content.trim() === "") {
    throw new ApiError(400, "Tweet content cannot be empty");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!(userId && mongoose.Types.ObjectId.isValid(userId))) {
    throw new ApiError(400, "invalid user id");
  }

  const tweets = await Tweet.find({ owner: userId }).populate(
    "owner",
    "username email fullName"
  );

  if (!tweets) {
    throw new ApiError(404, "No tweets found for this user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content cannot be empty");
  }

  if (!(tweetId && mongoose.Types.ObjectId.isValid(tweetId))) {
    throw new ApiError(400, "invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  tweet.content = content;
  await tweet.save();

  res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!(tweetId && mongoose.Types.ObjectId.isValid(tweetId))) {
    throw new ApiError(400, "invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  await tweet.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "tweet delete successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
