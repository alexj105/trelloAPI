const express = require('express');

const router = new express.Router();
const userService = require('../users/user.service');
const logger = require('../../config/winston');

router.get('/login', async (req, res, next) => {
  try {
    const user = await userService.authenticate(req.body);
    if (!user) {
      res.status(400).json({ message: 'Username or password is incorrect' });
    }
    logger.error(`${user.username} logged in`);
    res.json(user);
    next();
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
});
module.exports = router;
