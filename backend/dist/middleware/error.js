"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.createError = exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.isOperational ? err.message : 'An unexpected error occurred. Please try again.';
    const isProduction = process.env.NODE_ENV === 'production';
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        if (err.code === 'P2002') {
            message = 'A record with this information already exists.';
        }
        else if (err.code === 'P2025') {
            message = 'The requested record was not found.';
        }
        else {
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
exports.errorHandler = errorHandler;
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.js.map