import { execaSync } from 'execa';

const TOOL_PATH = 'exiftool';

export function getData(OBJ_PATH) {
    return new Promise((resolve, reject) => {
        try {
            const result = execaSync(TOOL_PATH, ['-json', OBJ_PATH]);

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
            console.log(error);
            reject(new Error('Can not get data', { cause: error }));
        }
    });
}
