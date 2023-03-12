import fs from 'node:fs';
import { joinPath, resolvePath } from './path.js';

export async function isFileExist(filepath?: string): Promise<boolean> {
    if (!filepath) {
        throw new Error('Unknown path');
    }

    try {
        await fs.promises.access(filepath, fs.constants.F_OK);
    } catch (err) {
        return false;
    }

    return true;
}

export async function fileStat(filepath: string): Promise<fs.Stats> {
    return await fs.promises.stat(filepath);
}

export async function validatePath(filepath?: string): Promise<{ path: string; type: 'file' | 'directory' }> {
    if (!filepath) {
        throw new Error('Unknown path');
    }

    const resolvedPath = resolvePath(filepath);
    const stats = await fileStat(filepath);

    return {
        path: resolvedPath,
        type: stats.isDirectory() ? 'directory' : 'file',
    }
}

export async function readFile(filepath: string): Promise<string> {
    return fs.promises.readFile(filepath, { encoding: 'utf-8' });
}

export async function readJson<T>(filepath: string): Promise<T> {
    return JSON.parse(await readFile(filepath)) as T;
}

export async function writeFile(filepath: string, body: any): Promise<void> {
    return fs.promises.writeFile(filepath, body, { encoding: 'utf-8' });
}

export function writeJson(filepath: string, body: any): Promise<void> {
    return writeFile(filepath, JSON.stringify(body, null, 4))
}

export async function rename(directory: string, src: string, dest: string): Promise<void> {
    return fs.promises.rename(
        joinPath(directory, src),
        joinPath(directory, dest),
    );
}

export async function deleteFile(directory: string, file: string): Promise<void> {
    return fs.promises.unlink(joinPath(directory, file));
}

export function readDir(dirpath: string): Promise<string[]> {
    return fs.promises.readdir(dirpath);
}

export function mkdir(dirpath: string): Promise<string | undefined> {
    return fs.promises.mkdir(dirpath, { recursive: true });
}

export function deleteDir(dirpath: string): Promise<void> {
    return fs.promises.rm(dirpath, { recursive: true, force: true });
}
