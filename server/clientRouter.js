// 将服务端路由匹配到react路由的逻辑处理
import React from 'react';
import { renderToString } from 'react-dom/server';
import createHistory from 'history/createMemoryHistory'
import { getBundles } from 'react-loadable/webpack';
import stats from '../dist/react-loadable.json';
import Helmet from 'react-helmet';
import { matchPath } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import client from '../src/app/index.js';
import path from 'path';
import fs from 'fs'
let configureStore = client.configureStore;
let createApp = client.createApp;
let routesConfig = client.routesConfig;

// 重新定义 createStore 方法，调用 configureStore 创建 store
const createStore = (configureStore) => {
  let store = configureStore()
  return store;
}

const createTags = (modules) => {
  let bundles = getBundles(stats, modules);
  let scriptfiles = bundles.filter(bundle => bundle.file.endsWith('.js'));
  let stylefiles = bundles.filter(bundle => bundle.file.endsWith('.css'));
  let scripts=scriptfiles.map(script=>`<script src="/${script.file}"></script>`).join('\n');
  let styles=stylefiles.map(style=>`<link href="/${style.file}" rel="stylesheet"/>`).join('\n');
  return {scripts,styles}
}

const prepHTML = (data,{ html, head, rootString, scripts, styles, initState }) => {
  data=data.replace('<html',`<html ${html}`);
  data=data.replace('</head>',`${head} \n ${styles}</head>`);
  data=data.replace('<div id="root"></div>',`<div id="root">${rootString}</div>`);
  data=data.replace('<body>',`<body> \n <script>window.__INITIAL_STATE__ =${JSON.stringify(initState)}</script>`);
  data=data.replace('</body>',`${scripts}</body>`);
  return data;
}


const getMatch = ( routesArray, url) => {
  return routesArray.some(router =>
    matchPath(url, {
    path: router.path,
    exact: router.exact,
  }))
}

const makeup = (ctx, store, createApp, html) => {
  let initState = store.getState();
  let history = createHistory({
    initialEntries:[ctx.req.url]}
    );

  let modules = [];

  let rootString = renderToString(createApp({store,history,modules}));

  let {scripts,styles}=createTags(modules)

  const helmet=Helmet.renderStatic();
  let renderedHtml=prepHTML(html,{
    html:helmet.htmlAttributes.toString(),
    head:helmet.title.toString()+helmet.meta.toString()+helmet.link.toString(),
    rootString,
    scripts,
    styles,
    initState
  })
  return renderedHtml;
}

/**
 * 路由配置
 * */
const clientRouter = async(ctx, next) => {

  // 路由处理中间件

  // readFileSync 读取html文件内容
  let html = fs.readFileSync(
    path.join(
      path.resolve(__dirname,'../dist'),
      'index.html'),
    'utf-8');

  // 创建Redux  Store
  let store = createStore(configureStore);
  let pureRoutes = '';

  // 这段逻辑是用于修复路径上有问号和参数时的匹配bug
  if (ctx.req.url.indexOf('?') > 0) {
    pureRoutes = ctx.req.url.split("?")[0]
  } else {
    pureRoutes = ctx.req.url
  }

  console.log('pureRoutes:', pureRoutes);

  // 路由鉴权，查找 路由为 pureRoutes 的路由配置
  let branch = matchRoutes(routesConfig, pureRoutes)

  let promises = branch.map(({ route, match }) => {
    return route.thunk ? (route.thunk(store)) : Promise.resolve(null)
  });

  await Promise.all(promises).catch(err => console.log('err:---',err) );

  let isMatch = getMatch(routesConfig, pureRoutes);

  if (isMatch) {
    let renderedHtml = await makeup(ctx, store, createApp, html);
    ctx.body = renderedHtml
  }

  // 路由继续匹配
  await next()
}

export default clientRouter;

