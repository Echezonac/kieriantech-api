import { Response } from 'express';

import { SuccessData } from '../utils/interfaces';

export const successResponse = (
  res: Response,
  statusCode: number,
  data: SuccessData
) => {
  const { message, ...rest } = data;
  res.status(statusCode).json({
    status: "success",
    message,
    ...rest,
  });
};