export interface GenericReturn {
    message: string;
    code: number | null;
    data: any;
    success: boolean;
};

export function createGenericReturn(): GenericReturn{
    return {
        message: "",
        code: 0,
        data: null,
        success: false
    }
}