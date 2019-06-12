import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createHistory from 'history/createMemoryHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux'

import rootReducer from '../store/reducers/index.js';

const routerReducers = routerMiddleware(createHistory());//路由
// compose：前一个函数的调用结果是后一个参数的参数，即合并多个参数，按照顺序一次执行
// 在开发环境中使用redux-devtools-extension调试工具
const composeEnhancers = process.env.NODE_ENV=='development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const middleware = [ thunkMiddleware, routerReducers ];

/**
 * 用于创建Redux，Store
 * 传入初始状态参数
 *
 * 返回工厂函数，因为子服务器端渲染的时候，需要一个全新的Store示例来处理每个请求
 * */
let configureStore = (initialState) =>
  createStore(
    rootReducer,
    initialState, // preLoadState

    /**
     * enhancer
     * 传入此参数，createStore会返回enhancer(createStore)(reducer, preloadedState)的调用结果，这是常见高阶函数的调用方式
     * 在这个调用中enhancer接受createStore作为参数，对createStore的能力进行增强，并返回增强后的createStore。然后再将reducer
     * 和preloadedState作为参数传给增强后的createStore，最终得到生成的store
     * */
    composeEnhancers(applyMiddleware(...middleware)), // enhancer
  );

export default configureStore;
