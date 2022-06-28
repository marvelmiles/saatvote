import { COOKIE_NAME, ROLE, _cookieOptions, SERVICE_MAIL } from "./config.js";
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
} from "crypto";
import nodemailer from "nodemailer";
import Cookie from "./models/Cookie.js";
import { v4 as uniq } from "uuid";
import cron from "node-cron";
export const isObject = (type) => {
  return Object.prototype.toString.call(type) === "[object Object]";
};

export const setCookieStore = async (req, res, cookieName = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      await Cookie.deleteMany({
        primaryKey: req.body.primaryKey,
      });
      let uid = req.body.uid || uniq();
      let cookie = await Cookie.findOne({
        uid,
      });
      if (cookie)
        await Cookie.updateOne(
          {
            uid,
          },
          {
            uid,
            content: req.body.content || "",
            maxAge: req.body.maxAge || new Date(),
            primaryKey: req.body.primaryKey || "",
            domain: req.body.domain || req.headers.origin,
          },
          { new: true }
        );
      else {
        cookie = new Cookie({
          uid,
          content: req.body.content || "",
          maxAge: req.body.maxAge || new Date(),
          primaryKey: req.body.primaryKey || "",
          domain: req.body.domain || req.headers.origin,
        });
        await cookie.save();
      }
      cookieName && res.cookie(cookieName, cookie.uid, _cookieOptions);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const setCookie = async (req, res, options) => {
  options.cookieName = options.cookieName || COOKIE_NAME;
  options.key = options.key || ROLE.VOTER;
  let cookie = await getCookie(req, options.cookieName);
  cookie[options.key] = options.payload;
  req.body.content = cipherIv.encrypt(JSON.stringify(cookie));

  await setCookieStore(req, res, options.cookieName);
};
export const getCookie = async (req, cookieName = COOKIE_NAME) => {
  if (!cookieName) return {};
  let cookie = await Cookie.findOne({
    uid: req.cookies[cookieName],
  });
  if (cookie && cookie.content)
    cookie = JSON.parse(cipherIv.decrypt(cookie.content));
  else cookie = {};
  return cookie;
};

export const getUserBasic = (user) => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar,
  email: user.email,
  chairperson: user.chairperson,
  approvedOn: user.approvedOn,
  category: user.category,
  createdBy: user.createdBy,
});

export const getVoterBasic = (voter) => ({
  id: voter.id,
  matNo: voter.matNo,
  email: voter.email,
});

export const cipherIv = {
  encrypt(
    secret,
    key = process.env.CIPHER_KEY,
    inputEncoding = "utf-8",
    iv = randomBytes(16)
  ) {
    try {
      const cipher = createCipheriv("aes256", key, iv);
      return `${Buffer.concat([
        cipher.update(secret, inputEncoding),
        cipher.final(),
      ]).toString("hex")}.${iv.toString("hex")}`;
    } catch (err) {
      console.log("err cipher encrypting...", err.message);
      return null;
    }
  },
  decrypt(
    cipherStr,
    key = process.env.CIPHER_KEY,
    outputEncoding = "utf-8",
    t
  ) {
    if (typeof cipherStr !== "string") return null;
    cipherStr = cipherStr.split(".");
    try {
      let encrypted = cipherStr[0];
      let iv = cipherStr[1];
      if (!(iv && encrypted)) return null;
      iv = Buffer.from(iv, "hex");
      encrypted = Buffer.from(encrypted, "hex");
      let decipher = createDecipheriv("aes256", key, iv);
      let decrypted = decipher.update(encrypted, "hex");
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      if (t === "k") {
        return null;
        console.log("hhmmmmmm", decrypted.toString(outputEncoding));
      }
      return outputEncoding ? decrypted.toString(outputEncoding) : decrypted;
    } catch (err) {
      console.log(err.message, "err decrypting...", err.message);
      return null;
    }
  },
};

export const sendMail = () => {
  console.log("sending mail...");
  const transporter = nodemailer.createTransport({
    auth: {
      user: "marvellousoluwaseun2@gmail.com",
      pass: "kissMiles0510@",
    },
    service: "GMAIL",
  });
  const mailOptions = {
    from: "marvellousabidemi2@gmail.com",
    to: "marvellousabidemi2@gmail.com",
    text: "That was easy",
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message, "mail err");
      return;
    }
    console.log(info.response, "mail info");
  });
};

// export const sendMail = () => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//   const msg = {
//     to: "marvellousoluwaseun2@gmail.com", // Change to your recipient
//     from: "marvellousabidemi2@gmail.com", // Change to your verified sender
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };

//   sgMail
//     .send(msg)
//     .then((response) => {
//       console.log(response[0].body);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

export const isEmail = (str) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    str
  );

export const isActiveStudent = (str) => {
  let regex = /\w{3}\/(\d{2})\/\d{4}/,
    matchArr;
  if ((matchArr = regex.exec(str))) {
    return parseInt(matchArr[1]) + 7 <= new Date().getFullYear();
  }
  return false;
};

export const scheduleTask = (dueTime = "", dueDate = "", cb) => {
  // sec min hr day of mth mth day of wk
  if (!(dueTime && dueDate && typeof cb === "function")) return;
  console.log(dueTime, dueDate);
  const [hr, min] = dueTime.split(":");
  const [mth, day, yr] = dueDate.split("/");
  const exp = `${min} ${hr} ${day} ${mth} *`;
  console.log(exp, "node-expresssion");
  const task = cron.schedule(exp, () => cb(task));
};

export const createPbk = (
  secret,
  round = 50000,
  salt = process.env.HASH_KEY
) => {
  return pbkdf2Sync(secret, salt, round, 16, "sha512").toString("hex");
};

export const getAll = () => {};
