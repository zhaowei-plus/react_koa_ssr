import configureStore from './configureStore';
import createApp from './createApp';
import routesConfig from './router/routes';

// 提取公用接口，客户端、服务端都可用
export default { configureStore, createApp, routesConfig }