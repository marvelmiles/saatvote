import mongoose from "mongoose";
import Electorate from "./Electorate.js";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    createdBy: { ref: "electorates", type: mongoose.Schema.Types.ObjectId },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "voters" }],
    avatar: {
      type: Object,
    },
    whyMe: {
      type: String,
      required: "Why me required",
    },
    gratitude: {
      type: String,
      required: "Gratitude required",
    },
    category: { type: mongoose.Schema.Types.String, ref: "categories" },
    pollingUnit: { type: mongoose.Schema.Types.String, ref: "polls" },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model("nominees", schema);
