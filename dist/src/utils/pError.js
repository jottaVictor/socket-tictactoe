export default class PError extends Error {
    constructor(message) {
        super(message);
        this.name = "PError";
    }
}
