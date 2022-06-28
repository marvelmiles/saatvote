import Award from "../models/Award.js";
import cron from "node-cron";
import { sendMail, setCookieStore } from "../helpers.js";
import Cookie from "../models/Cookie.js";
export const countDown = (award, app) => {
  try {
    console.log("counting down...");
    if (!(award && app)) return;
    let _yr = new Date().getFullYear();
    let [day, mth, yr = _yr] = award.startDate.split("/");
    let [hrs, mins] = award.startTime.split(":");
    let [dday, dmth, dyr = _yr] = award.dueDate.split("/");
    let [dhrs, dmins] = award.dueTime.split(":");

    mins = parseInt(mins);
    hrs = parseInt(hrs);
    day = parseInt(day);
    mth = parseInt(mth);

    dmins = parseInt(dmins);
    dhrs = parseInt(dhrs);
    dday = parseInt(dday);
    dmth = parseInt(dmth);
    if (
      !(
        mins &&
        mins >= 0 &&
        mins <= 59 &&
        hrs &&
        hrs >= 0 &&
        hrs <= 23 &&
        day &&
        day >= 1 &&
        day <= 31 &&
        mth &&
        mth >= 1 &&
        mth <= 12 &&
        yr &&
        yr &&
        yr <= _yr &&
        dmins &&
        dmins >= 0 &&
        dmins <= 59 &&
        dhrs &&
        dhrs >= 0 &&
        dhrs <= 23 &&
        dday &&
        dday >= 1 &&
        dday <= 31 &&
        dmth &&
        dmth >= 1 &&
        dmth <= 12 &&
        dyr &&
        dyr &&
        dyr <= _yr
      )
    ) {
      console.log("failure schema...");
      return;
    }
    let c = `* * * ${day} ${mth} *`;
    console.log("calc schedulrer..", c);

    const task = cron.schedule(c, async () => {
      award = await Award.findOneAndUpdate(
        {
          name: award.name,
        },
        { status: "ongoing" },
        { new: true }
      );

      app.get("socketIo").emit("start-vote", award);
      task.stop();
      sendMail();
      console.log("scheduler running...", _yr);

      c = `* * * * * *`;
      let _task = cron.schedule(c, async () => {
        await Award.updateOne(
          {
            name: award.name,
          },
          { status: "concluded" },
          { new: true }
        );
        app.get("socketIo").emit("award-status-update", award);
        console.log("stop schedule");
        _task.stop();
      });
    });
  } catch (err) {
    console.log(
      err.name,
      err.message,
      err.code,
      "err emitted from countDown..."
    );
  }
};

export const createAward = async (req, res, next) => {
  try {
    if (req.body.U !== process.env.U || req.body.P !== process.env.P)
      return next("Forbidden permission");
    const award = new Award(req.body);
    await award.save();
    res.json(`Created ${award.name} successfully`);
  } catch (err) {
    next(err);
  }
};

export const startVote = async (req, res, next) => {
  try {
    console.log(req.body, req.params.name);
    if (!req.body.dueDate) return next("Due date is required");

    let award = await Award.findOne({
      name: req.params.name,
    });

    if (!award) return next("Award not found");
    // if (award.status === "ongoing") return next("Voting is ongoing");
    await Award.updateOne(
      {
        name: req.params.name,
      },
      {
        startTime: req.body.startTime,
        startDate: req.body.startDate,
        dueTime: req.body.dueTime,
        dueDate: req.body.dueDate,
        status: "ongoing",
      },
      { new: true }
    );
    const io = req.app.get("Io");
    io.emit("start-vote-countDown", award);
    return res.json("Voting has started");
  } catch (err) {
    next(err);
  }
};

export const getAward = async (req, res, next) => {
  try {
    console.log(req.query.select, "getting award");
    let award = await Award.findOne({
      name: req.params.name,
    });
    if (!award) return next("Award not found");
    return res.json(award);
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
      return next("Unauthorized access");
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
