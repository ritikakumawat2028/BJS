"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetting = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Retrieves a setting from the database, falling back to process.env if not found or empty.
 */
const getSetting = async (key, envFallbackKey) => {
    const setting = await prisma_1.default.storeSettings.findUnique({
        where: { key }
    });
    if (setting && setting.value && setting.value.trim() !== '') {
        return setting.value;
    }
    if (envFallbackKey && process.env[envFallbackKey]) {
        return process.env[envFallbackKey];
    }
    return undefined;
};
exports.getSetting = getSetting;
//# sourceMappingURL=getSetting.js.map