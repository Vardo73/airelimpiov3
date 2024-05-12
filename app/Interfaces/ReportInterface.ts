export interface OriginalData {
    type_id: number;
    average: number;
    type: {
        id: number;
        name: string;
        created_at: string | null;
        updated_at: string | null;
    };
    created_date: string;
}

export interface ProcessedData {
    created_date: number;
    average_type_1: number;
    average_type_2: number;
}
