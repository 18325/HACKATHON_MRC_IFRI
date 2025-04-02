import {createContext, useState} from "react";

export interface AuthState {
    username: string;
    accessToken: string;
    role: ""|"admin"|"user";
}

export interface AuthContextType {
    auth: AuthState;
    setAuth: (auth: AuthState) => void;
}

const AuthContext = createContext<AuthContextType>({
    auth: {
        username: "",
        accessToken: "",
        role: ""
    },
    setAuth: () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {

    const [auth, setAuth] = useState<AuthState>({username: "", accessToken: "", role: ""});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
