// Enum pour les types de Notification
export enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    ALERTE_INTERNE = "alerte interne",
}

// Enum pour les statuts de AdministrativeTask
export enum TaskStatus {
    EN_ATTENTE = "en attente",
    TERMINEE = "terminée",
    ECHOUÉE = "échouée",
}

// Interface pour Doctor
export interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
}

// Interface pour User
export interface User {
    id: number;
    email: string;
    first_name: string,
    last_name: string,
}

// Interface pour AdministrativeTask
export interface AdministrativeTask {
    id: number;
    type: string;
    dateExecution: string; // ISO string (ex. "2025-04-01T10:00:00Z")
    status: TaskStatus;
    // Méthodes: plantifie(): void, générer(): void
}

// Interface pour Appointment
export interface Appointment {
    id: number;
    date: string; // ISO string
    dateOfBirth: string; // ISO string
}

// Interface pour Patient
export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    tel: string;
    address: string;
    bloodGroup: string;
    medicalHistory: string;
    currentTreatments: string;
    stage_mrc: number;
    uniqueId: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

// Interface pour MedicalData
export interface MedicalData {
    id: number;
    medicalHistory: string;
    currentTreatment: string;
}

// Interface pour Consultation
export interface Consultation {
    id: number;
    prescriptions: string;
    testResults: string;
    visitDate: string; // ISO string
    // Méthode: setReminder(): void
}

// Interface pour WorkFlow
export interface WorkFlow {
    id: number;
    name: string;
    description: string;
    steps: string;
    stage_mrc: number;
    // Méthode: fait(): void
}

// Interface pour Notification
export interface Notification {
    id: number;
    address: string; // Email ou numéro de téléphone
    message: string;
    type: NotificationType;
    sendDate: string; // ISO string
}

// Interface pour AdministrativeData
export interface AdministrativeData {
    id: number;
    recordNumber: string;
    referingDoctor: string;
}

// Interface pour Report
export interface Report {
    id: number;
    date: string; // ISO string
}

// Types pour les relations (optionnel, pour référence)
export interface DoctorWithRelations extends Doctor {
    patients?: Patient[];
    consultations?: Consultation[];
    workflows?: WorkFlow[];
}

export interface UserWithRelations extends User {
    administrativeTasks?: AdministrativeTask[];
}

export interface PatientWithRelations extends Patient {
    appointments?: Appointment[];
    medicalData?: MedicalData;
    consultations?: Consultation[];
    administrativeTasks?: AdministrativeTask[];
    workflows?: WorkFlow[];
    administrativeData?: AdministrativeData;
}

export interface AdministrativeTaskWithRelations extends AdministrativeTask {
    notifications?: Notification[];
}

export interface ConsultationWithRelations extends Consultation {
    reports?: Report[];
}