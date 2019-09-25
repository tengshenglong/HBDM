import React, { Component } from "react";
import styles from "./style.module.less";
import { loginStatus } from "../common/loginStatus";

class WelcomePage extends Component {

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }
  }

  render() {
    return (
      <div className={styles.bg}>
        <div className={styles.content}>
          <div>
            <img src={require("../../asset/welcomeLogo.png")} alt="" />
          </div>
          <div className={styles.font}>HBDM报表管理系统</div>
        </div>
      </div>
    );
  }
}
export default WelcomePage;
