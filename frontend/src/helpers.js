import { _cookieOptions } from "./config";
import Cookies from "universal-cookie";
import { v4 as uniq } from "uuid";
import crypto, { pbkdf2Sync, randomBytes } from "crypto";
import { getStoredCookie, storeCookie } from "./api/mass";
export const isBool = (type) => {
  return /true|false/.test(type);
};
export const isEmail = (str) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    str
  );
};
export const isFullName = (str) => {
  return /.+?\s+?.+?/.test(str);
};

export const isObject = (type) => {
  return Object.prototype.toString.call(type) === "[object Object]";
};

// by-draft-team
// const detectURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const isHashTag = (string) => {
  return /(?:\s|^)(#[\w]+\b)/gi.test(string);
};

export const detectURL = new RegExp( // code by @dperini
  "^" +
    // protocol identifier (optional)
    // short syntax // still required
    "(?:(?:(?:https?|ftp):)?\\/\\/)" +
    // user:pass BasicAuth (optional)
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    "(?:" +
    "(?:" +
    "[a-z0-9\\u00a1-\\uffff]" +
    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
    ")?" +
    "[a-z0-9\\u00a1-\\uffff]\\." +
    ")+" +
    // TLD identifier name, may end with dot
    "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
    ")" +
    // port number (optional)
    "(?::\\d{2,5})?" +
    // resource path (optional)
    "(?:[/?#]\\S*)?" +
    "$",
  "gim"
);

export const isUrl = (string) => {
  detectURL.test(string);
};
export const encodeURIComponent = (str) => {
  try {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16);
      }) // replacing reserved word based on RFC 3986
      .replace(/%20/g, "+"); // for application/x-www-form-urlencoded
  } catch (_) {
    return "";
  }
};
export const escapeRegExp = (str) => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
export const isNegativeInt = (str) => {
  return /^-[\d.]+$/.test(str);
};
export const isEven = (num) => {
  if (!/^\d$/.test(num)) return false;
  return num % 2 === 0;
};
export const validateError = (context, key, errorObj) => {
  const _setLabel = () => {
    switch (key) {
      case "name":
        return "Fullname";
      case "gratitude":
        return "Gratitude";
      case "whyMe":
        return "Why me";
      default:
        return "Category";
    }
  };
  if (key.indexOf("avatar") > -1) {
    if (!errorObj) errorObj = {};
    if (!Array.from(context[key])[0].name) errorObj[key] = context[key];
  } else if (context[key].error || context[key].error === null) {
    if (!errorObj) errorObj = {};
    errorObj[key] = {
      ...context[key],
      highlightError: true,
      label: _setLabel(),
    };
    if (context[key].error === null) errorObj[key].error = true;
  }
  return errorObj;
};
export const isHexDecimal = (str) => {
  return /^#?[0-9a-fA-F]{3,}$/.test(str);
};

export const isPwd = (str, encode = "utf", strong = true) => {
  if (encode === "hex") return this.isHexDecimal(str);
  return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
    str
  );
};

export const setCookie = (
  value,
  cookieName = "fe_ucd",
  cookieOptions = _cookieOptions
) => {
  const cookies = new Cookies();
  cookies.set(cookieName, value, cookieOptions);
};
export const getCookie = (
  cookieName = "fe_ucd",
  cookieOptions = _cookieOptions
) => {
  const cookies = new Cookies();
  return cookies.get(cookieName, cookieOptions) || "";
};
export const getCookieStore = async (cookieKey = "be_ucd") => {
  let cookie = await getStoredCookie(cookieKey);
  return cookie ? JSON.parse(cipherIv.decrypt(cookie.content, "utf8")) : {};
};

export const setCookieStore = async (
  data = {},
  key = "",
  cookieName = "fe_ucd",
  cookieKey = "be_ucd"
) => {
  key = key || getCookie();
  let cookie = await getCookieStore(cookieKey);
  key = cookie[key]?.role === data.role ? key : uniq();
  cookie[key] = {
    ...cookie[key],
    ...data,
  };
  const enc = cipherIv.encrypt(JSON.stringify(cookie));
  await storeCookie(enc, cookieKey);
  setCookie(key, cookieName);
};

export const cipherIv = {
  encrypt(
    secret,
    key = process.env.REACT_APP_CIPHER_KEY,
    inputEncoding = "",
    iv = randomBytes(16)
  ) {
    try {
      const cipher = crypto.createCipheriv("aes256", key, iv);
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
    outputEncoding = "",
    key = process.env.REACT_APP_CIPHER_KEY,
    t
  ) {
    if (typeof cipherStr !== "string") return null;
    cipherStr = cipherStr.split(".");
    try {
      let iv = Buffer.from(cipherStr[1], "hex");
      let encrypted = Buffer.from(cipherStr[0], "hex");
      if (!(iv || encrypted)) return null;
      let decipher = crypto.createDecipheriv("aes256", key, iv);
      let decrypted = decipher.update(encrypted, "hex");
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      if (t === "k") {
        return null;
      }
      return outputEncoding ? decrypted.toString(outputEncoding) : decrypted;
    } catch (err) {
      console.log(err.message, "err decrypting...");
      return null;
    }
  },
};

export const getDate = () => {
  return new Date();
};

export const rsaEncryption = {
  encrypt(key, secret) {
    return crypto.publicEncrypt(key, secret);
  },
  decrypt(key, encrypted) {
    return crypto.privateDecrypt(key, encrypted).toString("utf-8");
  },
};

export const dhEncryption = {
  encrypt() {},
  decrypt() {},
  generateECDH() {
    const ecdh = createECDH("secp521r1");
    return {
      privateKey: ecdh.getPrivateKey("hex"),
      publicKey: ecdh.generateKeys("hex"),
    };
  },
};

export const createHmac = (
  secret,
  salt = process.env.REACT_APP_CIPHER_KEY,
  algorithm = "sha256"
) => {
  if (!secret) return secret;
  return crypto.createHmac(algorithm, salt).update(secret).digest("hex");
};

export const createPbk = (
  secret,
  round = 10,
  salt = process.env.REACT_APP_HASH_KEY
) => {
  // return createHmac(secret, salt);
  // console.log(crypto.pseudoRandomBytes(16), "270000");
  return pbkdf2Sync(secret, salt, round, 16, "sha512").toString("hex");
};

export const createECDH = (privateKey, encoding = "") => {
  const ecdh = crypto.createECDH("secp521r1");
  ecdh.generateKeys();
  if (privateKey) ecdh.setPrivateKey(privateKey, encoding);
  return ecdh;
};

export const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const debounce_leading = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    if (!timer) fn.apply(this, args);
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, delay);
  };
};

export const range = (start, end) => {
  const _range = [];
  if (!end) {
    end = start - 1;
    start = 0;
  }
  for (let i = start; i <= end; i++) {
    _range.push(i);
  }
  return _range;
};

export class Stopwatch {
  constructor(
    timer,
    timeout = null,
    onTimeout,
    timeoutValidator,
    HMSDisplay = 2,
    sep = ":"
  ) {
    this.timer = timer;
    this.HMSDisplay = HMSDisplay;
    this.sep = sep;
    this.timeout = timeout;
    this.onTimeout = onTimeout;
    this.interval = null;
    this.time = 0;
    this.startTime = this.startTime.bind(this);
    this.getTime = this.getTime.bind(this);
    this.timeoutValidator =
      timeoutValidator ||
      ((time) =>
        parseInt(time.minutes) > this.timeout && time.seconds === "01");
  }
  static toHHMMSS(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 3600) / 60);
    let seconds = time - hours * 3600 - minutes * 60;
    return {
      hours: Stopwatch.format(hours),
      minutes: Stopwatch.format(minutes),
      seconds: Stopwatch.format(seconds),
      stringify(displayCount, sep = ":") {
        switch (displayCount) {
          case 1:
            return this.seconds;
          case 2:
            return this.minutes + sep + this.seconds;
          default:
            return this.hours + sep + this.minutes + sep + this.seconds;
        }
      },
    };
  }
  static format(type) {
    return `${type}`.padStart(2, "0");
  }
  static time;
  getTime() {
    console.log(this.time, Stopwatch.toHHMMSS(this.time));
    return this.time;
  }
  startTime() {
    this.time = this.time + 1;
    const _time = Stopwatch.toHHMMSS(this.time);
    if (
      this.timeout &&
      this.timeoutValidator(_time) &&
      typeof this.onTimeout === "function"
    ) {
      this.reset(false);
      this.onTimeout.apply(this, _time);
    } else this.timer.textContent = _time.stringify(this.HMSDisplay, this.sep);
  }

  start() {
    this.interval = setInterval(this.startTime, 1000);
  }
  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  resume() {
    if (!this.interval) {
      this.interval = setInterval(this.startTime, 1000);
    }
  }
  pauseResume() {
    if (this.interval) this.pause();
    else this.resume();
  }
  reset(withTimer = true) {
    clearInterval(this.interval);
    this.interval = null;
    this.time = 0;
    if (withTimer) this.timer.textContent = Stopwatch.toHHMMSS(this.time);
  }
}

export const addTextAt = (string = "", text = "", index = string.length) => {
  return [string.slice(0, index), text, string.slice(index)].join("");
};
