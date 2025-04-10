import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotAuthorize() {
    return (
        <>
            <PageMeta
                title="RenalCare"
                description="Compte désactivé"
            />
            <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
                <GridShape />
                <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[1000px]">
                    <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
                        Compte Désactivé
                    </h1>
                    <div className="flex flex-col items-center justify-center p-6 overflow-hidden z-1">
                        <img width="100" height="100" src="https://img.icons8.com/color/48/do-not-disturb.png"
                             alt="do-not-disturb"/>
                    </div>
                    {/*<img src="/images/error/404.svg" alt="404" className="dark:hidden" />*/}
                    {/*<img*/}
                    {/*    src="/images/error/404-dark.svg"*/}
                    {/*    alt="404"*/}
                    {/*    className="hidden dark:block"*/}
                    {/*/>*/}

                    <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                        Votre compte a été désactivé par l'administrateur !.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Retourner sur la page de connexion
                    </Link>
                </div>
                {/* <!-- Footer --> */}
                <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} - RenalTrack
                </p>
            </div>
        </>
    );
}
