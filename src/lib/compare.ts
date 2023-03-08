import { Executable } from './Executable.js';

export class Compare extends Executable {
    constructor(private fuzz: number = 3) {
        super('compare');
    }

    async diff(first: string, second: string) {
        try {
            this.exec([
                '-metric', 'AE',
                '-fuzz', `${this.fuzz}%`,
                first, second,
                'null:',
            ]);

            return 0;
        } catch (err) {
            // @ts-ignore
            if (err?.exitCode === 1) {
                // @ts-ignore
                return parseInt(err?.stderr, 10);
            } else {
                throw err;
            }
        }
    }
}
