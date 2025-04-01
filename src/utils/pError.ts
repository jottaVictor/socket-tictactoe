export default class PError extends Error{
    constructor(message: string) {
        super(message);
        this.name = "PError";
    }
}