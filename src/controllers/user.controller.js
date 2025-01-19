import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const validateRegisterInput = ({ username, email, fullName, password, avatar }) => {
  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, "All fields are required.");
  }
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Destructure request body and files
  const { username, email, fullName, password } = req.body;
  const avatar = req.files?.avatar?.[0];
  const coverImage = req.files?.coverImage?.[0];

  // Validate input
  validateRegisterInput({ username, email, fullName, password, avatar });

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists.");
  }

  // Upload images to Cloudinary
  const uploadedAvatar = await uploadOnCloudinary(avatar.path);
  if (!uploadedAvatar) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary.");
  }

  const uploadedCoverImage = coverImage
    ? await uploadOnCloudinary(coverImage.path)
    : null;

  // Create new user
  const user = new User({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: uploadedAvatar.url,
    coverImage: uploadedCoverImage?.url || "",
  });

  const savedUser = await user.save();

  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(savedUser._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Error while creating user.");
  }

  // Send success response
  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Login User",
  });
});

export { registerUser, loginUser };
