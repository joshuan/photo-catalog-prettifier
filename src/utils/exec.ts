import { execa, ExecaReturnBase } from 'execa';
import { debugUtil } from './debug.js';

function isExecaError(obj: unknown): obj is ExecaReturnBase<string> {
    return (obj as ExecaReturnBase<string>).hasOwnProperty('exitCode');
}

export async function exec(util: string, params: string[]) {
    const debug = debugUtil(`exec:${util}`);

    debug(`${util} %o`, params);

    try {
        const result = await execa(util, params);

        debug('Result code:', result.exitCode);

        if (result.exitCode !== 0) {
            debug('Stderr print:', result.stderr);

            throw result;
        }

        return result.stdout;
    } catch (err) {
        if (isExecaError(err)) {
            debug('Error code:', err.exitCode);
        } else {
            debug('Error is not an execa error!')
        }

        throw new Error('Not zero code result', { cause: err });
    }
}
