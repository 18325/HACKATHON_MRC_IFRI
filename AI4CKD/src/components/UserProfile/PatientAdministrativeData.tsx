import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/button/Button.tsx";
import { Patient } from "../../types/medicalTypes.ts";
import {useEffect, useState} from "react";
import {ApiError} from "../../types/types.ts";
import Alert from "../ui/alert/Alert.tsx";

// Schéma de validation avec Zod pour les informations administratives
const administrativeSchema = z.object({
    emergencyContactName: z.string().min(1, "Le nom du contact d'urgence est requis"),
    emergencyContactPhone: z.string().min(1, "Le numéro de téléphone du contact d'urgence est requis"),
});

type ValidationError = {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    message?: string;
    general?: string;
}

type AdministrativeFormData = z.infer<typeof administrativeSchema>;

export default function PatientAdministrativeData({ id }: { id: string | undefined }) {
    const { isOpen, openModal, closeModal } = useModal();
    const [err, setErr] = useState<ValidationError>({});
    const queryClient = useQueryClient();

    const axiosPrivate = useAxiosPrivate();

    // Récupérer les informations administratives du patient
    const { isLoading, error, isPending, data: patient } = useQuery({
        queryKey: ["patient_administrative", id],
        queryFn: async (): Promise<Patient> => {
            const response = await axiosPrivate.get(`/patients/${id}`);
            console.log(response.data);
            return response.data as Patient;
        },
        enabled: !!id,
    });

    // Configuration de React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AdministrativeFormData>({
        resolver: zodResolver(administrativeSchema),
        defaultValues: {
            emergencyContactName: "",
            emergencyContactPhone: "",
        },
    });

    // Mettre à jour les valeurs par défaut lorsque les données du patient sont chargées
    useEffect(() => {
        if (patient) {
            reset({
                emergencyContactName: patient?.administrative_data?.emergencyContactName || "",
                emergencyContactPhone: patient?.administrative_data?.emergencyContactPhone || "",
            });
        }
    }, [patient, reset]);

    // Mutation pour mettre à jour les informations administratives
    const updateMutation = useMutation({
        mutationFn: async (data: AdministrativeFormData) => {
            const response = await axiosPrivate.put(`/patients/${id}/administrative`, data,);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["patient_administrative", id] });
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            setErr({message: data.message})
            closeModal();
        },
        onError: (error: ApiError) => {
            if (error.response?.status === 422) {
                // Gérer les erreurs de validation côté serveur
                console.log(error.response)
                setErr(error.response.data.errors || {});
            } else {
                setErr({
                    general: "Une erreur est survenu"
                })
                console.log(error.response)
            }
            console.error("Erreur lors de la mise à jour des informations administratives", error);
        },
    });

    const onSubmit = (data: AdministrativeFormData) => {
        updateMutation.mutate(data);
    };

    const handleCloseModal = () => {
        reset();
        closeModal();
    };

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            {updateMutation.isSuccess&&!!err.message &&
                <Alert variant="success" seconds={3} title="Opération effectué" message={err.message}/>
            }
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Informations administratives
                    </h4>
                    {isLoading ? (
                        error ? (
                            <p className="text-center text-red-600">Erreur lors du chargement des données</p>
                        ) : (
                            <div className="h-32 flex text-gray-800 dark:text-white/90 items-center justify-center">
                                <p>Chargement ...</p>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Médecin référent
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.administrative_data?.referring_doctor || "Non spécifié"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Numéro de dossier
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.administrative_data?.record_number || "Non spécifié"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Nom du contact d'urgence
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.administrative_data?.emergencyContactName || "Non spécifié"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Téléphone du contact d'urgence
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.administrative_data?.emergencyContactPhone || "Non spécifié"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Button variant="outline" onClick={openModal} disabled={isPending} >
                    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                        />
                    </svg>
                    Modifier
                </Button>
            </div>

            <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Modifier les informations administratives
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Mettez à jour les informations administratives du patient
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Nom du contact d'urgence</Label>
                                        <Input
                                            type="text"
                                            {...register("emergencyContactName")}
                                            className={errors.emergencyContactName ? "border-red-500" : ""}
                                            error={!!errors.emergencyContactName || !!err.emergencyContactName}
                                            hint={errors.emergencyContactName?.message || err.emergencyContactName}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Téléphone du contact d'urgence</Label>
                                        <Input
                                            type="text"
                                            {...register("emergencyContactPhone")}
                                            error={!!errors.emergencyContactPhone || !!err.emergencyContactPhone}
                                            hint={errors.emergencyContactPhone?.message || err.emergencyContactPhone}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <Button variant="outline" onClick={handleCloseModal} disabled={updateMutation.isPending}>
                                Fermer
                            </Button>
                            <Button disabled={updateMutation.isPending} variant={updateMutation.isPending ? "outline" : "primary"}>
                                {updateMutation.isPending ? (
                                    "Modification en cours ..."
                                ) : (
                                    "Mettre à jour"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}