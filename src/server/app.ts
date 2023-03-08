import express from 'express';
import bodyParser from 'body-parser';
import { resolveByRoot } from '../utils/path.js';
import { galleryController, galleryItemController } from './controllers/gallery.js';
import { geoController } from './controllers/geo.js';
import { groupController, groupOperationController } from './controllers/group.js';
import { mainController } from './controllers/main.js';
import { timelineController } from './controllers/timeline.js';
import loggerMiddleware from './middlewares/logger.js';

export const buildApp = async function buildApp(path: string) {
    const app = express();

    app.use(loggerMiddleware);
    app.use(bodyParser.urlencoded());

    app.get('/', mainController);
    app.get('/groups', groupController);
    app.post('/groups', groupOperationController);
    app.get('/timeline', timelineController);
    app.get('/gallery', galleryController);
    app.get('/gallery/:id', galleryItemController);
    app.get('/geo', geoController);

    app.use('/thumbnails', express.static(resolveByRoot('database/thumbnails')));
    app.use('/original', express.static(path));

    return app;
}
