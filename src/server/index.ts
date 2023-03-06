import app from './app.js';
import { getPath, initArguments } from '../lib/argv.js';
import { Database } from './services/database.js';

const port = 3000;

initArguments()
    .then((argv) => getPath(argv))
    .then(({ path }) => Database.init(path))
    .then((database) => {
        app.set('database', database);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to init server.', error);
    });
