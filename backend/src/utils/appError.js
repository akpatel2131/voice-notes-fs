
function AppError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  return error;
}

module.exports = AppError;
