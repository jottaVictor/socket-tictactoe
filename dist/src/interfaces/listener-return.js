;
export function createListnerReturn(type, returnObj) {
    return {
        type: type,
        message: returnObj.message,
        code: returnObj.code,
        data: returnObj.data,
        success: returnObj.success,
    };
}
