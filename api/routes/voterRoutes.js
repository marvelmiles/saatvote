import express from "express";
import { ROLE } from "../config.js";
import { refreshToken, signout } from "../controllers/authController.js";
import {
  getVoterPolls,
  signin,
  voteNominee,
} from "../controllers/voterController.js";
import authenticate from "../middleware/authenticate.js";
import Voter from "../models/Voter.js";

const router = express.Router();

router
  .get("/refresh-token", refreshToken(ROLE.VOTER))
  .get("/:vid/polls", getVoterPolls)
  .post("/auth/signin", signin)
  .post("/auth/signout", authenticate(), signout())
  .put("/vote/:category/:nid", authenticate(Voter, ROLE.VOTER), voteNominee);

export default router;
