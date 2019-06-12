import React from 'react';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';

import Routers from './router/index';

// 根据环境，使用懒加载
const createApp = ({ store, history, modules}) => {
  console.log("modules:", modules);
  if(process.env.NODE_ENV === 'production'){
    /**
     * 只有在生产环境下才做懒加载
     * */
    return (
      <Loadable.Capture report={
        moduleName => modules.push(moduleName)}
      >
        <Provider store={store}>
          <Routers history={history} />
        </Provider>
      </Loadable.Capture>
    )
  }else{
    /**
     * @Redux Store与实图层的绑定利器：Provider Connect
     *
     * Provider组件提供容器，将组件和Redux记性关联，这样子组件才能使用 Connect 方法获取Store
     * */
    return (
      <Provider store={store}>
        <Routers history={history} />
      </Provider>
    )
  }
}

export default createApp;
