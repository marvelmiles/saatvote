import jwt from "jsonwebtoken";
import { COOKIE_NAME, ROLE } from "../config.js";
import { getCookie } from "../helpers.js";
import RefreshToken from "../models/RefreshToken.js";
import Voter from "../models/Voter.js";

export default (Collection = Voter, cookieKey = ROLE.VOTER) => {
  return [
    (req, res, next) => {
      let token = req.headers.authorization;
      if (!token) return next("Unauthorized permission");
      token = token.slice(7, token.length);
      if (!token) return next("Unauthorized permission");
      try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
          console.log("verifying.. auth jwt", err?.name);
          if (err) return next(err);
          req.user = await Collection.findOne({
            _id: decode.id,
          });
          if (!req.user?.id) {
            return next("Unauthorized access");
          }
          next();
        });
      } catch (err) {
        return next(err);
      }
    },
    async (req, res, next) => {
      try {
        const refreshTokens = await RefreshToken.find({ user: req.user.id });
        const { token } = (await getCookie(req, COOKIE_NAME))[cookieKey] || {};
        console.log(
          token?.length,
          req.user.id,
          "before own token.cookie token found"
        );
        if (token && !refreshTokens.find((x) => x.token === token)) {
          console.log("Refresh token not found", token);
          return next("Refresh token not found");
        }
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
};
