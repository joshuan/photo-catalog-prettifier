import express from 'express';
import bodyParser from 'body-parser';
import { resolveByRoot } from '../utils/path.js';
import { galleryController, galleryItemController } from './controllers/gallery.js';
import { geoController } from './controllers/geo.js';
import { groupController, groupOperationController } from './controllers/group.js';
import { mainController } from './controllers/main.js';
import { timelineController } from './controllers/timeline.js';
import loggerMiddleware from './middlewares/logger.js';
import { asyncController } from './utils/asyncController.js';

export const buildApp = async function buildApp(path: string) {
    const app = express();

    app.use(loggerMiddleware);
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', asyncController(mainController));
    app.get('/groups', asyncController(groupController));
    app.post('/groups', asyncController(groupOperationController));
    app.get('/timeline', asyncController(timelineController));
    app.get('/gallery', asyncController(galleryController));
    app.get('/gallery/:id', asyncController(galleryItemController));
    app.get('/geo', asyncController(geoController));

    app.use('/previews', express.static(resolveByRoot('data/previews')));
    app.use('/original', express.static(path));

    return app;
}
