import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const validateRegisterInput = ({
  username,
  email,
  fullName,
  password,
  avatar,
}) => {
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
  const createdUser = await User.findById(savedUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error while creating user.");
  }

  // Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully."));
});

const getAccessAndRefreshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSava: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token."
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "username or email is required.");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const isCurrectPass = await user.isPasswordCorrect(password);

  if (!isCurrectPass) {
    throw new ApiError(401, "invalid user credentials.");
  }

  const { accessToken, refreshToken } = await getAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully."));
});

export { registerUser, loginUser, logoutUser };
