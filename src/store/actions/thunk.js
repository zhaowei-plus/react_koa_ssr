import { getHomeInfo } from './home';

// 异步请求
export const homeThunk = store =>
  store.dispatch(getHomeInfo())

