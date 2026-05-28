'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

interface TipoAutenticacion {
    token: string | null;
    setToken: (token: string | null) => void;
    tipoUser: string | null;
    setUsertipo: (tipoUser: string | null) => void;
    loading: boolean;
}

const contextoAutenticacion = createContext<TipoAutenticacion | undefined>(undefined);

const TOKEN_COOKIE_KEY = 'token';
const TIPO_USUARIO_KEY = 'tipoUser';

export const ProveedorAuth = ({children}: {children: React.ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(null);
    const [tipoUser, setUsertipoState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const tokenGuardado = Cookies.get(TOKEN_COOKIE_KEY);
        const tipoUserGuardado = Cookies.get(TIPO_USUARIO_KEY);

        if (tokenGuardado)
        {
            setTokenState(tokenGuardado);
        }

        if (tipoUserGuardado) 
        {
            setUsertipoState(tipoUserGuardado);
        }
        setLoading(false);
    },[]);


    const setToken = useCallback((nuevoToken: string | null) => {
        setTokenState(nuevoToken);
        if (nuevoToken)
        {

            Cookies.set(TOKEN_COOKIE_KEY, nuevoToken, {expires: 7});
        } else
        {
            Cookies.remove(TOKEN_COOKIE_KEY);
        }
    }, []);

    const setUsertipo = useCallback((nuevoTipoUser: string | null) => {
        setUsertipoState(nuevoTipoUser);
        if (nuevoTipoUser)
        {
            Cookies.set(TIPO_USUARIO_KEY, nuevoTipoUser, {expires: 7});
        } else {
            Cookies.remove(TIPO_USUARIO_KEY);
            setUsertipoState(null);
            Cookies.remove(TIPO_USUARIO_KEY);
        }
    }, []);

    const valorContexto = useMemo(() => ({
        token, setToken, tipoUser, setUsertipo, loading
    }), [token, tipoUser, loading, setToken, setUsertipo])

    return(
        <contextoAutenticacion.Provider value={valorContexto}>
            {children}
        </contextoAutenticacion.Provider>

    );
};

export const useAuth = (): TipoAutenticacion => {
    const contexto = useContext(contextoAutenticacion);
    if (!contexto)
    {
        throw new Error('El hook de useAuth debe ir dentro de un ProveedorAuth');
    }
    return contexto;
}