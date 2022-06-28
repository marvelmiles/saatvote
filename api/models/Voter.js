import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    matNo: {
      type: String,
      required: "Matric number is required",
    },
    email: {
      type: String,
      required: "Email is required",
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    pollingUnit: {
      type: String,
      required: "Polling unit is required",
    },
    polls: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        // remove the props when object is serialized
        delete ret._id;
      },
    },
  }
);

export default mongoose.model("voters", schema);
