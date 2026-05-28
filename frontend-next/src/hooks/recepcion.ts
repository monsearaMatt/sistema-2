import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';



export function useCrearRecepcion() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (recepcionData: Record<string, unknown>) => {
            const respuesta = await api.post('recepcion', recepcionData);
            return respuesta.data;
        },
        onSuccess: (_data) => {
            clienteQuery.invalidateQueries({ queryKey: ['amigos'] });
            clienteQuery.invalidateQueries({ queryKey: ['chats'] });
        },
    });
}