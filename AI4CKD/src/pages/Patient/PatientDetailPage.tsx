import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {useParams} from "react-router";
import ConsultationPatientTables from "../Tables/ConsultationPatientTables.tsx";
import PatientInfoCard from "../../components/UserProfile/PatientInfoCard.tsx";
import PatientMedicalData from "../../components/UserProfile/PatientMedicalData.tsx";
import PatientAdministrativeData from "../../components/UserProfile/PatientAdministrativeData.tsx";

export default function PatientDetailPage() {
    const { id } = useParams();

    return (
        <div>
            <PageMeta
                title="Détail d'un patient"
                description="Détail sur un patient"
            />
            <PageBreadcrumb pageTitle="Détails du patient" pagePath="/user/patient"/>
            <div className="space-y-6">
                <ConsultationPatientTables id={id}  />
                <PatientMedicalData id={id} />
                <PatientAdministrativeData id={id} />
                <PatientInfoCard id={id} />
            </div>
        </div>
    );
}