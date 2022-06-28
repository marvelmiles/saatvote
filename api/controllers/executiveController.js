import mongoose from "mongoose";
import { createFileObj } from "../middleware/fileHandler.js";
import Electorate from "../models/Electorate.js";
import Executive from "../models/Executive.js";
import { getElectorateActionData } from "./electorateController.js";

export const createExecutive = async (req, res, next) => {
  try {
    console.log("creating executive...");
    let executive = await Executive.findOne({
      name: req.body.name,
      department: req.body.department,
      post: req.body.post,
      pollingUnit: req.poll.name,
    });
    if (executive)
      return next(
        `Executive ${executive.name} exists. Created by ${executive.createdBy}`
      );
    req.body.pollingUnit = req.poll.name;
    req.body.createdBy = req.user.id;
    req.body.avatar = createFileObj(req.file, `${req.body.name} image`);
    executive = new Executive(req.body);
    executive = await executive.save();
    const elec = await Electorate.findByIdAndUpdate(
      req.body.createdBy,
      {
        executiveCount: ++req.user.executiveCount,
      },
      { new: true }
    );
    req.app.get("Io").emit("executive-update", executive, "add");
    req.app
      .get("Io")
      .emit(
        "electorate-update",
        getElectorateActionData(elec, "activities"),
        "activities"
      );
    return res.json(`Created executive ${executive.name} successfully.`);
  } catch (err) {
    req.file && deleteFileSync(`/uploads/${req.file.filename}`);
    next(err);
  }
};

export const deleteExecutive = async (req, res, next) => {
  try {
    console.log("deleting executive..");
    if (!mongoose.isValidObjectId(req.params.id))
      return next("Unable to perform action executive id is faulty");
    const exec = await Executive.findByIdAndDelete(req.params.id, {
      new: true,
    });

    if (!exec) return res.json(`Deleted executive null`);
    req.app.get("Io").emit("executive-update", exec, "delete");
    return res.json(`Deleted ${exec.name} successfully`);
  } catch (err) {
    next(err);
  }
};

export const updateExecutive = async (req, res, next) => {
  try {
    console.log("updating executive..");
    const executive = await Executive.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!executive) return next("Executive not found");
    req.app.get("Io").emit("executive-update", executive, "update");
    return res.json(`Updated executive ${executive.name} profile successfully`);
  } catch (err) {
    return next(err);
  }
};
