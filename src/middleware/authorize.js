const jwt = require('express-jwt');
const { secret } = require('../../config/secure.json');
const authorize = (roles = []) => {
  const parsedRoles = [];
  if (typeof roles === 'string') {
    parsedRoles.push(roles);
  }
  return [
    jwt({ secret, algorithms: ['HS256'] }),
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
      return null;
    },
  ];
};

module.exports = authorize;
