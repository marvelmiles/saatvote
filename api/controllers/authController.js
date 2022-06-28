import { v4 as uniq } from "uuid";
import { getCookie, setCookie } from "../helpers.js";
import { ROLE } from "../config.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import twilio from "twilio";
import crypto from "crypto";
import Voter from "../models/Voter.js";

export const signout = (Collection = Voter, cookieKey = ROLE.VOTER) => {
  return async (req, res, next) => {
    try {
      console.log("signing out...");
      // const { refreshToken } = await getStoredTokens(req, cookieKey);
      // await RefreshToken.deleteOne({
      //   _id: refreshToken.id,
      // });
      const elec = await Collection.findOneAndUpdate(
        {
          _id: req.user.id,
          pollUnit: req.poll.name,
        },
        req.body,
        { new: true }
      );
      if (!elec) return next("User not found");
      await elec.save();
      res.json(`Logout ${elec.matNo || elec.name} successfully`);
    } catch (err) {
      next(err);
    }
  };
};

export const getRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken?.isActive) return null;
  return refreshToken;
};

export const generateRefreshToken = async (user, ip) => {
  return new RefreshToken({
    user,
    token: uniq(),
    expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ip, // used to verify client and add extra layer of security while request refresh token
  });
};
export const generateJwtToken = async (
  payload = {},
  options = { expiresIn: "5h" }
) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const getStoredTokens = (req, cookieKey, strict = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { token } = (await getCookie(req))[cookieKey] || {};
      const refreshToken = await getRefreshToken(token);
      if (strict) {
        if (!token) {
          console.log("forbidden one...", await getCookie(req));
          return reject("Forbidden access. token baddddd");
        }
        if (!refreshToken) {
          console.log("forbidden two");
          return reject("Forbidden access refrehs bad");
        }
      }
      return resolve({
        token,
        refreshToken,
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const refreshToken = (cookieKey) => {
  return async (req, res, next) => {
    console.log("refrshing token...");
    try {
      if (!cookieKey) return next("Internal server error");
      const { refreshToken } = await getStoredTokens(req, cookieKey);
      // replace old refresh token with a new one and save
      const newRefreshToken = await generateRefreshToken(
        refreshToken.user,
        req.ip
      );

      // deleting old and unuse refresh token since this api service
      // is for a specific purpose and not a saas. Uncomment code below if needed.

      // refreshToken.revoked = Date.now();
      // refreshToken.revokedByIp = ipAddress;
      // refreshToken.replacedByToken = newRefreshToken.token;
      // await refreshToken.save();

      await newRefreshToken.save();
      const jwtToken = await generateJwtToken({
        sub: newRefreshToken.user,
        id: newRefreshToken.user,
      });
      await setCookie(req, res, {
        key: cookieKey,
        payload: { token: newRefreshToken.token },
      });
      // await RefreshToken.deleteOne({
      //   _id: refreshToken.id,
      // });
      console.log("finished refrshing token... ", await getCookie(req));
      return res.json(jwtToken);
    } catch (err) {
      // timedout err
      console.log(err.message, "TYUII");
      next(err);
    }
  };
};

export const sendOTP = async (req, res, next) => {
  try {
    console.log("sening otp...");
    const phone = req.body.phone || "+2349162670753";
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    const hash = crypto
      .createHmac("sha256", process.env.SMS_SECRET)
      .update(data)
      .digest("hex");
    const fullhash = `${hash}.${expires}`;
    const t = await client.messages.create({
      body: `Your otp is ${otp}`,
      from: process.env.TWILIO_PHONENO,
      to: phone,
    });
    console.log(t);
    res.status(200).send({ phone, hash: fullhash, otp });
  } catch (err) {
    console.log(err.message, err.name);
    next(err);
  }
};
