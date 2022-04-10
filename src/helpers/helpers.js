export const isEmptyObj = (obj) => {
    if (!obj) return true;

    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    if (typeof obj !== 'object') return true;

    for (const key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
};
