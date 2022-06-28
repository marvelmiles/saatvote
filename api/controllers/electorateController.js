import { ROLE } from "../config.js";
import { createPbk, getUserBasic, setCookie } from "../helpers.js";
import { createFileObj } from "../middleware/fileHandler.js";
import Electorate from "../models/Electorate.js";
import {
  generateJwtToken,
  generateRefreshToken,
  getStoredTokens,
} from "./authController.js";

export const signin = async (req, res, next) => {
  console.log("signin.... electorate");
  if (req.poll.status === "ongoing")
    return next(
      "You are not allowed to login. Voting and registration is ongoing!"
    );
  if (!(req.body.email && req.body.password))
    return next("Email or passworsssssd is required");

  try {
    let electorate = await Electorate.findOne({ email: req.body.email });
    if (!electorate)
      return next("Email or password no electorate is incorrect");
    if (!electorate.authenticate(req.body.password)) {
      return next("Email or password isssss incorrect");
    }
    // if (!electorate.chairperson && electorate.approvedOn)
    //   return next("Sorry you can't login. You sent approval already!");
    //    await RefreshToken.deleteOne({
    //   user: electorate.id,
    //   isActive: false,
    // });
    electorate.isLogin = true;
    const jwtToken = await generateJwtToken({
      id: electorate.id,
    });
    let { refreshToken } = await getStoredTokens(req, ROLE.ELECTORATE, false);
    if (!refreshToken || refreshToken.user !== electorate.id) {
      console.log("new refresh signin");
      refreshToken = await generateRefreshToken(electorate.id, req.ip);
      refreshToken = await refreshToken.save();
      await setCookie(req, res, {
        payload: { token: refreshToken.token },
        key: ROLE.ELECTORATE,
      });
    }
    console.log("await from...");
    return res.json({ jwtToken, electorate: getUserBasic(electorate) });
  } catch (err) {
    console.log("errr naming...");
    return next(err.message);
  }
};

export const createElectorate = async (req, res, next) => {
  console.log("creating electorate...");
  if (req.body.U !== process.env.U || req.body.P !== process.env.P)
    return next("Unauthorized access.");
  try {
    let electorate = await Electorate.findOne({ email: req.body.email });
    if (electorate) return next("A user with this account exists");
    req.body.chairperson = req.body.chairperson === "true" ? true : false;
    req.body.avatar = createFileObj(req.file, req.body.name + " image");
    req.body.password = createPbk("bidemiAkinrinmola@123", 100);
    electorate = new Electorate(req.body);
    await electorate.save();
    return res.json(getUserBasic(electorate));
  } catch (err) {
    // functions mainly to monitor wild behavior or error in production
    console.log(err.message, err.name);
    req.file && deleteFileSync(`uploads/${req.file.filename}`);
    next(err);
  }
};

export const getElectorateActionData = (electorate, action) => {
  return {
    id: electorate.id,
    avatar: electorate.avatar,
    name: electorate.name,
    approvedOn: electorate.approvedOn,
    requestedOn: electorate.requestedOn,
    approvedVotingOn: electorate.approvedVotingOn,
    nomineeCount: electorate.nomineeCount,
    categoryCount: electorate.categoryCount,
    executiveCount: electorate.executiveCount,
    chairperson: electorate.chairperson,
  };
};

export const requestApproval = async (req, res, next) => {
  try {
    console.log("requesting aprroval....");
    const elec = await Electorate.findByIdAndUpdate(
      req.params.id,
      {
        requestedOn: new Date(),
      },
      { new: true }
    );
    if (!elec) return next("Forbidden access");
    req.app
      .get("Io")
      .emit(
        "electorate-update",
        getElectorateActionData(elec),
        "request-approval"
      );
    res.json(`Request approved successfully`);
  } catch (err) {
    next(err);
  }
};

export const revokeApproval = async (req, res, next) => {
  try {
    console.log("revoking aprroval....");
    if (!req.user.chairperson) return next("Unauthorized access");
    const elec = await Electorate.findByIdAndUpdate(
      req.params.id,
      {
        requestedOn: "",
        approvedOn: "",
        approvedVotingOn: "",
      },
      { new: true }
    );
    if (!elec) return next("Forbidden access");
    req.app
      .get("Io")
      .emit(
        "electorate-update",
        getElectorateActionData(elec),
        "revoke-approval"
      );
    res.json(`Request approved successfully`);
  } catch (err) {
    next(err);
  }
};

export const approveNominations = async (req, res, next) => {
  try {
    console.log("approving..., voting process");
    if (!req.user.chairperson) return next("Unauthorized access");
    const elec = await Electorate.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        approvedOn: new Date(),
      },
      {
        new: true,
      }
    );
    req.app
      .get("Io")
      .emit(
        "electorate-update",
        getElectorateActionData(elec, "activities"),
        "approved"
      );
    res.json(`Electorate ${elec.name} nominations approved successfully`);
  } catch (err) {
    next(err);
  }
};

export const approveVoting = async (req, res, next) => {
  try {
    console.log("approving..., voting process");
    const elec = await Electorate.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        approvedVotingOn: new Date(),
      },
      {
        new: true,
      }
    );
    req.app
      .get("Io")
      .emit(
        "electorate-update",
        getElectorateActionData(elec),
        "approved-voting"
      );
    res.json(`Electorate ${elec.name} nominations approved successfully`);
  } catch (err) {
    next(err);
  }
};

export const getElectorate = async (req, res, next) => {
  try {
    console.log("getting electorate...");
    res.json(await Electorate.findById(req.params.id));
  } catch (err) {
    next(err);
  }
};
