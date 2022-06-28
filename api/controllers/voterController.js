import { ROLE } from "../config.js";
import { getUserBasic, isActiveStudent, isEmail } from "../helpers.js";
import Voter from "../models/Voter.js";
import { generateJwtToken, generateRefreshToken } from "./authController.js";
import { setCookie } from "../helpers.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Nominee from "../models/Nominee.js";
export const signin = async (req, res, next) => {
  try {
    if (req.poll.status !== "ongoing")
      return next(
        "You are not allowed to login. Voting and registration hasn't started yet!"
      );
    if (!(isEmail(req.body.email) || isActiveStudent(req.body.matNo)))
      return next("Email or matric no i invalid");
    let voter = await Voter.findOne({
      email: req.body.email,
      matNo: req.body.matNo,
    });
    // if (voter && voter.isLogin) return next("Multiple login not allowed");
    req.body.isLogin = true;
    voter = new Voter(req.body);
    const jwtToken = await generateJwtToken({
      sub: voter.id,
      id: voter.id,
    });
    let refreshToken = await generateRefreshToken(voter.id, req.ip);
    refreshToken = await refreshToken.save();
    req.body.primaryKey = voter.id;
    await setCookie(req, res, {
      key: ROLE.VOTER,
      payload: refreshToken.token,
    });
    await voter.save();
    res.json({
      jwtToken,
      voter: {
        matNo: voter.matNo,
        email: voter.email,
        id: voter.id,
      },
    });
    console.log("done over");
  } catch (err) {
    next(err);
  }
};

export const voteNominee = async (req, res, next) => {
  try {
    console.log("voting....");
    if (!(req.params.category && mongoose.isValidObjectId(req.params.nid)))
      return next("Sorry you can't vote. Something is wrong with your request");
    const nominee = await Nominee.findOne({
      _id: req.params.nid,
      category: req.params.category,
      pollingUnit: req.poll.name,
    });
    const polls = req.user.polls;
    if (!polls[req.params.category]) polls[req.params.category] = {};
    if (polls[req.params.category].votedFor?.name)
      return next("Double voting not allowed");
    polls[req.params.category].votedFor = getUserBasic(nominee);
    await Category.findOneAndUpdate(
      {
        name: req.params.category,
        pollUnit: req.poll.name,
      },
      {
        $inc: {
          votes: 1,
        },
      },
      { new: true }
    );
    await Voter.updateOne(
      {
        _id: req.user.id,
      },
      {
        polls,
      },
      { new: true }
    );
    await Nominee.updateOne(
      {
        _id: nominee.id,
      },
      {
        $push: {
          voters: req.user.id,
        },
      },
      { new: true }
    );
    req.app.get("Io").emit("voter-poll", polls);
    res.json("Thank you for voting.");
  } catch (err) {
    next(err);
  }
};

export const getVoterPolls = async (req, res, next) => {
  try {
    console.log("getting voters poll...");
    if (!mongoose.isValidObjectId(req.params.vid))
      return next(
        "Can't get voter polls. Something is wrong with your request."
      );
    res.json((await Voter.findById(req.params.vid)).polls);
  } catch (err) {
    next(err);
  }
};
