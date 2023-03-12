import { buildApp } from './app.js';
import { getPath, initArguments } from '../utils/argv.js';
import { Database } from '../lib/Database/index.js';

const port = process.env.PORT || 3000;

initArguments()
    .then((argv) => getPath(argv))
    .then(({ path }) => Promise.all([
        Database.init(path),
        buildApp(path),
    ]))
    .then(([database, app]) => {
        app.set('database', database);
        app.listen(port, () => {
            console.log(`App was started: http://localhost:${port}/`);
        });
    })
    .catch(error => {
        console.error('Failed to init server.', error);
    })
;
