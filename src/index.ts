import Api from '@xygengcn/koa-api';
import path from 'path';
import Doc from './core';

const api = new Api({
    controllerPath: path.join(__dirname, '../node_modules/@xygengcn/koa-api/dist/controller'),
    error: {
        message: {
            notFound: 'hahah'
        }
    }
});

api.run(Doc({ path: path.join(__dirname, '../docs'), docsify: true }));
