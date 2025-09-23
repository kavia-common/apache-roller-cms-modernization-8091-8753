'use strict';

function errorHandler(err, req, res, next) {
  console.error('[Error]', err && err.stack ? err.stack : err);

  const status = err.status || 500;
  const payload = {
    error: status >= 500 ? 'Internal Server Error' : 'Bad Request',
    message: err.message || 'Unexpected error',
    code: status,
  };
  res.status(status).json(payload);
}

module.exports = errorHandler;
