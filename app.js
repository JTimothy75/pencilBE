const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

const questionRouter = require("./routes/questionRoute");
const topicRouter = require("./routes/topicRoute");
const errorController = require("./controllers/errorController");

const app = express();
app.enable("trust proxy");
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:5500"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: "Content-Range,X-Content-Range",
  })
);

// Global Middlewares
// Set security HTTP headers
app.use(helmet());

// Limit request from same api
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

// Sanitizing data against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price", "ratingsQuantity", "ratingsAverage"],
  })
);

app.use(compression());

// Routers
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/topic", topicRouter);

app.use(errorController);

module.exports = app;
