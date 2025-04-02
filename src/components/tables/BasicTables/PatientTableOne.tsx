import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button.tsx";
import { Link } from "react-router-dom"; // Corrigé pour React Router v6+
// import { RotatingLines } from "react-loader-spinner";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate.ts";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "../../../types/medicalTypes.ts"; // Importer le type Patient
import { useState } from "react";
import Loader from "../../Loader.tsx";

export default function PatientTableOne({ searchTerm, itemsPerPage }: { searchTerm: string; itemsPerPage: number }) {
    const axiosPrivate = useAxiosPrivate();
    const [currentPage, setCurrentPage] = useState(1);

    // Récupérer les patients depuis l’API
    const fetchPatients = async (): Promise<Patient[]> => {
        const response = await axiosPrivate.get("/patients");
        return response.data as Patient[];
    };

    const { isLoading, error, data: patients } = useQuery({
        queryKey: ["patients"],
        queryFn: fetchPatients,
    });

    // Filtrer les patients en fonction du terme de recherche
    const filteredPatients = patients?.filter((patient) => {
        return (
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Calculer la pagination
    const totalPages = filteredPatients?.length === undefined ? 0 : Math.ceil(filteredPatients.length / itemsPerPage);
    const currentPatients = filteredPatients?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    {isLoading ? (
                        error ? (
                            <p className="text-center">Erreur lors du chargement des données</p>
                        ) : (
                            <div className="h-32 flex items-center justify-center">
                                <Loader />
                            </div>
                        )
                    ) : patients?.length === 0 ? (
                        <p className="text-center py-4 font-medium text-gray-800 dark:text-white/90">
                            Aucun patient enregistré
                        </p>
                    ) : (
                        <>
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Nom et Prénom
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Date de naissance
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Téléphone
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Adresse
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Date MRC
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="flex justify-end px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Détails
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {currentPatients?.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {`${patient.firstName} ${patient.lastName}`}
                            </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {new Date(patient.dateOfBirth).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {patient.tel}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {patient.address}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {patient.date_mrc}
                                            </TableCell>
                                            <TableCell className="flex justify-end px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Link to={`/dash/patient/${patient.id}`}>
                                                    <Button size="sm" variant="primary">
                                                        Voir plus de détails
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-2 mb-2 gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Précédent
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? "primary" : "outline"}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}