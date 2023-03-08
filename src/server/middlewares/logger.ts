import { NextFunction, Request, Response } from 'express';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { logger } from '../logger.js';

const httpLogger = pinoHttp({
    logger,
    serializers: {
        err: pino.stdSerializers.err,
        req: () => {},
        res: () => {},
    },
    customSuccessMessage: function (req, res) {
        // @ts-ignore
        return `< ${req.method} ${req.originalUrl} - ${res.statusCode} ${res.statusMessage}`;
    },
    customReceivedMessage: function (req, res) {
        // @ts-ignore
        return `> ${req.method} ${req.originalUrl}`;
    },
});

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    httpLogger(req, res);
    next();
}
