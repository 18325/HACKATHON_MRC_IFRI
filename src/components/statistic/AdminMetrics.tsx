import { BoxIconLine, GroupIcon } from "../../icons";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.ts";

export default function AdminMetrics() {
    const axiosPrivate = useAxiosPrivate();

    // Utiliser useQuery pour récupérer les statistiques
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["stat"], // Clé de cache pour cette requête
        queryFn: async () => {
            const response = await axiosPrivate.get("/stat");
            return response.data;
        },
    });

    // Extraire les données du tableau renvoyé par l'API
    const [numberOfDoctors, numberOfPatients] = data?.body || [0, 0];

    // Gérer l'état de chargement
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                <div
                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="animate-pulse h-12 w-12 bg-gray-200 rounded-xl"></div>
                    <div className="mt-5">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="mt-2 h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div
                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="animate-pulse h-12 w-12 bg-gray-200 rounded-xl"></div>
                    <div className="mt-5">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="mt-2 h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Gérer les erreurs
    if (isError) {
        return (
            <div className="text-red-500 text-center">
                Erreur lors du chargement des statistiques :{" "}
                {error instanceof Error ? error.message : "Erreur inconnue"}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90"/>
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Doctors
            </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {numberOfDoctors.toLocaleString()} {/* Formatage avec séparateurs de milliers */}
                        </h4>
                    </div>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Patients
            </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {numberOfPatients.toLocaleString()} {/* Formatage avec séparateurs de milliers */}
                        </h4>
                    </div>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}