import express from 'express';
import bodyParser from 'body-parser';
import { resolveByRoot } from '../lib/path.js';
import { galleryController } from './controllers/gallery.js';
import { geoController } from './controllers/geo.js';
import { groupController, deleteGroupController } from './controllers/group.js';
import { mainController } from './controllers/main.js';
import { timelineController } from './controllers/timeline.js';
import loggerMiddleware from './middlewares/logger.js';

const app = express();

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded());

app.get('/', mainController);
app.get('/groups', groupController);
app.post('/groups', deleteGroupController);
app.get('/timeline', timelineController);
app.get('/gallery', galleryController);
app.get('/geo', geoController);

app.use('/thumbnails', express.static(resolveByRoot('database/thumbnails')));

export default app;
