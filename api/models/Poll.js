import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: "Award name is required",
    },
    dueTime: String,
    dueDate: String,
    records: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "await",
    },
    lastPoll: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        // remove the props when object is serialized
        if (!ret._id) delete ret.id;
        delete ret._id;
        ret.lastRecord = doc.lastRecord;
        return ret;
      },
    },
  }
);

export default mongoose.model("polls", schema);
