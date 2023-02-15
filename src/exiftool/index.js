const { exec } = require('child_process');

const TOOL_PATH = 'exiftool';

function getData(OBJ_PATH) {
    return new Promise((resolve, reject) => {
        exec(`${TOOL_PATH} -json "${OBJ_PATH}"`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error('Can not get data', { cause: error }));

                return;
            }

            if (stderr) {
                console.log(stderr);
            }

            resolve(stdout);
        });
    });
}

module.exports = {
    getData,
};
