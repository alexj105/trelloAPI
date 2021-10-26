const Joi = require('joi');

const validation = (schema, type) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) throw new Error(error.details[0].message);
      req.board = value;
      if (type === 'board') req.board = value;
      if (type === 'card') req.card = value;
      next();
    } catch (error) {
      res.status(422).send(error.message);
    }
  };
};
module.exports = validation;
