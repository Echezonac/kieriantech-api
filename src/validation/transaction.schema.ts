import Joi from "joi";
import { ValidationError } from "../customErrors";
import { NextFunction, Request, Response } from "express";

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    toAgentId: Joi.string().required(),
    pin: Joi.string().length(4).pattern(/^\d+$/).required(),
    // otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  next();
};
