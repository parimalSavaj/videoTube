import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStatus = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    const videos = await Video.find({ owner: channelId }).lean();
    const totalVideos = videos.length;

    let totalViews = 0;
    let videoStats = [];

    for (const video of videos) {
      const videoLikes = await Like.countDocuments({ video: video._id });
      totalViews += video.views;

      videoStats.push({
        videoId: video._id,
        title: video.title,
        views: video.views,
        likes: videoLikes,
      });
    }

    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });

    res.status(200).json({
      totalVideos,
      totalViews,
      videoStats,
      totalSubscribers,
    });
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    res.status(500).json({ message: "Failed to fetch channel stats" });
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  try {
    const channelVideos = await Video.aggregate([
      {
        $group: {
          _id: "$owner", 
          totalVideos: { $sum: 1 }, 
          videos: {
            $push: {
              title: "$title",
              thumbnail: "$thumbnail",
              views: "$views",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $unwind: "$ownerDetails",
      },
      {
        $project: {
          owner: {
            _id: "$ownerDetails._id",
            name: "$ownerDetails.name",
            email: "$ownerDetails.email",
          },
          totalVideos: 1,
          videos: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, channels: channelVideos });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

export { getChannelStatus, getChannelVideos };
