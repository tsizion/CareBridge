const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./Config/DB");
const globalErrorHandler = require("./ErrorHandlers/errorController");
const AppError = require("./ErrorHandlers/appError");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(bodyParser.json());

connectDB();

app.use("/api/v1/donor", require("./donors/routers/donorRoutes"));
app.use("/api/v1/user", require("./campaign creators,/routers/userRouter"));
app.use("/api/v1/category", require("./Campaign/routers/categoryRouters"));
app.use(
  "/api/v1/student",
  require("./campaign creators,/routers/studentRouter")
);
app.use(
  "/api/v1/studentNeed",
  require("./campaign creators,/models/studentNeed")
);

app.use("/api/v1/campaign", require("./Campaign/routers/CampaignRouters"));
app.use("/api/v1/donation", require("./donation/routers/doantionRouters"));
app.use("/api/v1/admin", require("./admin/routers/adminRouter"));
app.use("/api/v1/login", require("./Login/Router/Login"));
app.use("/api/v1/order", require("./donation/routers/order"));

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling for unmatched routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling for unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.name, err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});
