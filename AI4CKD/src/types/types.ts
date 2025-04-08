export interface ApiError {
    response?: {
        data: {
            success: boolean,
            message: string,
            status: number,
            errors: {
                first_name?: string;
                last_name?: string;
                tel?: string;
                address?: string;
                password? : string;
                name?: string;
                location?: string;
                type?: string;
                date?: string;
                description?: string;
                patient_id?: string,
                notes?: string,
                current_treatments?: string;
                stage_mrc?: string;
                uniqueId?: string;
                emergencyContactName?: string;
                emergencyContactPhone?: string;
                general?: string;
            }
        }
        status: number
    }
}