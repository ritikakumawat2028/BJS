import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const campaignController: {
    getActive: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: AuthRequest, res: Response) => Promise<void>;
    update: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    delete: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=campaign.controller.d.ts.map