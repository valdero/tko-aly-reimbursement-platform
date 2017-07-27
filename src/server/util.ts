import { Request, RequestHandler } from 'express';
import Bluebird = require('bluebird');

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export const jsonEndpoint = (dataGetter: (req: Request) => Bluebird<any>): RequestHandler =>
    (req, res, next) => dataGetter(req).tap(data => res.json(data)).catch(next);
