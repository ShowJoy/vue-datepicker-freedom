var Koa = require('koa');
var app = new Koa();

app.use(ctx => {
  ctx.body = 'hello koa'
});

app.listen(3000);
