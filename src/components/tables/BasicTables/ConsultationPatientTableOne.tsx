import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button.tsx";
import Badge from "../../ui/badge/Badge.tsx";
import { useState } from "react";
import { Consultation } from "../../../types/medicalTypes.ts";
import { Modal } from "../../ui/modal";

import {Controller, useForm} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "../../form/Label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useModal} from "../../../hooks/useModal.ts";
import {useAxiosPrivate} from "../../../hooks/useAxiosPrivate.ts";
import {ApiError} from "../../../types/types.ts";
import TextArea from "../../form/input/TextArea.tsx";
import Alert from "../../ui/alert/Alert.tsx";

// Schéma de validation pour une consultation
const consultationSchema = z.object({
    doctor_remarks: z.string().min(1, "Les remarques sont requises"),
    prescriptions: z.string().optional(),
    testResults: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;
type ValidationErrors = {
    doctor_remarks?: string,
    prescriptions?: string,
    testResults?: string,
    general?: string,
}
export interface ConsultationPatientTableOneProps {
    consultations?: Consultation[];
    isLoading: boolean;
    error: Error | null;
    itemsPerPage: number;
}

export default function ConsultationPatientTableOne({consultations, isLoading, error, itemsPerPage,}: ConsultationPatientTableOneProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const { isOpen, openModal, closeModal } = useModal();
    const [err, setErr] = useState<ValidationErrors>({})
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const totalPages = consultations?.length
        ? Math.ceil(consultations.length / itemsPerPage)
        : 0;
    const currentConsultations = consultations?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Configuration de React Hook Form
    const {control, handleSubmit, reset, formState: { errors },
    } = useForm<ConsultationFormData>({
        resolver: zodResolver(consultationSchema),
        defaultValues: {
            doctor_remarks: "",
            prescriptions: "",
            testResults: "",
        },
    });

    // Mutation pour mettre à jour une consultation
    const updateMutation = useMutation({
        mutationFn: async (data: ConsultationFormData) => {
            if (!selectedConsultation) return;
            const response = await axiosPrivate.put(`/consultations/${selectedConsultation.id}`, data);
            console.log(response.data)
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["consultations"] });
            closeModal();
            reset();
            setErr({
                general: data.message
            })
            setSelectedConsultation(null);
        },
        onError: (error: ApiError) => {
            if (error.response?.status === 422) {
                // Gérer les erreurs de validation côté serveur
                console.log(error.response)
                setErr(error.response.data.errors || {});
            } else {
                setErr({
                    general: error.response?.data.message
                })
            }
            console.log(error.response)
        },
    });

    const openModalWithConsultation = (consultation: Consultation) => {
        setSelectedConsultation(consultation);
        reset({
            doctor_remarks: consultation.doctor_remarks || "",
            prescriptions: consultation.prescriptions || "",
            testResults: consultation.testResults || "",
        });
        openModal();
    };

    const onSubmit = (data: ConsultationFormData) => {
        updateMutation.mutate(data);
    };

    const handleCloseModal = () => {
        reset();
        setErr({});
        setSelectedConsultation(null);
        closeModal();
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                {
                    updateMutation.isSuccess&& !!err.general &&
                    <Alert variant="success" seconds={3} title="Opération éffectué" message={err.general}/>
                }
                <div className={consultations?.length !== 0 ? "min-w-[1102px]" : ""}>
                    {isLoading ? (
                        error ? (
                            <p className="text-center text-red-600">
                                Erreur lors du chargement des données
                            </p>
                        ) : (
                            <div className="h-32 flex text-gray-800 dark:text-white/90 items-center justify-center">
                                <p>Chargement ...</p>
                            </div>
                        )
                    ) : consultations?.length === 0 ? (
                        <p className="text-center py-4 font-medium text-gray-800 dark:text-white/90">
                            Aucune consultation à afficher pour ce patient
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
                                            Médecin
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Date
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Statut
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {currentConsultations?.map((consultation) => (
                                        <TableRow key={consultation.id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                          {consultation.doctor.first_name} {consultation.doctor.last_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {new Date(consultation.date).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        consultation.status === "confirmed"
                                                            ? "success"
                                                            : consultation.status === "scheduled"
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {consultation.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="flex justify-end px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => openModalWithConsultation(consultation)}
                                                >
                                                    Mettre à jour les résultats
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
                        </>
                    )}
                </div>
            </div>

            {/* Modal pour la mise à jour des consultations */}
            <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Mettre à jour la consultation
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Modifiez les détails de la consultation
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                    <div className="col-span-2">
                                        <Label>Remarques du médecin </Label>
                                        <Controller
                                            name="doctor_remarks"
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    placeholder="Saisissez vos remarques ..."
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.doctor_remarks || !!err.doctor_remarks}
                                                    hint={errors.doctor_remarks?.message || err.doctor_remarks}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Ordonnances (facultatif)</Label>
                                        <Controller
                                            name="prescriptions"
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    placeholder="Saisissez vos prescriptions..."
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.prescriptions || !!err.prescriptions}
                                                    hint={errors.prescriptions?.message || err.prescriptions}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Résultats des tests (facultatif)</Label>
                                        <Controller
                                            name="testResults"
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    placeholder="Saisissez les résultats..."
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.testResults || !!err.testResults}
                                                    hint={errors.testResults?.message || err.testResults}
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
                                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                            >
                                Fermer
                            </Button>
                            <Button
                                disabled={updateMutation.isPending}
                                className={`flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto ${
                                    updateMutation.isPending ? "bg-gray-300" : "bg-brand-500 hover:bg-brand-600"
                                }`}
                            >
                                {updateMutation.isPending ? (
                                    "Mise à jour en cours ..."
                                ) : (
                                    "Mettre à jour"
                                )}
                            </Button>
                        </div>
                    </form>
                    {
                        updateMutation.isError && !!err.general &&
                        <Alert variant="error" seconds={5} title="Opération échoué" message={err.general}/>
                    }
                </div>
            </Modal>
        </div>
    );
}