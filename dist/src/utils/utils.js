export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
export function log(...args) {
    if (process.env.NEXT_PUBLIC_LOG === "true")
        console.log(...args);
}
