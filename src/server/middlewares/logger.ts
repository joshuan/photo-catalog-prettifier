import { NextFunction, Request, Response } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from '../services/logger.js';

const httpLogger = pinoHttp({
    logger,
});

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    httpLogger(req, res);
    next();
}
