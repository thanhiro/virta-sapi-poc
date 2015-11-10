"use strict";
import Koa from 'koa';
import Router from 'koa-66';
import sql from 'mssql';
import JSONStream from 'streaming-json-stringify';

const app = new Koa();
const router = new Router();

const config = {
  user: '<user>',
  password: '<password>',
  server: '<ip>',
  database: '<db>',

  options: {
    encrypt: false
  }
};

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
  
  let conn = await sql.connect(config);
  let request = new sql.Request();
  request.stream = true;
  request.query('SELECT * FROM stuff');
    
  request.on('row', row => stream.write(row));
  request.on('error', err => console.log("error"));
  request.on('done', () => stream.end());
});

app
  .use(router.routes());

app.listen(8000);