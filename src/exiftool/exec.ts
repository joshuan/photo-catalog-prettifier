import { execaSync } from 'execa';
import { TOOL_PATH } from './config.js';

export function exec<T extends {}>(OBJ_PATH: string, options:string[] = []): Promise<{ data: T; stat: string[] }> {
    return new Promise((resolve, reject) => {
        try {
            const result = execaSync(TOOL_PATH, ['-json', ...options, OBJ_PATH]);

            if (result.exitCode !== 0) {
                throw new Error('Not zero code result', { cause: result });
            }

            let data = {} as T;

            if (result.stdout !== '') {
                try {
                    data = JSON.parse(result.stdout) as T;
                } catch (err) {
                    throw new Error('Can not parse stdout', { cause: result });
                }
            }
            
            resolve({ data, stat: result.stderr.split('\n').map(x => x.trim()) });
        } catch (error) {
            reject(new Error('Can not execute exiftool', { cause: error }));
        }
    });
}
