const Joi = require('joi').extend(require('@joi/date'));

const taskStatuses = Object.freeze({
  first: 'define',
  second: 'ready',
  third: 'progress',
  four: 'review',
  fifth: 'merged',
  sixth: 'monitoring/QA',
  seventh: 'done',
});

const CardSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-z0-9 ]+$/i)
    .min(3)
    .max(20)
    .required(),
  board: Joi.string()
    .regex(/^[a-z0-9 ]+$/i)
    .min(3)
    .max(20)
    .required(),
  description: Joi.string().min(3).max(30).required(),
  create_at: Joi.date().default(Date.now),
  estimate: Joi.number(),
  status: Joi.string().valid(...Object.values(taskStatuses)),
  dueDate: Joi.date().format('YYYY-MM-DD').utc(),
  labels: Joi.array().items(Joi.string()),
});

module.exports = CardSchema;
