import { Request, Response } from 'express';
import { Database } from '../services/database.js';

export function mainController(req: Request, res: Response) {
    const database = req.app.get('database') as Database;
    const list = database.getKeys();

    res.send(`<html><body>
        <div>
            ${list.map((file) => {
                const item = database.getItem(file);

                return `<div>
                    <p><b>${file}</b></p>
                    <p>Date: ${item.date}</p>
                    ${item.gps ? `<p>GPS: ${JSON.stringify(item.gps)}</p>` : ''}
                    <img src="${item.thumbnailUrl}" />
                </div>`;                
            }).join('\n')}
        </div>
    </body></html>`);
}
