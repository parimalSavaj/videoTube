import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name && description)) {
    throw new ApiError(400, "name or description find are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "error while creating playlist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "play list created successfully"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    throw new ApiError(400, "invalid user id");
  }

  const userPlaylist = await Playlist.find({ owner: userID });

  res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist || [], "find playlist by user name")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playListID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playListID)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const playlist = await Playlist.findById(playListID);

  res
    .status(200)
    .json(new ApiResponse(200, playlist || [], "find playlist successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playListID } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playListID)) {
    throw new ApiError(400, "invalid playList or video id");
  }

  if (!(name && description)) {
    throw new ApiError(400, "name and description required");
  }

  const playlist = await Playlist.findById(playListID);

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(401, "you can't modify other's playlist");
  }

  playlist.name = name;
  playlist.description = description;

  const updatedPlaylist = await playlist.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "updated playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playListID } = req.params;

  const playlist = await Playlist.findById(playListID);
  if (!playlist) {
    throw new ApiError(400, "playlist id not found");
  }

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(401, "you can't delete other's playlist");
  }

  await playlist.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, [], "playlist deleted successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playListID, videoID } = req.params;

  if (
    !(
      mongoose.Types.ObjectId.isValid(playListID) &&
      mongoose.Types.ObjectId.isValid(videoID)
    )
  ) {
    throw new ApiError(400, "invalid playList or video id");
  }

  const playlist = await Playlist.findById(playListID);

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(401, "you can't add modify other's playlist");
  }

  if (playlist.videos.includes(videoID)) {
    throw new ApiError(401, "video already exists");
  }

  playlist.videos.push(videoID);
  const updatedPlaylist = await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "video add successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playListID, videoID } = req.params;

  if (
    !(
      mongoose.Types.ObjectId.isValid(playListID) &&
      mongoose.Types.ObjectId.isValid(videoID)
    )
  ) {
    throw new ApiError(400, "invalid playList or video id");
  }

  const playlist = await Playlist.findById(playListID);

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(401, "you can't remove modify other's playlist");
  }

  playlist.videos.pop(videoID);
  const updatedPlaylist = await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "video remove successfully"));
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
};
