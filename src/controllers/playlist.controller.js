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

export { createPlaylist, getUserPlaylist, getPlaylistById };
