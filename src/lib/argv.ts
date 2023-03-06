import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { validatePath } from './fs.js';

type TArgv = {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
};

export async function initArguments(): Promise<TArgv> {
    return await yargs(hideBin(process.argv)).argv;
}

export async function getPath(argv: TArgv) {
    if (typeof argv._[0] !== 'string') {
        throw new Error('Please, set path as a first argument.', { cause: argv });
    }

    return validatePath(argv._[0]);
}
