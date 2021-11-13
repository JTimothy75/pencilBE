module.exports = class AppError extends Error {
  constructor(err, statusCode) {
    super(err);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
};
