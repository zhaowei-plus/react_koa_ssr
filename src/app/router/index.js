import React from 'react'
import { Route, Switch } from 'react-router-dom';
import  { ConnectedRouter }  from 'react-router-redux';
import routesConfig from './routes';

// 通过遍历路由数组
const Routers = ({ history }) => (
  // ConnectedRouter 用于合并Router的组件
  <ConnectedRouter history={history}>
    <Switch>
      {
        routesConfig.map( route => (
          /**
           * exact true 严格匹配， false 普通匹配
           *
           * thunk 实现后端获取数据后渲染的关键
           * */
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            component={route.component}
            // thunk={route.thunk}
          />
        ))
      }
    </Switch>
  </ConnectedRouter>
)

export default Routers;