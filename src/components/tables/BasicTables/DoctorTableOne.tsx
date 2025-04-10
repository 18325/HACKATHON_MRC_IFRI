import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button.tsx";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Doctor } from "../../../types/medicalTypes.ts"; // Importer le type Doctor
import { useState } from "react";
import Loader from "../../ui/Loader.tsx";
import Alert from "../../ui/alert/Alert.tsx";
import {Modal} from "../../ui/modal";
import {useModal} from "../../../hooks/useModal.ts";
import {ApiError} from "../../../types/types.ts";

export default function DoctorTableOne({ searchTerm, itemsPerPage }: { searchTerm: string; itemsPerPage: number }) {
    const axiosPrivate = useAxiosPrivate();
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const { isOpen, openModal, closeModal } = useModal();
    const [message, setMessage] = useState("");
    const [id, setId] = useState(0);
    const [status, setStatus] = useState(true);
    // Récupérer les docteurs via l'API
    const fetchDoctors = async (): Promise<Doctor[]> => {
        const response = await axiosPrivate.get("/doctors");
        console.log(response.data.body)
        return response.data.body as Doctor[];
    };
    const { isLoading, isError, data: doctors } = useQuery({
        queryKey: ["doctors"],
        queryFn: fetchDoctors,
    });
    // Filtrer les docteurs en fonction du terme de recherche
    const filteredDoctors = doctors?.filter((doctor) => {
        return (
            doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosPrivate.delete(`/doctor/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
            closeModal();
            setMessage(data.message)
        },
        onError(error: ApiError) {
            console.log(error.response)
        }
    });

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosPrivate.post(`/doctor/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
            closeModal();
            setMessage(data.message)
        },
    });

    // Calculer la pagination
    const totalPages = filteredDoctors?.length == undefined ? 0 : Math.ceil(filteredDoctors.length / itemsPerPage);
    const currentDoctors = filteredDoctors?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const opModal = (id: number, status: boolean)=> {
        setId(id);
        setStatus(status)
        openModal();
    }


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {(deleteMutation.isSuccess||mutation.isSuccess)&& !!message &&
                <Alert variant="success" seconds={2} title="Opération effectué" message={message}/>
            }
            <div className="max-w-full overflow-x-auto">
                <div className={doctors?.length !== 0 ? "min-w-[1102px]" : "h-[calc(100vh-28rem)] flex items-center justify-center"}>
                    {isLoading ? (
                        isError ? (
                            <p className="text-center">Erreur lors du chargement des données</p>
                        ) : (
                            <Loader className="h-64" />
                        )
                    ) : doctors?.length === 0 ? (
                        <p className="text-center py-4 font-medium text-gray-800 dark:text-white/90">
                            Aucun docteur enregistré
                        </p>
                    ) : (
                        <div className="min-w-[1102px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Nom
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Prénoms
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Email
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
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {currentDoctors?.map((doctor) => (
                                        <TableRow key={doctor.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                          {doctor.last_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                          {doctor.first_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {doctor.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {doctor.contact}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Button onClick={()=>opModal(doctor.id, doctor.status)} size="sm" variant="primary">
                                                    {doctor.status? "Désactiver " : "Réactiver "} le compte
                                                </Button>
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
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    {deleteMutation.isError&& !!message &&
                        <Alert variant="error" seconds={5} title="Opération échoué" message={message}/>
                    }
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            {status? "Désactiver " : "Réactiver "} le compte du médécin
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Etes vous sur de vouloir {status? "désactiver " : "réactiver "} le compte de ce médécin ?
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-6 modal-footer sm:justify-end">
                        <button disabled={deleteMutation.isPending||deleteMutation.isPending}
                                onClick={closeModal}
                                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                            Annuler
                        </button>
                        {status?
                        <button onClick={()=> {
                            mutation.reset()
                            deleteMutation.reset()
                            deleteMutation.mutate(id)
                        }}
                            className={`${
                                deleteMutation.isPending
                                    ? "flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                    : "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                            }`}
                            disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending? "Désactivation en cours ...": "Confirmer"}
                        </button> :
                        <button onClick={()=> {
                            mutation.reset()
                            deleteMutation.reset()
                            mutation.mutate(id)
                        }}
                            disabled={mutation.isPending}
                            className={`${
                                mutation.isPending
                                    ? "flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                    : "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                            }`}>
                            {mutation.isPending? "Réactivation en cours ...": "Confirmer"}
                        </button>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}