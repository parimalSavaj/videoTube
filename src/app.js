import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//todo: first configuration app than other package used in side middleware.
const app = express();

//todo: for cors origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // set up origin urls
    credentials: true,
  })
);

//todo: get json data with limit.
app.use(
  express.json({
    limit: "50kb",
  })
);

//todo: for url data with limit.
app.use(
  express.urlencoded({
    extended: true, // for used nested object from url
    limit: "50kb",
  })
);

//todo for static files.
app.use(express.static("public"));

//todo: for set and get cookie data from user.
app.use(cookieParser());

//todo: router import
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js"

//todo: routers declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/playlist", playlistRoutes);

export default app;
