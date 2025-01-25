import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // to see channel side so it's subscriber but it's user also
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // to see user side so it's channel but user also
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
