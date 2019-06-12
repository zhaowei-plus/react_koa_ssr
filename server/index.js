const Koa = require('koa');

// 服务器端不渲染的类型
require('./ignore.js')();

// 导入 babel-polyfill 用于转换Es6的新API：Set，Map等
require('babel-polyfill');

// babel-register 将es6转换成es5
require('babel-register')({
  presets: [
    'env',
    'react',
    'stage-0',
  ],
  plugins: [
    "react-loadable/babel",
    'syntax-dynamic-import',
    "dynamic-import-node",
    "transform-decorators-legacy"
  ]
});

const app = new Koa();
// 路由匹配
const clientRouter = require('./clientRouter.js').default;
const port = 3002;

const staticCache = require("koa-static-cache"); // 静态资源缓存中间件
const path = require('path');
const cors = require('koa2-cors'); // 用于koa跨域请求
const Loadable = require('react-loadable'); // 按需加载

// 跨域请求
app.use(cors());
app.use(clientRouter);

app.use(staticCache(
  path.resolve(__dirname, '../dist'),{
    maxAge: 365 * 24 * 60 * 60,
    gzip:true
  }));

console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)

// 预加载完毕之后，监听端口
Loadable.preloadAll().then(() => {
  app.listen(port)
})


