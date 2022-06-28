import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import pollRoutes from "./routes/pollRoutes.js";
import massRoutes from "./routes/massRoutes.js";
import errorHandler from "./middleware/errHandler.js";
import { FRONTEND_URL } from "./config.js";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __dirname = path.resolve();

app.use(
  cors({
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/api/poll-unit", pollRoutes);
app.use("/api", massRoutes);

// setting up server with socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
  },
  path: "/socketio-client/saat-vote",
});

io.use((socket, next) => {
  if (
    socket.handshake.auth.token !== process.env.FRONTEND_SOCKETIO_ACCESS_TOKEN
  ) {
    console.log("forbidden socket.io");
    return next("Invalid access token");
  }
  next();
});

io.on("connection", (socket) => {
  // console.log("connected socket ", socket.id);
  app.set("Io", io);
});
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
