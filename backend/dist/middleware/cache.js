"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.apiCache = void 0;
const apicache_1 = __importDefault(require("apicache"));
// Setup apicache
const cache = apicache_1.default.middleware;
// Custom cache middleware with dynamic duration based on environment
const apiCache = (duration = '5 minutes') => {
    return cache(duration, (req, res) => {
        // Only cache successful GET responses
        // Disable cache for authenticated users to ensure admin always gets fresh data
        if (req.headers.authorization)
            return false;
        return req.method === 'GET' && res.statusCode === 200;
    });
};
exports.apiCache = apiCache;
// Expose clear mechanism if we need to purge cache programmatically
const clearCache = (target) => {
    apicache_1.default.clear(target || '');
};
exports.clearCache = clearCache;
//# sourceMappingURL=cache.js.map