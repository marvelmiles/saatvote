export const COOKIE_NAME = {
  ELECTORATE: "fe_ucd_e",
  VOTER: "fe_ucd_v",
};

export const POLLING_UNIT = "saat-vote";

export const FRONTEND_URL = "http://localhost:3000";

export const BACKEND_URL = "http://localhost:8080";

export const UNIT_PATH = "/poll-unit/saat-vote";

export const ROLE = {
  VOTER: "VOTER",
  ELECTORATE: "ELECTORATE",
  USER: "USER",
};
export const socketIoOptions = {
  // path: "/socketio-client/saat-vote",
  // auth: {
  //   token: process.env.REACT_APP_SOCKETIO_ACCESS_TOKEN,
  // },
};

export const _cookieOptions = {
  path: "/",
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  domain: "localhost",
  secure: false,
  sameSite: "lax",
};
