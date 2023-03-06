import fs from 'node:fs';
import { joinPath, resolvePath } from './path.js';
import { debugUtil } from './debug.js';

const debug = debugUtil('fs');

export async function readDir(dirpath: string): Promise<string[]> {
    debug('readDir start', dirpath);
    return new Promise((resolve, reject) => {
        fs.readdir(dirpath, function(err, files) {
            debug('readDir finish', files.length);
            err ? reject(err) : resolve(files);
        });
    });
}

export async function isFileExist(filepath?: string): Promise<boolean> {
    debug('isFileExist start', filepath);
    return new Promise((resolve, reject) => {
        if (!filepath) {
            return reject(new Error('Unknown path'));
        }

        fs.access(filepath, fs.constants.F_OK, (err) => {
            debug('isFileExist result', !Boolean(err));
            resolve(!Boolean(err));
        });
    });
}

export async function fileStat(filepath: string): Promise<fs.Stats> {
    debug('fileStat start', filepath);
    return new Promise((resolve, reject) => {
        fs.stat(
            filepath,
            (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    debug('fileStat ready', filepath);
                    resolve(stats);
                }
            },
        );
    });
}

export async function validatePath(filepath?: string): Promise<{ path: string; type: 'file' | 'directory' }> {
    debug('validatePath start', filepath);
    return new Promise((resolve, reject) => {
        if (!filepath) {
            return reject(new Error('Unknown path'));
        }

        const resolvedPath = resolvePath(filepath);

        return fileStat(filepath)
            .then((stats) => {
                debug('validatePath ready', filepath);
                resolve({
                    path: resolvedPath,
                    type: stats.isDirectory() ? 'directory' : 'file'
                });
            })
    });
}

export async function readFile(filepath: string): Promise<string> {
    debug('read start', filepath);
    return new Promise((resolve, reject) => {
        fs.readFile(
            filepath,
            { encoding: 'utf-8' },
            (err, data) => {
                debug('read finish', err);
                err ? reject(err) : resolve(data)
            },
        );
    });
}

export async function write(filepath: string, body: any): Promise<void> {
    debug('write start', filepath);
    return new Promise((resolve, reject) => {
        fs.writeFile(
            filepath,
            body,
            { encoding: 'utf-8' },
            (err) => {
                debug('validatePath finish', err);
                err ? reject(err) : resolve()
            },
        );
    });
}

export async function rename(directory: string, src: string, dest: string): Promise<void> {
    debug('rename start', directory, src, dest);
    return new Promise((resolve, reject) => {
        fs.rename(
            joinPath(directory, src),
            joinPath(directory, dest),
            (err) => {
                debug('rename finish', err);
                err ? reject(err) : resolve()
            },
        );
    });
}

export async function deleteFile(directory: string, file: string): Promise<void> {
    debug('deleteFile start', directory, file);
    return new Promise((resolve, reject) => {
        fs.unlink(
            joinPath(directory, file),
            (err) => {
                debug('deleteFile finish', err);
                err ? reject(err) : resolve()
            },
        );
    });
}

export async function writeJson(filepath: string, body: any): Promise<void> {
    debug('writeJson start', filepath);
    const result = await write(filepath + '.json', JSON.stringify(body, null, 4))
    debug('writeJson finish');
    return result;
}

export async function readJson<T>(filepath: string): Promise<T> {
    debug('readJson start', filepath);
    return new Promise((resolve, reject) => {
        fs.readFile(filepath + '.json', { encoding: 'utf-8' }, (err, data) => {
            debug('readJson finish');
            err ? reject(err) : resolve(JSON.parse(data) as T);
        });
    });
}
