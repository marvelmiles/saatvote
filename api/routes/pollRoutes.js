import express from "express";
import {
  getPollUnit,
  _getPollUnit,
  setPollTimeline,
} from "../controllers/pollController.js";
import voterRoutes from "./voterRoutes.js";
import electorateRoutes from "./electorateRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import executiveRoutes from "./executiveRoutes.js";
import authenticate from "../middleware/authenticate.js";
import Electorate from "../models/Electorate.js";
import { ROLE } from "../config.js";
import {
  getCategories,
  getEelectorates,
  getExecutives,
} from "../controllers/massController.js";

const router = express.Router();
router
  .use("/:unit/voter", voterRoutes)
  .use("/:unit/electorate", electorateRoutes)
  .use("/:unit/category", categoryRoutes)
  .use("/:unit/executive", executiveRoutes)
  .get("/:unit/electorates", getEelectorates)
  .get("/:unit/executives", getExecutives)
  .get("/:unit/categories", getCategories)
  .put(
    "/:unit/poll",
    authenticate(Electorate, ROLE.ELECTORATE),
    setPollTimeline
  )
  .get("/:unit", getPollUnit);
router.param("unit", _getPollUnit);
export default router;
