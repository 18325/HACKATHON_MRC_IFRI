import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import {Stat} from "../../types/medicalTypes.ts";

export default function Metrics({isLoading, error, stat, isError}: {isLoading: boolean, isError:boolean, error: Error|null, stat: Stat|undefined}) {

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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre de rendez-vous pour aujourd'hui
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stat?.rdv_today}
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
              Nombre de rendez-vous à venir
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stat?.rdv_future}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
