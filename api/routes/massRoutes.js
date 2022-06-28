import express from "express";
import {
  getCategories,
  getEelectorates,
  getExecutives,
  storeCookie,
  getStoredCookie,
} from "../controllers/massController.js";

const router = express.Router();
router
  .get("/electorates", getEelectorates)
  .get("/executives", getExecutives)
  .get("/categories", getCategories)
  .post("/store-cookie", storeCookie)
  .get("/get-cookie/:uid", getStoredCookie);

export default router;
