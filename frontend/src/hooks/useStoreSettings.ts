import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { StoreSettings } from '../types';

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const response = await adminApi.getSettings();
      return (response.data?.data || {}) as StoreSettings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
