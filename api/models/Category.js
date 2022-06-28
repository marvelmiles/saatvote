import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Category name is required",
    },
    votes: {
      type: Number,
      default: 0,
    },
    winner: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      // required: "Category creator is required",
      ref: "electorates",
    },
    updatedBy: {
      type: mongoose.Schema.Types.Mixed,
      ref: "electorates",
    },
    nominees: [{ type: mongoose.Schema.Types.Mixed, ref: "nominees" }],
    pollingUnit: {
      type: String,
      required: "Polling unit required",
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

export default mongoose.model("categories", schema);
