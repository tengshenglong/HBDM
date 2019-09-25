import axios from "axios";
import { message } from "antd";
import Config from "./Config";


/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      message.error("登录过期，请重新登录");
      // localStorage.removeItem("token");
      // store.commit('loginSuccess', null);
      setTimeout(() => {
        // toLogin();
      }, 1000);
      break;
    // 404请求不存在
    case 404:
      message.error("请求的资源不存在");
      break;
    default:
      message.error(other);
      console.log(other);
  }
};

//设置默认超时时间
axios.defaults.timeout = 10000;

// 添加请求拦截器
axios.interceptors.request.use(
  conf => {
    // 配置axios请求的url  ${config.ajaxUrl} 是配置的请求url统一前缀，配置好就不用重复写一样的url前缀了，只写后面不同的就可以了
    conf.url = `${Config.ajaxUrl}${conf.url}`;

    return conf;
  },
  error => {
    // 抛出请求错误信息
    Promise.reject(error.response);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;
    } else {
      message.error("请求数据发生错误，请联系技术人员");
    }
  },
  error => {
    // 请求失败处理
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit("changeNetwork", false);
      message.error("请求超时");
    }
  }
);

export default axios;
