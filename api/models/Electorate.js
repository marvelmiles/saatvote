import mongoose from "mongoose";
import { v4 as uniq } from "uuid";
import { createPbk } from "../helpers.js";
const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: "Your email is required",
    },
    name: {
      type: String,
      required: "Specify your fullname",
    },
    avatar: {
      alt: {
        type: String,
        required: "Image alt is required",
      },
      src: {
        type: String,
        required: "Image src is required",
      },
      mimetype: {
        type: String,
        required: "Image mimetype is required",
      },
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    salt: String,
    password: {
      type: String,
      required: "Password is required",
      set: function (pwd) {
        this.salt = uniq();
        return this.encryptPwd(pwd);
      },
    },
    award: {
      type: String,
      award: "Award name is required",
    },
    categoryCount: {
      type: Number,
      default: 0,
    },
    nomineeCount: {
      type: Number,
      default: 0,
    },
    executiveCount: {
      type: Number,
      default: 0,
    },
    requestedOn: String,
    approvedOn: String,
    chairperson: {
      type: Boolean,
      default: false,
      set(v) {
        if (v) {
          this.requestedOn = new Date();
          this.approvedOn = new Date();
          this.approvedVotingOn = new Date();
        }
        return v;
      },
    },
    approvedVotingOn: String,
    pollingUnit: {
      type: String,
      required: "Polling unit required",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        // remove the props when object is serialized
        console.log("transforminggg", ret.id, ret._id);
        if (!ret._id) delete ret.id;
        delete ret._id;
        delete ret.salt;
        delete ret.password;
      },
    },
  }
);
schema.methods = {
  authenticate(value) {
    console.log(this.encryptPwd(value) === this.password, "klll");
    return this.encryptPwd(value) === this.password;
  },
  encryptPwd(pwd) {
    if (!pwd) return this.invalidate("password", err.message);
    try {
      return createPbk(pwd);
    } catch (err) {
      console.log("err in pwd", err.message, err.name);
      this.invalidate("password", err.message);
    }
  },
};
export default mongoose.model("electorates", schema);
