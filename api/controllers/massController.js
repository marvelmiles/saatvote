import { setCookieStore } from "../helpers.js";
import Category from "../models/Category.js";
import Cookie from "../models/Cookie.js";
import Electorate from "../models/Electorate.js";
import Executive from "../models/Executive.js";
import Nominee from "../models/Nominee.js";

export const getEelectorates = async (req, res, next) => {
  try {
    console.log("getting poll electorates");
    const limit = parseInt(req.query.limit || 30);
    let skip = (parseInt(req.query.page || 1) - 1) * limit; // For page 1, the skip is: (1 - 1) * limit => 0 * 20 = 0
    if (!(skip || skip < 0)) skip = 0;
    let select =
      req.query.p.indexOf("-") >= 0 ? 0 : req.query.p.replace(/id/g, "_id");
    if (select === 0) return next("Quey q not allwed");
    const electorates = await Electorate.find({
      pollingunit: req.poll.name,
    })
      .select(select)
      .skip(skip)
      .limit(limit);
    res.json(electorates);
  } catch (err) {
    next(err);
  }
};

export const getExecutives = async (req, res, next) => {
  try {
    console.log("getting excutives...");
    if (req.poll) {
      res.json(
        await Executive.find({
          pollingUnit: req.poll.name,
        })
      );
    } else {
      res.json(await Executive.find({}));
    }
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    console.log("getting categories...");

    if (req.poll) {
      const nominees = await Nominee.find({
        pollingUnit: req.poll.name,
      }).populate("createdBy");
      let categories = await Category.find({
        pollingUnit: req.poll.name,
      }).populate("nominees");
      categories = categories.map((c) => {
        c.nominees = nominees.filter((n) => {
          return n.category === c.name;
        });
        return c;
      });
      console.log("got categories....");
      res.json(categories);
    } else {
      res.json(await Category.find({}));
    }
  } catch (err) {
    next(err);
  }
};

export const storeCookie = async (req, res, next) => {
  try {
    if (process.env.API_KEY !== req.headers.authorization.slice(7))
      return next("Unauthorized access");
    await setCookieStore(req, res);
    res.json(`Cookie stored successfully.`);
  } catch (err) {
    next(err);
  }
};

export const getStoredCookie = async (req, res, next) => {
  try {
    console.log("getting storeed cookie..");
    if (process.env.API_KEY !== req.headers.authorization.slice(7))
      return next("cookie access key bad");
    if (!req.params.uid) return next("Request hmmm uid is faulty.");
    const cookie = await Cookie.findOne({
      uid: req.params.uid,
    });
    if (!cookie) return next("Requesssssssst uid is faulty");
    if (cookie.domain !== req.headers.origin)
      return next("Unauthorized access");
    if (cookie.hasExpired()) {
      await Cookie.deleteOne({
        uid: cookie.uid,
      });
      return next("Sorry can't get cookie. Max age exceeded");
    }
    console.log(cookie.uid, "coo");
    return res.json(cookie);
  } catch (err) {
    next(err);
  }
};
