import express from "express";
import { ROLE } from "../config.js";
import {
  createNominee,
  deleteNominee,
  updateNominee,
} from "../controllers/categoryController.js";
import authenticate from "../middleware/authenticate.js";
import { upload } from "../middleware/fileHandler.js";
import Electorate from "../models/Electorate.js";
const router = express.Router();

router
  .delete(
    "/:category/nominee/:nid",
    authenticate(Electorate, ROLE.ELECTORATE),
    deleteNominee
  )
  .put("/:category/nominee/:nid/poll")
  .put(
    "/:category/nominee/:nid",
    authenticate(Electorate, ROLE.ELECTORATE),
    updateNominee
  )
  .post(
    "/:category/nominee",
    authenticate(Electorate, ROLE.ELECTORATE),
    upload,
    createNominee
  );

export default router;
