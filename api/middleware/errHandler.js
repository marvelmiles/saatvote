const _getMSG = (err) => {
  const index = err.message.indexOf(":");
  if (index < 0) return err.message || err.name;
  let msg = err.message.slice(index + 1, err.message.length + 1);
  msg = msg.slice(msg.indexOf(":") + 1, msg.length + 1).trim();
  return msg;
};

export default (err, req, res, next) => {
  switch (true) {
    case typeof err == "string":
      // custom application errors
      switch (true) {
        case /(?:unknown|server).*?error/i.test(err):
          console.log("error message: ", err);
          return res.status(500).json(err);
        case /exists|createdBy/i.test(err):
          return res.status(409).json(err);
        case err.toLowerCase().indexOf("not found") > -1:
          return res.status(404).json(err);
        case err.toLowerCase().indexOf("unauthorized") > -1:
          return res.status(401).json(err);
        case err.toLowerCase().indexOf("forbidden") > -1:
          return res.status(403).json(err);
        default:
          return res.status(400).json(err);
      }
    case err.name === "ValidationError":
      // mongoose validation error
      return res.status(400).json(_getMSG(err));
    case err.name === "CastError":
      // mongoose cast error
      return res.status(400).json(_getMSG(err));
    case err.name === "TokenExpiredError":
      return res.status(401).json("Session timed out.");
    case err.name === "JsonWebTokenError":
      return res.status(401).json("Unauthorized!");
    case err.name === "UnauthorizedError":
      // jwt authentication error
      return res.status(401).json("Unauthorized");
    case err.code === 11000:
      // mongoose duplicate key error
      console.log("error message: ", err.message);
      return res.status(400).json(_getMSG(err));
    default:
      console.log("error message: ", err.message);
      return res.status(err.statusCode || 500).json(err.message);
  }
};
