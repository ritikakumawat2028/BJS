interface LogAdminActionParams {
    adminId: string;
    action: string;
    entity: string;
    entityId?: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
}
export declare const logAdminAction: ({ adminId, action, entity, entityId, previousValue, newValue, ipAddress, }: LogAdminActionParams) => Promise<void>;
export {};
//# sourceMappingURL=audit.d.ts.map