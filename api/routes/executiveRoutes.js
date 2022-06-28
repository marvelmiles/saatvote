import express from "express";
import { ROLE } from "../config.js";
import {
  createExecutive,
  deleteExecutive,
  updateExecutive,
} from "../controllers/executiveController.js";
import authenticate from "../middleware/authenticate.js";
import Electorate from "../models/Electorate.js";

const router = express.Router();

router
  .delete("/:id", authenticate(Electorate, ROLE.ELECTORATE), deleteExecutive)
  .put("/:id", authenticate(Electorate, ROLE.ELECTORATE), updateExecutive)
  .post("/", authenticate(Electorate, ROLE.ELECTORATE), createExecutive);

export default router;
