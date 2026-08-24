import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: AppError | any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'An unexpected error occurred. Please try again.';
  const isProduction = process.env.NODE_ENV === 'production';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === 'P2002') {
      message = 'A record with this information already exists.';
    } else if (err.code === 'P2025') {
      message = 'The requested record was not found.';
    } else {
      message = 'A database error occurred while processing your request.';
    }
  }

  console.error(`[ERROR] ${err.message}`, { stack: err.stack, path: req.path });

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
