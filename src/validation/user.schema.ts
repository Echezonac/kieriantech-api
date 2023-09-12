import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ValidationError } from "../customErrors";

export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    pin: Joi.string().length(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  next();
};
