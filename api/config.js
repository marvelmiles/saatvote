import dotenv from "dotenv";
dotenv.config();
export const _cookieOptions = {
  httpOnly: true, // cookie are accessed only by server when set and not document.cookie
  secure: false, // must be sent over an encrypted request scheme
  path: "/", // url that must exist in the requested url in order to send the cookie
  sameSite: "Lax", // cookies are sent to the site where it originated + when the user navigate to the cookie origin site
  domain: "localhost", // determine which host recieve cookie including subdomains when specified
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

export const ROLE = {
  ELECTORATE: "ELECTORATE",
  VOTER: "VOTER",
  SERVICE: "SERVICE",
};

export const COOKIE_NAME = "be_ucd";

export const USER_SERVICE = {
  EMAIL: "aaresaward@support.com",
  PASSWORD: process.env.USER_SERVICE_PASSWORD,
  NAME: "Customer service",
  AVATAR: {
    alt: "Customer service",
    src: "http://localhost:8080/uploads/user.png",
    mimetype: "image/png",
  },
};

export const socketIoOptions = {
  path: "/socketio-client/saat-vote",
  auth: {
    token: process.env.FRONTEND_SOCKETIO_ACCESS_TOKEN,
  },
};

export const FRONTEND_URL = "http://localhost:3000";
export const BACKEND_URL = "http://localhost:8080";
export const SERVICE_MAIL = "marvellousabidemi2@gmail.com";
