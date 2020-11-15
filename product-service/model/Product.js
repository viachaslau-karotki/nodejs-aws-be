"use strict";

const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    count: Joi.number().integer().positive().required(),
    price: Joi.number().precision(2).positive().required()
});

module.exports = schema;