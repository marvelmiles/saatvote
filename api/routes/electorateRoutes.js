import express from "express";
import { ROLE } from "../config.js";
import { refreshToken, signout } from "../controllers/authController.js";
import {
  approveNominations,
  approveVoting,
  createElectorate,
  getElectorate,
  requestApproval,
  revokeApproval,
  signin,
} from "../controllers/electorateController.js";
import authenticate from "../middleware/authenticate.js";
import { upload } from "../middleware/fileHandler.js";
import Electorate from "../models/Electorate.js";

const router = express.Router();

router
  .post("/auth/signin", signin)
  .post(
    "/auth/signout",
    authenticate(Electorate, ROLE.ELECTORATE),
    signout(Electorate, ROLE.ELECTORATE)
  )
  .post(
    "/:id/request-approval",
    authenticate(Electorate, ROLE.ELECTORATE),
    requestApproval
  )
  .post(
    "/:id/approve-nominations",
    authenticate(Electorate, ROLE.ELECTORATE),
    approveNominations
  )
  .post(
    "/:id/approve-voting",
    authenticate(Electorate, ROLE.ELECTORATE),

    approveVoting
  )
  .post(
    "/:id/revoke-approval",
    authenticate(Electorate, ROLE.ELECTORATE),
    revokeApproval
  )
  .get("/refresh-token", refreshToken(ROLE.ELECTORATE))
  .get("/:id", getElectorate)
  .post("/", upload, createElectorate);

export default router;
