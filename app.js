"use strict";
import Koa from 'koa';
import Router from 'koa-66';
import JSONStream from 'streaming-json-stringify';
import _ from 'highland';
import sql from 'mssql';
import {db} from './db';

const app = new Koa();
const router = new Router();

async function query() {
    let request = await db.request();
    request.query('SELECT * FROM stuff');
    return request;
}

router.get('/', async (ctx, next) => { ctx.body = "" });
router.get('/json', async (ctx, next) => {
    ctx.type = 'json';
    let stream = ctx.body = JSONStream();

    _(await query(), 'row')
        .errors(err => console.log(err))
        .pipe(stream);
});

app.use(router.routes()).listen(8000);
