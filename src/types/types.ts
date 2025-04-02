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
            }
        }
        status: number
    }
}