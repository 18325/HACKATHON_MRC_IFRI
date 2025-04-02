import {useContext} from "react";
import AuthContext, {AuthContextType} from "../context/AuthContext.tsx";


const useAuth = ():AuthContextType => {
    return <AuthContextType>useContext(AuthContext);
}
export default useAuth;


