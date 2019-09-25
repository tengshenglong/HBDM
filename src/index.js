import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { LocaleProvider } from "antd";
import App from "./App";
import axios from "./tool/common/axios";
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import './asset/styles/common.less';

moment.locale("zh-cn");

//挂载组件
React.Component.prototype.$moment = moment;
React.Component.prototype.$axios = axios;

const Index = () => {
  return (
    <Router>
      <LocaleProvider locale={zhCN}>
        <App/>
      </LocaleProvider>
    </Router>
  );
};

ReactDOM.render(<Index/>, document.getElementById("root"));
