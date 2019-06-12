import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading'

// 动态加载
const LoadableHome = Loadable({
  loader: () => import('./userPage'),
  loading: Loading,
});

// 导出路由配置信息
const HomeRouter = {
  path: '/user',
  component: LoadableHome,
  thunk: homeThunk // 服务端渲染会开启并执行这个action，用于获取页面渲染所需数据
}

export default HomeRouter