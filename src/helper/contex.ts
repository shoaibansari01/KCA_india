import { createContext } from "react";

export const AuthContext = createContext({
    authdata: null,
    setAuthData: () => { },
});