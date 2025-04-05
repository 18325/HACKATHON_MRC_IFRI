import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { Modal } from "../components/ui/modal";
import React, {useState} from "react";
import { useModal } from "../hooks/useModal.ts";
import Label from "../components/form/Label.tsx";
import Input from "../components/form/input/InputField.tsx";
import Select from "../components/form/Select.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate.ts";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/ui/button/Button.tsx";
import { Patient } from "../types/medicalTypes.ts";
import { ApiError } from "../types/types.ts";
import ReactSelect from "react-select";
import Alert from "../components/ui/alert/Alert.tsx";

// Schéma de validation avec Zod
const reportSchema = z.object({
    start_date: z.string().min(1, "La date de début est requise"),
    end_date: z
        .string()
        .min(1, "La date de fin est requise"),
    patient_id: z.string().optional(),
    type: z.enum(["pdf", "csv"], { errorMap: () => ({ message: "Le type de rapport est requis" }) }),
});

type ValidationError = {
    start_date?: string;
    end_date?: string;
    patient_id?: string;
    type?: string;
    general?: string;
}

type ReportFormData = z.infer<typeof reportSchema>;

const LayoutContent: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const [error, setError] = useState<ValidationError>({});
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { isOpen, openModal, closeModal } = useModal()

    // Récupérer la liste des patients pour le champ Select
    const { data: patients } = useQuery({
        queryKey: ["patients"],
        queryFn: async (): Promise<Patient[]> => {
            const response = await axiosPrivate.get("/patients");
            return response.data as Patient[];
        },
    });

    // Configuration de React Hook Form
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            start_date: "",
            end_date: "",
            patient_id: undefined,
            type: "pdf",
        },
    });

    // Mutation pour générer le rapport
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (data: ReportFormData): Promise<Blob> => {
            console.log(data)
            const response = await axiosPrivate.post("/generate-report", data, { responseType: "blob" });
            return response.data as Blob;
        },
        onSuccess: (fileBlob, variables) => {
            if (fileBlob instanceof Blob) {
                const extension = variables.type === "pdf" ? "pdf" : "csv";
                const url = window.URL.createObjectURL(fileBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `report-${variables.start_date}-to-${variables.end_date}.${extension}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("La réponse n'est pas un fichier valide");
            }
            // closeModal();
            // reset();
        },
        onError: (error: ApiError) => {
            console.error("Erreur lors de la génération du rapport", error);
            if (error.response?.status === 422) {
                setError(error.response?.data.errors || {})
                console.log("Validation errors:", error.response.data.errors);
            } else {
                setError({general: "Une erreur est survenu"});
            }
        },
    });

    const onSubmit = (data: ReportFormData) => {
        mutate(data);
    };

    const handleCloseModal = () => {
        reset();
        closeModal();
    };

    const patientOptions = patients?.map((p: Patient) => ({
        value: p.id.toString(),
        label: `${p.first_name} ${p.last_name}`, // Assure-toi que les champs sont corrects (firstName et lastName)
    })) || [];

    return (
        <div className="min-h-screen xl:flex">
            {isSuccess &&
                <Alert variant="success" seconds={3} title="Opération effectué" message="Rapport généré avec succés"/>
            }
            <div>
                <AppSidebar openModal={openModal} />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Générer un rapport
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Entrez les informations pour générer un rapport
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Date de début</Label>
                                        <Input
                                            type="date"
                                            {...register("start_date")}
                                            error={!!error.start_date || !!errors.start_date}
                                            hint={error.start_date || errors.start_date?.message}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Date de fin</Label>
                                        <Input
                                            type="date"
                                            {...register("end_date")}
                                            error={!!error.end_date || !!errors.end_date}
                                            hint={error.end_date || errors.end_date?.message}
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <Label>Patient (facultatif)</Label>
                                        <Controller
                                            name="patient_id"
                                            control={control}
                                            render={({ field }) => (
                                                <ReactSelect
                                                    options={patientOptions}
                                                    placeholder="Rechercher un patient..."
                                                    value={patientOptions.find((option: { value: string; }) => option.value === field.value) || null}
                                                    onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : "")}
                                                    isClearable
                                                    isSearchable
                                                    className="text-sm text-gray-800 dark:text-white/30 dark:placeholder:text-white/30"
                                                    classNamePrefix="react-select"
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            borderColor: errors.patient_id || error.patient_id ? "#EF4444" : "#D1D5DB",
                                                            backgroundColor: "transparent",
                                                            padding: "0.25rem",
                                                            borderRadius: "0.5rem",
                                                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                                            "&:hover": {
                                                                borderColor: errors.patient_id || error.patient_id ? "#EF4444" : "#93C5FD",
                                                            },
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            backgroundColor: "#fff",
                                                            color: "#374151",
                                                            borderRadius: "0.5rem",
                                                        }),
                                                        option: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: state.isSelected ? "#3B82F6" : state.isFocused ? "#EFF6FF" : "#fff",
                                                            color: state.isSelected ? "#fff" : "#374151",
                                                            "&:active": {
                                                                backgroundColor: "#DBEAFE",
                                                            },
                                                        }),
                                                        singleValue: (base) => ({
                                                            ...base,
                                                            color: "#9CA3AF",
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: "#9CA3AF",
                                                        }),
                                                    }}
                                                />
                                            )}
                                        />
                                        {!!error.patient_id && (
                                            <p className="mt-1.5 text-xs text-error-500">{error.patient_id}</p>
                                        )}
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Type de rapport</Label>
                                        <Controller
                                            name="type"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    options={[
                                                        { value: "pdf", label: "PDF" },
                                                        { value: "csv", label: "CSV" },
                                                    ]}
                                                    placeholder="Sélectionner le type de rapport"
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    className={`dark:bg-dark-900 ${errors.type ? "border-red-500" : ""}`}
                                                    error={!!error.type || !!errors.type}
                                                    hint={error.type || errors.type?.message}
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
                                disabled={isPending}
                            >
                                Fermer
                            </Button>
                            <Button variant={isPending? "outline": "primary"} disabled={isPending}>
                                {isPending ? "Téléchargement en cours ..." : "Générer"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

const AppLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default AppLayout;