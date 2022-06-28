import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    content: String,
    maxAge: {
      type: Date,
      required: "max age required",
    },
    domain: {
      type: String,
      required: "Domain is required",
    },
    uid: {
      type: String,
      required: "A unique id is required",
    },
    primaryKey: String,
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

schema.methods = {
  hasExpired(maxAge) {
    return new Date(this.maxAge).getTime() <= new Date().getTime();
  },
};
export default mongoose.model("cookies", schema);
