import { NextFunction, Request, Response } from 'express';

export function asyncController(fn: (req: Request, res: Response, next: NextFunction) => void) {
    return async function asyncControllerWrapper(req: Request, res: Response, next: NextFunction) {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}
