import { createMemoryHistory, createHashHistory, createBrowserHistory } from '/Users/huanchen/Project/cs/chui/node_modules/@umijs/runtime/dist/index.js';

const options = {
  "basename": "/"
};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

let history = createBrowserHistory(options);
export const createHistory = () => {
  // 先注释了，加上后 HMR 后路由跳转功能会失效
  // history = createBrowserHistory(options);
  return history;
};
export { history };
