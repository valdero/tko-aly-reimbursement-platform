import * as path from 'path';
import moduleAlias = require('module-alias');

moduleAlias.addAliases({
    server: path.resolve('./dist/src/server'),
    client: path.resolve('./dist/src/client'),
    common: path.resolve('./dist/src/common'),
});

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import { config } from './config';
import { NotFoundError } from 'server/util';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('etag', false);

// static files
const staticOptions = { index: false };
app.use(express.static(config.publicDir, staticOptions));

app.use('/', (req, res) => {
    res.json('Hello world!');
});

// route not found
app.use((req, res) => {
    res.sendStatus(404);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        console.log('Not found');
        res.sendStatus(404);
    } else {
        console.error(err.stack);
        res.status(500).send(err);
    }
});

const server = app.listen(config.port, () => {
    const { port } = server.address();
    console.log(`Listening at http://localhost:${port} ..`);
});
