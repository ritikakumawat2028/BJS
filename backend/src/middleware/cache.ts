import apicache from 'apicache';
import { Request, Response } from 'express';

// Setup apicache
const cache = apicache.middleware;

// Custom cache middleware with dynamic duration based on environment
export const apiCache = (duration: string = '5 minutes') => {
  return cache(duration, (req: Request, res: Response) => {
    // Only cache successful GET responses
    // Disable cache for authenticated users to ensure admin always gets fresh data
    if (req.headers.authorization) return false;
    return req.method === 'GET' && res.statusCode === 200;
  });
};

// Expose clear mechanism if we need to purge cache programmatically
export const clearCache = (target?: string) => {
  apicache.clear(target || '');
};

// Clear all API cache when admin mutations happen
export const clearAllCache = () => {
  apicache.clear('');
};
