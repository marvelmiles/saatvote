import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    user: {
      type: Object,
      required: "User Object is required",
    },
    token: String,
    expiresIn: Date,
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
      },
    },
  }
);
schema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

schema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

export default mongoose.model("refreshTokens", schema);
