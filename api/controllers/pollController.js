import Poll from "../models/Poll.js";
import cron from "node-cron";
import { scheduleTask } from "../helpers.js";
import Nominee from "../models/Nominee.js";
import Category from "../models/Category.js";
import Electorate from "../models/Electorate.js";
import Voter from "../models/Voter.js";
import Executive from "../models/Executive.js";
import { ROLE } from "../config.js";

export const setPollTimeline = async (req, res, next) => {
  try {
    console.log("setting poll timeline", req.poll.name);
    let poll = await Poll.findOneAndUpdate(
      {
        _id: req.poll.id,
      },
      {
        ...req.body,
        status: "ongoing",
      },
      { new: true }
    );
    const io = req.app.get("Io");
    io.emit("disconnect-user", ROLE.ELECTORATE);
    io.emit("poll-update", {
      status: poll.status,
      lastPoll: poll.lastPoll,
      lastRecord: poll.records[poll.lastPoll] || {},
    });
    res.json(`Poll unit ${poll.name} timeline set successfully`);
    return scheduleTask(poll.dueTime, poll.dueDate, async (task) => {
      console.log("deadline reached....");
      let poll = await Poll.findOneAndUpdate(
        {
          name: req.poll.name,
        },
        {
          status: "concluded",
        },
        { new: true }
      );
      req.app.get("Io").emit("poll-update", {
        status: poll.status,
        lastRecord: {},
        lastPoll: "",
      });
      const date = new Date();
      let categories = await Category.find({
        pollingUnit: poll.name,
      }).populate("nominees");
      const electorates = await Electorate.find({
        pollingUnit: poll.name,
      });
      const voters = await Voter.find({
        pollingUnit: poll.name,
      });
      const executives = await Executive.find({
        pollingUnit: poll.name,
      });
      const winners = [];
      let stat = {
        aggNominees: 0,
        aggElectorates: electorates.length,
        aggExecutives: executives.length,
        aggVoters: voters.length,
        aggVotes: 0,
      };
      categories = JSON.parse(JSON.stringify(categories)).map((c) => {
        c.nominees = c.nominees.sort(function (a, b) {
          if (b.voters.length > a.voters.length) return 1;
          else if (b.voters.length < a.voters.length) return -1;
          else return 0;
        });
        stat.aggVotes = c.votes + stat.aggVotes;
        stat.aggNominees = c.nominees.length + stat.aggNominees;
        c.nominees[0].voters.length && winners.push(c.nominees[0]);
        return c;
      });

      poll = await Poll.findOneAndUpdate(
        {
          name: poll.name,
        },
        {
          status: "concluded",
          records: {
            ...poll.records,
            [date]: {
              categories,
              winners,
              electorates,
              executives,
              stat,
            },
          },
          lastPoll: date,
        },
        { new: true }
      );
      req.app.get("Io").emit("poll-update", {
        status: poll.status,
        lastPoll: poll.lastPoll,
        lastRecord: poll.records[poll.lastPoll] || {},
      });

      console.log("updated. current poll result", poll.lastPoll);
      await Electorate.deleteMany({
        pollingUnit: poll.name,
      });
      await Voter.deleteMany({
        pollingUnit: poll.name,
      });
      await Executive.deleteMany({
        pollingUnit: poll.name,
      });
      await Category.deleteMany({
        pollingUnit: poll.name,
      });
      await Nominee.deleteMany({
        pollingUnit: poll.name,
      });

      task.stop();
      console.log("done with cleaning taks...");
    });
  } catch (err) {
    next(err);
  }
};

export const _getPollUnit = async (req, res, next) => {
  try {
    if (!req.params.unit) return next("Unit not found");
    let select = req.query.p;
    if (select) {
      select =
        req.query.p.indexOf("-") >= 0
          ? 0
          : req.query.p.replace(/lastRecord/g, "records lastPoll");
      if (select === 0) return next("Quey q not allwed");
      select =
        select.indexOf("id") === -1
          ? "-_id " + select
          : select.replace(/id/g, "_id");
    }
    const poll = await Poll.findOne({
      name: req.params.unit,
    }).select(select);
    if (!poll) return next("Poll not found");
    req.poll = poll;
    next();
  } catch (err) {
    next(err);
  }
};

export const getPollUnit = async (req, res, next) => {
  try {
    let poll = req.poll;
    console.log("processing get poll", poll.lastPoll);
    if (
      req.query.p &&
      req.query.p.indexOf("lastRecord") > -1 &&
      poll.lastPoll
    ) {
      poll.lastRecord = poll.records[poll.lastPoll] || {};
      if (req.query.p.indexOf("records") === -1) poll.records = undefined;
      if (req.query.p.indexOf("lastPoll") === -1) poll.lastPoll = undefined;
    }
    if (req.query.p && req.query.p.split(" ").length === 1)
      poll = poll[req.query.p];
    res.json(poll);
  } catch (err) {
    next(err);
  }
};

export const poll = async (req, res, next) => {
  try {
    // sec min hr day of mth mth day of wk
    cron.schedule("16 09 17 06 friday", () => {
      console.log("runnin node...");
    });
    res.json("body work");
  } catch (err) {
    next(err);
  }
};
