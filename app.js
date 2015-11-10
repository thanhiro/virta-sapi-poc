"use strict";
import Koa from 'koa';
import Router from 'koa-66';
import JSONStream from 'streaming-json-stringify';
import {db, conn, sql} from './db';

const app = new Koa();
const router = new Router();

// middleware test with async func
router.use(async (ctx, next) => {
    console.log("begins");
    await next();
    console.log("ends");
});

// actual magix
router.get('/', async (ctx, next) => {
  ctx.type = 'json';
  let stream = ctx.body = JSONStream();

  await db; // check if connection pool is actually ready :(
  let request = new sql.Request(conn);
  request.stream = true;
  request.query('SELECT * FROM stuff');

  // event emit handlers
  request.on('recordset', rs => { /* nop */ });
  request.on('row', row => stream.write(row));
  request.on('error', err => console.log(err));
  request.on('done', () => stream.end());
});

app
  .use(router.routes());

app.listen(8000);