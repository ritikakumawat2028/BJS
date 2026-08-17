import prisma from '../config/prisma';

/**
 * Retrieves a setting from the database, falling back to process.env if not found or empty.
 */
export const getSetting = async (key: string, envFallbackKey?: string): Promise<string | undefined> => {
  const setting = await prisma.storeSettings.findUnique({
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
