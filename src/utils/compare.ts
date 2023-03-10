import { ExecaReturnBase } from 'execa';
import { exec } from './exec.js';

function isError(obj: unknown): obj is Error {
    return obj instanceof Error;
}

function isExecaError(obj: unknown): obj is ExecaReturnBase<string> {
    return (obj as ExecaReturnBase<string>).hasOwnProperty('exitCode');
}

interface ICompareOptions {
    fuzz?: number;
}

export async function compare([first, second]: [string, string], options: ICompareOptions = {}): Promise<number> {
    const { fuzz = 10 } = options;

    try {
        await exec('compare', [
            '-metric', 'AE',
            '-fuzz', `${fuzz}%`,
            first, second,
            'null:',
        ]);

        return 0;
    } catch (err) {
        if (isError(err) && isExecaError(err.cause) && err.cause.exitCode === 1) {
            return parseInt(err.cause.stderr, 10);
        } else {
            throw err;
        }
    }
}
