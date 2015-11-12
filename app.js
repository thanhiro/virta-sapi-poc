"use strict";
import Koa from 'koa';
import Router from 'koa-66';
import JSONStream from 'streaming-json-stringify';
import _ from 'highland';
import sql from 'mssql';
import {db} from './db';
import XMLStream from './xmlstream';

const app = new Koa();
const router = new Router();

async function write2stream(source, stream) {
    _(await source(), 'row')
        .errors(err => console.log(err))
        .pipe(stream);
}

async function query() {
    let request = await db.request();
    request.query('SELECT * FROM stuff');
    return request;
}

router.get('/', async (ctx, next) => ctx.body = "");
router.get('/json', async (ctx, next) => {
    ctx.type = 'json';
    let stream = ctx.body = JSONStream();
    write2stream(query, stream);
});
router.get('/xml', async (ctx, next) => {
    ctx.type = 'text';
    let stream = ctx.body = new XMLStream();
    write2stream(query, stream);
});

app.use(router.routes()).listen(8000);
