import {useEffect, useState} from "react";
import useRefreshToken from "../hooks/useRefreshToken.ts";
import useAuth from "../hooks/useAuth.ts";
import {Outlet} from "react-router";
// import {RotatingLines} from "react-loader-spinner";


function PersistLogin () {

    const refresh = useRefreshToken();
    const {auth} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        if (auth.accessToken=="") {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }
        // auth.accessToken == "" ? verifyRefreshToken() : setIsLoading(false);
    }, [auth.accessToken, refresh]);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [auth?.accessToken, isLoading])

    return (
        <>
            {
                isLoading? <div className="w-screen h-screen text-gray-800 dark:text-white/90 flex justify-center items-center">
                        Chargement ...
                    </div>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;