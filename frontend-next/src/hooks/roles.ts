import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await api.get('/rrhh/roles');
      return data;
    },
  });
}
