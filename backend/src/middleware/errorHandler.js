function errorHandler(err, req, res, next) {
  console.log('error:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'something went wrong'
  })
}

module.exports = errorHandler
