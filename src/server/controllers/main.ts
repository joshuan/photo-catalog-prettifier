import { Request, Response } from 'express';

export function mainController(req: Request, res: Response) {
    res.redirect('/gallery');
}
