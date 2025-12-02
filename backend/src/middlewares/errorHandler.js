const { logger } = require('../config/logger');
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    status,
    stack: err.stack,
    name: err.name,
  };

  const level = status >= 500 ? 'error' : 'warn';
  logger.log({ level, message: 'request:error', ...logPayload });
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message || 'Error',
    requestId: req.requestId,
  });
}
module.exports = { errorHandler };
