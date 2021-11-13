const dotenv = require("dotenv");
const mongoose = require("mongoose");
const chalk = require("chalk");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const dbURL = process.env.DATABASE;
const port = process.env.PORT || 4100;
console.log(dbURL);
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`DB connection ${chalk.green("Successful")}`));

const server = app.listen(port, () => {
  console.log(`Listening on port ${chalk.green(port)}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message, err, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Received. Shutting down gracefully");
  server.close(() => {
    console.log("Process Terminated");
  });
});
