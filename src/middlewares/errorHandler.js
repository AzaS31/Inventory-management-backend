export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.response && err.response.data) {
    return res.status(err.response.status || 500).json({
      status: 'error',
      message: 'External API error',
      details: err.response.data,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}