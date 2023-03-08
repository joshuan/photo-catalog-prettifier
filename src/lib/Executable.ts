import { execaSync } from 'execa';
import { debugUtil, Debugger } from './debug.js';

export class Executable {
    protected readonly debug: Debugger;

    constructor(private readonly util: string) {
        this.debug = debugUtil(util);
    }

    public exec(options: string[]): string {
        this.debug('Execute: %s', [this.util, ...options].join(' '));

        const result = execaSync(this.util, options);

        if (result.exitCode !== 0) {
            this.debug('Stderr print:', result.stderr);

            throw new Error('Not zero code result', { cause: result });
        }

        return result.stdout;
    }
}
