import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes  from "prop-types";

export const AuthContext = createContext({
    login: () => {},
    logout: () => {}
});

export function AuthContextProvider({children}){
    const [isAuthenticated, setAuthenticated] = useState(sessionStorage.getItem('success'));
    
    const login = useCallback(function () {
        setAuthenticated(true)
    },[])
    
    const logout = useCallback(function () {
        console.log(1)
        setAuthenticated(false)
        sessionStorage.clear()
    },[])
    const value = useMemo(
        ()=>({
            login,
            logout,
            isAuthenticated,
        }),
        [login, logout, isAuthenticated]
    )
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuthContext(){
    return useContext(AuthContext)
};