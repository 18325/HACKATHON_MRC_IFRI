import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {Stat} from "../../types/medicalTypes.ts";
import {Link} from "react-router";
import Loader from "../ui/Loader.tsx";


export default function RecentAppointments({isLoading, error, stat, isError}: {isLoading: boolean, isError:boolean, error: Error|null, stat: Stat|undefined}) {

  if (isError) {
    return (
        <div className="text-red-500 text-center">
          Erreur lors du chargement des statistiques :{" "}
          {error instanceof Error ? error.message : "Erreur inconnue"}
        </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Rendez-vous à venir
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/user/calendar" >
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              Gérer les rendez-vous.
            </button>
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {
          isLoading ?
                  <Loader className="h-64" />
               : stat?.future_rdv?.length==0 ?
              <p className="text-center py-4 font-medium text-gray-800 dark:text-white/90" >Aucun rendez-vous à venir</p> :

              <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Patient
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Statut
              </TableCell>
              {/*<TableCell*/}
              {/*  isHeader*/}
              {/*  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"*/}
              {/*>*/}
              {/*  Status*/}
              {/*</TableCell>*/}
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {stat?.future_rdv?.map((rdv) => (
              <TableRow key={rdv.id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {rdv.date}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {rdv.last_name +" " + rdv.first_name }
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      rdv.status === "confirmed"
                        ? "success"
                        : rdv.status === "scheduled"
                        ? "warning"
                        : "error"
                    }
                  >
                    {rdv.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        }
      </div>
    </div>
  );
}
