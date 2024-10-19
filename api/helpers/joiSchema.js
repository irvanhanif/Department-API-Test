const Joi = require("joi");

module.exports = {
  userSchema: Joi.object({
    id: Joi.string().uuid().optional(),
    email: Joi.string().email().required(),
    username: Joi.string().min(4).max(50).required(),
    password: Joi.string().required(),
    born: Joi.string().min(5).max(15).optional(),
    id_role: Joi.number().optional(),
    id_department: Joi.number().optional(),
  }),
  loginSchema: Joi.object({
    emailOrUsername: Joi.string().min(4).max(50).required(),
    password: Joi.string().required(),
  }),
  roleSchema: Joi.object({
    id: Joi.number().optional(),
    role: Joi.string().min(4).max(50).required(),
    description: Joi.string().optional(),
    permission: Joi.string().required(),
    id_user: Joi.string().uuid().required(),
  }),
  departmentSchema: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(5).max(50).required(),
    code: Joi.string().min(3).max(10).required(),
    location: Joi.string().required(),
    description: Joi.string().optional(),
    contact: Joi.string().optional(),
  }),
};
