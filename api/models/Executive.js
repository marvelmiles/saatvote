import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Executive name is required",
    },
    post: {
      type: String,
      required: "Executive post is required",
      min: 1,
      max: 256,
    },
    department: {
      type: String,
      min: 1,
      max: 256,
      default: "Agricultural resource and economics",
    },
    avatar: {
      src: {
        type: String,
        required: "Image src is required",
      },
      mimetype: {
        type: String,
        required: "Image mimetype is required",
      },
      alt: {
        type: String,
        required: "Image alt is required",
      },
    },
    socials: {
      type: Array,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      // required: "Created by id is required",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    pollingUnit: {
      type: String,
      required: "Polling unnit is required",
    },
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

export default mongoose.model("executives", schema);
