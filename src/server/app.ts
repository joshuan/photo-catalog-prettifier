import express from 'express';
import { resolveByRoot } from '../lib/path.js';
import { geoController } from './controllers/geo.js';
import { groupController } from './controllers/group.js';
import { mainController } from './controllers/main.js';
import { timelineController } from './controllers/timeline.js';
import loggerMiddleware from './middlewares/logger.js';

const app = express();

app.use(loggerMiddleware);

app.get('/', mainController);
app.get('/groups', groupController);
app.get('/timeline', timelineController);
app.get('/geo', geoController);
app.use('/thumbnails', express.static(resolveByRoot('database/thumbnails')));

export default app;
