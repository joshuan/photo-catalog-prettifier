import express from 'express';
import { pinoHttp } from 'pino-http';

const app = express();
const port = 3000;

const logger = pinoHttp({
    transport: { target: 'pino-pretty' },
});

app.get('/', (req, res) => {
    logger(req, res);
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
