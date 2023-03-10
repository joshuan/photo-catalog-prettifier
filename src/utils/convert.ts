import { exec } from './exec.js';

export async function convert(params: string[]) {
    return exec('convert', params);
}
