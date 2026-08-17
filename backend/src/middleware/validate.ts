import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { createError } from './error';

export const validate = (schema: z.AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      } else {
        next(createError('Validation error', 400));
      }
    }
  };
};
