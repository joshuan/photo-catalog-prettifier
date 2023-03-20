export class BrokenFile extends Error {
    constructor(private readonly filepath: string, message: string) {
        super(`${message}. Broken file "${filepath}".`);
    }
}
