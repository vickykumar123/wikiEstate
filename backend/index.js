import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import listingRouter from "./routes/listingRouter.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const __dirname = path.resolve();

dotenv.config({ path: "./.config.env" });

const app = express();
app.use(express.json({ limit: "30kb" }));
app.use(cookieParser());

//MongoDB connection
const DB = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // for connecting to remote database
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully "))
  .catch((err) => {
    console.log(`ERROR!!! ${err}`);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is connected to port ${PORT}`);
});

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/listing", listingRouter);

//For render to deploy
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//Error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  if (err.message.startsWith("E110")) {
    message = "Name already exist";
  }
  return res.status(statusCode).json({
    status: "failed",
    message,
  });
});
