import { Response } from 'express';
export declare const createOrder: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const createRazorpayOrder: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyPayment: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const razorpayWebhook: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserOrders: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const getOrderById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const adminGetOrders: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const adminGetOrderById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const adminUpdateOrderStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=order.controller.d.ts.map