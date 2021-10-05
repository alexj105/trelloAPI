const errorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    //custom app err
    return res.status(400).json({ message: err });
  }
  if (err.name === 'UnauthorizedError') {
    //jwt auth error
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
