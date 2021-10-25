const logger = require("../../config/winston");
const AuthService = require("../services/authService");

exports.login = async (req, res, next) => {
  try {
    const user = await AuthService.authenticate(req.body);
    if (!user) {
      res.status(400).json({ message: "Username or password is incorrect" });
    }
    logger.error(`${user.username} logged in`);
    res.json(user);
    next();
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};
