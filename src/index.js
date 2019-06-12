import React from 'react';
import { hydrate, render } from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import Loadable from 'react-loadable';
import app from './app/index.js';

const initialState = window && window.__INITIAL_STATE__;
console.log('initialState:', initialState);

let history = createHistory()
let { configureStore, createApp } = app;

// 客户端 store
let store = configureStore(initialState)

const renderApp = () => {
  // 预加载完毕之后渲染组件
  Loadable.preloadReady()
    .then(() => {
      let application = createApp({ store, history});
      // 当服务端渲染和客户端首次渲染完全一致的情况下，可以使用hydrate代替render
      hydrate(application, document.getElementById('root'));
    });
}

renderApp();

// webpack-dev-server HMR配置
if(process.env.NODE_ENV === 'development'){
  if (module.hot) {
    // 当 reducers 更新时，重新加载
    module.hot.accept('./store/reducers/index.js', () => {
      let newReducer = require('./store/reducers/index.js');
      store.replaceReducer(newReducer)
    })

    module.hot.accept('./app/index.js', () => {
      let { createApp } = require('./app/index.js');

      let newReducer = require('./store/reducers/index.js');
      // 当文件发生改变时，更新reducer
      store.replaceReducer(newReducer)
      let application = createApp({store, history});

      /**
       * hydrate React16版本专门为服务器渲染新增加的APi，在render基础上实现了对服务端渲染内容的最大可重用，实现静态DOM到动态Nodes的过程
       * */
      hydrate(application,document.getElementById('root'));

    })
  }
}



