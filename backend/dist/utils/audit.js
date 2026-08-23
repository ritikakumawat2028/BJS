"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAdminAction = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const logAdminAction = async ({ adminId, action, entity, entityId, previousValue, newValue, ipAddress, }) => {
    try {
        await prisma_1.default.adminActivityLog.create({
            data: {
                adminId,
                action,
                entity,
                entityId,
                previousValue: previousValue ? JSON.stringify(previousValue) : null,
                newValue: newValue ? JSON.stringify(newValue) : null,
                ipAddress,
            },
        });
    }
    catch (error) {
        console.error('Failed to log admin action:', error);
    }
};
exports.logAdminAction = logAdminAction;
//# sourceMappingURL=audit.js.map