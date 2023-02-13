const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const appointmentRoutes = require("./routes/appointmentRoutes");
const STATIC_API_KEY = "qwert12345$!";

const app = express();
const config = process.env;
require("dotenv").config();

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err.name,err.message)
  const message = (err.name == "MyError" && err.message) || "Internal Server Error. Please contact customer service.";
  return res.status(statusCode).json({ message });
};

const validateApiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey != STATIC_API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
};

app.use(
  cors({
    // please add whitelisted domain here
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(validateApiKeyMiddleware);

app.use("/api/appointment", appointmentRoutes);
app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // DB Connection Successfull
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
