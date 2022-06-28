import { createFileObj } from "../middleware/fileHandler.js";
import Category from "../models/Category.js";
import Electorate from "../models/Electorate.js";
import { v4 as uniq } from "uuid";
import { getElectorateActionData } from "./electorateController.js";
import Nominee from "../models/Nominee.js";
import { getUserBasic } from "../helpers.js";

export const createNominee = async (req, res, next) => {
  try {
    console.log("creating nomine...");
    let nominee = await Nominee.findOne({
      category: req.params.category,
      pollingUnit: req.body.pollingUnit,
      name: req.body.name,
    });
    if (nominee) return next("Nominee exist");
    nominee = new Nominee({
      avatar: createFileObj(req.file, `${req.user.name} image`),
      name: req.body.name,
      whyMe: req.body.whyMe,
      gratitude: req.body.gratitude,
      createdBy: req.user.id,
      votes: 0,
      category: req.params.category,
      voters: [],
      createdBy: req.user.id,
      pollingUnit: req.body.pollingUnit,
    });
    let category = await Category.findOne({
      name: req.params.category,
    });
    let isNew = false;
    if (!category) {
      category = new Category({
        name: req.params.category,
        pollingUnit: req.body.pollingUnit,
        nominees: [nominee.id],
        createdBy: req.user.id,
      });
      category = await category.save();
      isNew = true;
    } else {
      await Category.updateOne(
        {
          name: req.params.category,
        },
        {
          $push: {
            nominees: nominee.id,
          },
        }
      );
    }
    await nominee.save();
    const elec = await Electorate.findByIdAndUpdate(
      req.user.id,
      {
        categoryCount:
          isNew && req.user.id === String(category.createdBy)
            ? ++req.user.categoryCount
            : req.user.categoryCount,
        nomineeCount: ++req.user.nomineeCount,
      },
      { new: true }
    );
    const io = req.app.get("Io");
    io.emit(
      "electorate-update",
      getElectorateActionData(elec, "activities"),
      "activities"
    );
    io.emit("nominee-update", getUserBasic(nominee), "add");
    return res.json(`Created nominee ${nominee.name} successfully`);
  } catch (err) {
    next(err);
  }
};

export const deleteNominee = async (req, res, next) => {
  try {
    console.log("deleting nomine...", req.params.category, req.params.nid);
    const nominee = await Nominee.findByIdAndDelete(req.params.nid, {
      category: req.params.category,
      _id: req.params.nid,
    });
    req.app.get("Io").emit("nominee-update", nominee, "delete");
    res.json(`Deleted  successfully.`);
  } catch (err) {
    next(err);
  }
};

export const updateNominee = async (req, res, next) => {
  try {
    console.log("updating nomine....");
    const nominee = await Nominee.findOneAndUpdate(
      {
        _id: req.params.nid,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    req.app.get("Io").emit("nominee-update", nominee, "update");
    res.json(`Updated nominee ${nominee.name} successfully`);
  } catch (err) {
    console.log(err.messgae || err.name, "err nominee");
    next(err);
  }
};
