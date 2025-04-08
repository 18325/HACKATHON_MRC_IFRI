import useAuth from "../hooks/useAuth.ts";
import {Navigate, Outlet, useLocation} from "react-router";


const RequireAuth = () => {

    const {auth} = useAuth();

    const location = useLocation();
    console.log(auth)
    return (
        auth.accessToken!="" ?
            <Outlet /> :
            <Navigate to="/" state={{ from: location }} replace />
    )

}

export default RequireAuth;