const AppError = require("../utilities/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = JSON.stringify(err.keyValue)
    .replace(/[" { }]/g, "")
    .replace(/\:/, " ");

  const message = `Dublicate field value (${value}). please use another value`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => `🔹---${el.message}`);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "Error",
      message: err.message,
    });
  }
  console.error("Error 💥💥", err, "-----Error Stack------", err.stack);

  return res.status(500).json({
    status: "Error",
    message: "Something went wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;
    error.errmsg = err.errmsg;

    if (error.name === "CastError") error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDublicateFieldsDB(error);

    if (
      error.name === "ValidationError" ||
      error.stack.startsWith("ValidationError")
    )
      error = handleValidatorErrorDB(error);

    sendErrorProd(error, res);
  }
};
