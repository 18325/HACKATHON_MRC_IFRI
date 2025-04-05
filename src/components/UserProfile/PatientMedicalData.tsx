import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.ts";
import {Controller, useForm} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/button/Button.tsx";
import { Patient } from "../../types/medicalTypes.ts";
import {useEffect, useState} from "react";
import {ApiError} from "../../types/types.ts";
import Input from "../form/input/InputField.tsx";
import TextArea from "../form/input/TextArea.tsx";
import Alert from "../ui/alert/Alert.tsx";
import Form from "../form/Form.tsx";

// Schéma de validation avec Zod pour les informations médicales
const medicalSchema = z.object({
    medical_history: z.string().optional(),
    current_treatments: z.string().optional(),
    stage_mrc: z.number().int().min(1, "La date MRC doit être un entier positif égale à 1 minimum"),
});

type ValidationError = {
    bloodGroup?: string;
    medical_history?: string;
    current_treatments?: string;
    stage_mrc?: string;
    message?: string;
}

type MedicalFormData = z.infer<typeof medicalSchema>;

export default function PatientMedicalData({ id }: { id: string | undefined }) {
    const { isOpen, openModal, closeModal } = useModal();
    const [err, setErr] = useState<ValidationError>({});
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    // Récupérer les informations médicales du patient
    const { isLoading, error, isPending, data: patient } = useQuery({
        queryKey: ["patient_medical", id],
        queryFn: async (): Promise<Patient> => {
            const response = await axiosPrivate.get(`/patients/${id}`);
            console.log(response.data)
            return response.data as Patient;
        },
        enabled: !!id,
    });

    // Configuration de React Hook Form
    const {
        register,
        handleSubmit,
        reset, control,
        formState: { errors },
    } = useForm<MedicalFormData>({
        resolver: zodResolver(medicalSchema),
        defaultValues: {
            medical_history: "",
            current_treatments: "",
            stage_mrc: 1,
        },
    });

    // Mettre à jour les valeurs par défaut lorsque les données du patient sont chargées
    useEffect(() => {
        if (patient) {
            reset({
                stage_mrc: patient.medical_data?.stage_mrc ,
                current_treatments: patient.medical_data?.current_treatments || "",
                medical_history: patient.medical_data?.medical_history || "",
            });
        }
    }, [patient, reset]);

    // Mutation pour mettre à jour les informations médicales
    const updateMutation = useMutation({
        mutationFn: async (data: MedicalFormData) => {
            const response = await axiosPrivate.put(`/patients/${id}/medical`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["patient_medical", id] });
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            setErr({message: data.message})
            closeModal();
        },
        onError: (error: ApiError) => {
            console.log(error.response)
            setErr(error.response?.data.errors || {});
            console.error("Erreur lors de la mise à jour des informations médicales", error);
        },
    });

    const onSubmit = (data: MedicalFormData) => {
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
                        Informations médicales
                    </h4>
                    {isLoading ? (
                        error ? (
                            <p className="text-center text-red-600">Erreur lors du chargement des données</p>
                        ) : (
                            <div className="h-32 flex text-gray-800 items-center justify-center">
                                <p>Chargement ...</p>
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Groupe sanguin
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.medical_data?.blood_group || "Non spécifié"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Stade mrc
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.medical_data?.stage_mrc || "Non spécifié"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Antécédents médicaux
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.medical_data?.medical_history || "Aucun"}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Traitement en cours
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {patient?.medical_data?.current_treatments || "Aucun"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Button variant="outline" onClick={openModal} disabled={isPending}>
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
                            Modifier les informations médicales
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Mettez à jour les informations médicales du patient
                        </p>
                    </div>
                    <Form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-2">
                                        <Label>Stade MRC</Label>
                                        <Input
                                            type="number"
                                            {...register("stage_mrc", {valueAsNumber: true})}
                                            error={!!errors.stage_mrc||!!err.stage_mrc}
                                            hint={errors.stage_mrc?.message || err.stage_mrc}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Antécédents médicaux (facultatif)</Label>
                                        <Controller
                                            name="medical_history"
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    placeholder="Une description de l'historique médical"
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.medical_history || !!err.medical_history}
                                                    hint={errors.medical_history?.message || err.medical_history}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Traitement en cours (facultatif)</Label>
                                        <Controller
                                            name="current_treatments"
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    placeholder="Une description des traitement en cours"
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.current_treatments || !!err.current_treatments}
                                                    hint={errors.current_treatments?.message || err.current_treatments}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={handleCloseModal}
                                disabled={updateMutation.isPending}
                            >
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
                    </Form>
                </div>
            </Modal>
        </div>
    );
}