import prisma from '../config/prisma';

interface LogAdminActionParams {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export const logAdminAction = async ({
  adminId,
  action,
  entity,
  entityId,
  previousValue,
  newValue,
  ipAddress,
}: LogAdminActionParams) => {
  try {
    await prisma.adminActivityLog.create({
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
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};
