import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import Button from "../../components/ui/button/Button.tsx";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import { useModal } from "../../hooks/useModal.ts";
import { useRef, useState } from "react";
import Select from "../../components/form/Select.tsx";
import { PlusIcon } from "../../icons";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../types/types.ts";
import { z } from "zod";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Patient } from "../../types/medicalTypes.ts";
import PatientTableOne from "../../components/tables/BasicTables/PatientTableOne.tsx";
import { v4 as uuidv4 } from "uuid";
import TextArea from "../../components/form/input/TextArea.tsx";
import Alert from "../../components/ui/alert/Alert.tsx";

// Schéma de validation avec Zod pour le formulaire Patient
const patientSchema = z.object({
    // Informations personnelles
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.string().email("L’email doit être valide").min(1, "L’email est requis"),
    dateOfBirth: z.string().min(1, "La date de naissance est requise"),
    gender: z.enum(["Homme", "Femme", "Autre"], {
        errorMap: () => ({ message: "Le genre est requis" }),
    }),
    tel: z
        .string()
        .min(1, "Le numéro de téléphone est requis")
        .regex(/^\d{10}$/, "Le numéro doit contenir 10 chiffres"),
    address: z.string().min(1, "L’adresse est requise"),

    // Données médicales
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        errorMap: () => ({ message: "Le groupe sanguin est requis" }),
    }),
    medicalHistory: z.string().optional(),
    currentTreatments: z.string().optional(),
    stage_mrc: z.number().int().min(1, "La date MRC doit être un entier positif égale à 1 minimum"),

    // Données administratives
    uniqueId: z.string().min(1, "L’identifiant unique est requis"),
    emergencyContactName: z.string().min(1, "Le nom du contact d’urgence est requis"),
    emergencyContactPhone: z
        .string()
        .min(1, "Le numéro de téléphone du contact d’urgence est requis")
        .regex(/^\d{10}$/, "Le numéro doit contenir 10 chiffres"),
});

// Type déduit du schéma Zod
type PatientFormData = z.infer<typeof patientSchema>;

// Interface pour les erreurs renvoyées par Laravel
interface ValidationErrors {
    first_name?: string;
    last_name?: string;
    dateOfBirth?: string;
    message?: string;
    gender?: string;
    tel?: string;
    email?: string;
    address?: string;
    bloodGroup?: string;
    medical_history?: string;
    current_treatments?: string;
    stage_mrc?: string;
    uniqueId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    general?: string;
}

export default function PatientListPage() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const [error, setError] = useState<ValidationErrors>({});

    const [searchTerm, setSearchTerm] = useState("");
    const [byPage, setByPage] = useState(10);
    const listPage = [2, 5, 10, 20, 50];
    const pageOptions = listPage.map((page) => ({
        value: page,
        label: page.toString(),
    }));

    const handlePageChange = (value: string) => {
        setByPage(parseInt(value));
    };

    // Options pour les champs Select
    const genderOptions = [
        { value: "Homme", label: "Homme" },
        { value: "Femme", label: "Femme" },
        { value: "Autre", label: "Autre" },
    ];

    const bloodGroupOptions = [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
    ];

    // Générer un identifiant unique côté client
    const generateUniqueId = () => uuidv4();

    // Configuration de React Hook Form avec Zod
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            email: "",
            gender: undefined,
            tel: "",
            address: "",
            bloodGroup: undefined,
            medicalHistory: "",
            currentTreatments: "",
            stage_mrc: 1,
            uniqueId: generateUniqueId(), // Générer un identifiant unique par défaut
            emergencyContactName: "",
            emergencyContactPhone: "",
        },
    });

    // Mutation pour ajouter un patient
    const mutation = useMutation({
        mutationFn: async (patient: Omit<Patient, "id">) => {
            setError({});
            const response = await axiosPrivate.post("/patients", patient);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({ queryKey: ["stat"] });
            reset({
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                gender: undefined,
                tel: "",
                address: "",
                bloodGroup: undefined,
                medicalHistory: "",
                email: "",
                currentTreatments: "",
                stage_mrc: 1,
                uniqueId: generateUniqueId(), // Régénérer un nouvel identifiant unique après réinitialisation
                emergencyContactName: "",
                emergencyContactPhone: "",
            });
            setError({message: data.message})
            closeModal();
        },
        onError: (error: ApiError) => {
            if (error.response?.status === 422) {
                // Gérer les erreurs de validation côté serveur
                console.log(error.response)
                setError(error.response.data.errors || {});
            } else {
                setError({
                    general: "Une erreur est survenu"
                })
                console.log(error.response)
            }
        },
    });

    const { isOpen, openModal, closeModal } = useModal();
    const inputRef = useRef<HTMLInputElement>(null);

    // Gestion de la soumission
    const onSubmit: SubmitHandler<PatientFormData> = (data) => {
        console.log(data)
        mutation.mutate({
            first_name: data.firstName,
            last_name: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            phone: data.tel,
            email: data.email,
            address: data.address,
            blood_group: data.bloodGroup,
            medical_history: data.medicalHistory || "",
            current_treatments: data.currentTreatments || "",
            stage_mrc: data.stage_mrc,
            uniqueId: data.uniqueId,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
        });
    };

    // Fermer le modal et réinitialiser le formulaire
    const handleCloseModal = () => {
        reset({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            email: "",
            gender: undefined,
            tel: "",
            address: "",
            bloodGroup: undefined,
            medicalHistory: "",
            currentTreatments: "",
            stage_mrc: 1,
            uniqueId: generateUniqueId(), // Régénérer un nouvel identifiant unique
            emergencyContactName: "",
            emergencyContactPhone: "",
        });
        setError({});
        closeModal();
    };

    return (
        <div>
            <PageMeta title="Gestion des patients" description="Patients" />
            <PageBreadcrumb pageTitle="Gestion des patients" pagePath="/dash/dashboard" />
            {mutation.isSuccess&&!!error.message &&
                <Alert variant="success" seconds={3} title="Opération effectué" message={error.message}/>
            }
            <div className="space-y-6">
                <ComponentCard title="Liste des patients">
                    <div className="flex gap-4 flex-wrap justify-between">
                        <div>
                            <Select
                                options={pageOptions}
                                defaultValue={byPage.toString()}
                                placeholder="Entrée par page"
                                onChange={handlePageChange}
                                className={`dark:bg-dark-900`}
                            />
                        </div>
                        <div className="gap-4 flex-wrap-reverse flex w-full justify-end">
                            <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill=""
                    />
                  </svg>
                </span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Rechercher par nom, adresse..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                        />
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={openModal}
                                startIcon={<PlusIcon className="size-5" />}
                            >
                                Ajouter un patient
                            </Button>
                        </div>
                    </div>
                    <PatientTableOne searchTerm={searchTerm} itemsPerPage={byPage} />
                </ComponentCard>
            </div>
            <Modal isOpen={isOpen} onClose={handleCloseModal} isFullscreen={true} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Ajouter un nouveau patient
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Entrez les informations sur le patient
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                {/* Informations personnelles */}
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                                    Informations personnelles
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Nom</Label>
                                        <Input
                                            placeholder="Nom"
                                            {...register("lastName")}
                                            error={!!errors.lastName || !!error.last_name}
                                            hint={errors.lastName?.message || error.last_name}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Prénoms</Label>
                                        <Input
                                            placeholder="Prénoms"
                                            {...register("firstName")}
                                            error={!!errors.firstName || !!error.first_name}
                                            hint={errors.firstName?.message || error.first_name}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Date de naissance</Label>
                                        <Input
                                            type="date"
                                            {...register("dateOfBirth")}
                                            error={!!errors.dateOfBirth || !!error.dateOfBirth}
                                            hint={errors.dateOfBirth?.message || error.dateOfBirth}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Genre</Label>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({field}) => (
                                                <Select
                                                    options={genderOptions}
                                                    placeholder="Sélectionner le genre"
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.gender || !!error.gender}
                                                    hint={errors.gender?.message || error.gender}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Téléphone</Label>
                                        <Input
                                            placeholder="Téléphone"
                                            {...register("tel")}
                                            error={!!errors.tel || !!error.tel}
                                            hint={errors.tel?.message || error.tel}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Email</Label>
                                        <Input
                                            placeholder="Email"
                                            {...register("email")}
                                            error={!!errors.email || !!error.email}
                                            hint={errors.email?.message || error.email}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-2">
                                        <Label>Adresse</Label>
                                        <Input
                                            placeholder="Adresse"
                                            {...register("address")}
                                            error={!!errors.address || !!error.address}
                                            hint={errors.address?.message || error.address}
                                        />
                                    </div>
                                </div>

                                {/* Données médicales */}
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-6 mb-4">
                                    Données médicales
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Groupe sanguin</Label>
                                        <Controller
                                            name="bloodGroup"
                                            control={control}
                                            render={({field}) => (
                                                <Select
                                                    options={bloodGroupOptions}
                                                    placeholder="Sélectionner le groupe sanguin"
                                                    value={field.value || ""}
                                                    onChange={(value) => field.onChange(value)}
                                                    error={!!errors.bloodGroup || !!error.bloodGroup}
                                                    hint={errors.bloodGroup?.message || error.bloodGroup}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1 lg:col-span-1">
                                        <Label>Stade MRC</Label>
                                        <Input
                                            type="number"
                                            {...register("stage_mrc", {valueAsNumber: true})}
                                            error={!!errors.stage_mrc || !!error.stage_mrc}
                                            hint={errors.stage_mrc?.message || error.stage_mrc}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 my-5 lg:col-span-1">
                                    <Label>Historique médical (facultatif)</Label>
                                    <Controller
                                        name="medicalHistory"
                                        control={control}
                                        render={({ field }) => (
                                            <TextArea
                                                placeholder="Une description de l'historique médical"
                                                value={field.value || ""}
                                                onChange={(value) => field.onChange(value)}
                                                error={!!errors.medicalHistory || !!error.medical_history}
                                                hint={errors.medicalHistory?.message || error.medical_history}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-span-2 my-5 lg:col-span-1">
                                    <Label>Traitement en cours (facultatif)</Label>
                                    <Controller
                                        name="currentTreatments"
                                        control={control}
                                        render={({ field }) => (
                                            <TextArea
                                                placeholder="Une description du ou des traitements en cours"
                                                value={field.value || ""}
                                                onChange={(value) => field.onChange(value)}
                                                error={!!errors.currentTreatments || !!error.current_treatments}
                                                hint={errors.currentTreatments?.message || error.current_treatments}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Données administratives */}
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-6 mb-4">
                                    Données administratives
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Identifiant unique</Label>
                                        <Input
                                            placeholder="Identifiant unique"
                                            {...register("uniqueId")}
                                            error={!!errors.uniqueId || !!error.uniqueId}
                                            hint={errors.uniqueId?.message || error.uniqueId}
                                            readOnly // Champ en lecture seule car généré automatiquement
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Nom du contact d’urgence</Label>
                                        <Input
                                            placeholder="Nom du contact d’urgence"
                                            {...register("emergencyContactName")}
                                            error={!!errors.emergencyContactName || !!error.emergencyContactName}
                                            hint={errors.emergencyContactName?.message || error.emergencyContactName}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Téléphone du contact d’urgence</Label>
                                        <Input
                                            placeholder="Téléphone du contact d’urgence"
                                            {...register("emergencyContactPhone")}
                                            error={!!errors.emergencyContactPhone || !!error.emergencyContactPhone}
                                            hint={errors.emergencyContactPhone?.message || error.emergencyContactPhone}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {error.general && (
                            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                                {error.general}
                            </div>
                        )}
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <button
                                onClick={handleCloseModal}
                                type="button"
                                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                disabled={mutation.isPending}
                            >
                                Fermer
                            </button>
                            <button
                                type="submit"
                                className={`${
                                    mutation.isPending
                                        ? "flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                        : "btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                                }`}
                                disabled={mutation.isPending }
                            >
                                {mutation.isPending ? (
                                    <p>Ajout en cours ...</p>
                                ) : (
                                    "Valider"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}