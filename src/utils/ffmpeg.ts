import { exec } from './exec.js';

export async function ffmpeg(params: string[]) {
    return exec('ffmpeg', params);
}
