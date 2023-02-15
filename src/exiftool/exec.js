import { execaSync } from 'execa';
import { TOOL_PATH } from './config.js';

export function exec(OBJ_PATH, options = []) {
    return new Promise((resolve, reject) => {
        try {
            const result = execaSync(TOOL_PATH, ['-json', ...options, OBJ_PATH]);

            if (result.exitCode !== 0) {
                throw new Error('Not zero code result', { cause: result });
            }

            let data = {};

            try {
                data = JSON.parse(result.stdout);
            } catch (err) {
                throw new Error('Can not parse stdout', { cause: result });
            }
            
            resolve({ data, stat: result.stderr.split('\n').map(x => x.trim()) });
        } catch (error) {
            reject(new Error('Can not get data', { cause: error }));
        }
    });
}
