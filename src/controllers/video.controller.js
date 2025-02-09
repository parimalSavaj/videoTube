import fs from "node:fs";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { mongo } from "mongoose";

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

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userID,
  } = req.query;

  //* setup pagination.
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  //* setup where condition(filters object)
  const filters = {
    $or: [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
      ...(userID ? [{ owner: userID }] : []),
    ],
  };

  //* setup sort object
  const sort = { [sortBy]: sortType === "desc" ? -1 : 1 };

  const videos = await Video.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .populate("owner", "username");

  if (!videos) {
    throw new ApiError(404, "No videos found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoID } = req.params;

  if (!mongoose.isValidObjectId(videoID)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoID).populate("owner", "username");

  if (!video) {
    throw new ApiError(404, "video id not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched by id successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoID } = req.params;
  const { title, description } = req.body;

  if (!mongoose.isValidObjectId(videoID)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoID);

  if (!video) {
    throw new ApiError(400, "video not found.");
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (req.file) {
    const thumbnailLocalPath = req.file.path;
    
    const cloudinaryResponse = await uploadOnCloudinary(thumbnailLocalPath);

    if (!cloudinaryResponse?.url) {
      throw new ApiError(500, "Error while uploading on thumbnail");
    }

    video.thumbnail = cloudinaryResponse.url;
  }

  const updatedVideo = await video.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "video update successfully"));
});

export { uploadVideo, getAllVideos, getVideoById, updateVideo };
