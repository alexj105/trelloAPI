const Joi = require('joi');

const BoardSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-z0-9 ]+$/i)
    .min(3)
    .max(20)
    .required(),
  color: Joi.string()
    .regex(/^[a-z0-9 ]+$/i)
    .min(3)
    .max(10),
  description: Joi.string().min(3).max(30),
  create_at: Joi.date().default(Date.now),
});

module.exports = BoardSchema;
