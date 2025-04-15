import { GenericReturn } from "#utils/interfaces";

export default interface ListenerReturn {
    type: string;
    message: string;
    code: number | null;
    data: any;
    success: boolean;
};

export function createListnerReturn(type: string, returnObj: GenericReturn): ListenerReturn{
    return {
        type: type,
        message: returnObj.message,
        code: returnObj.code,
        data: returnObj.data,
        success: returnObj.success,
    }
}