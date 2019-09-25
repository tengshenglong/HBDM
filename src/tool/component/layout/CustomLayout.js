/**
 * Create by tsl on 2019/3/13.
 */
import React, { Component } from "react";
import { Layout } from "antd";
import styles from "./style.module.less";
import Header from "../header/CustomHeader";
import Sider from "../menu/CustomSider";
import Routes from "../../common/Routes";
import QueueAnim from "rc-queue-anim";
import { loginStatus } from "../../common/loginStatus";

const { Content } = Layout;

class CustomLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      openKeys: [],
      projectName: localStorage.projectName || ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  handleCollapse = collapsed => {
    this.setState({ collapsed: collapsed });
  };
  transmitProjectName = (projectName) => {
    this.setState({
      projectName
    });
  };

  render() {
    return (
      <Layout>
        <Sider collapsed={this.state.collapsed} projectName={this.state.projectName}/>
        <Layout>
          <Header
            collapsed={this.state.collapsed}
            onCollapse={this.handleCollapse}
            transmit={this.transmitProjectName.bind(this)}
          />
          <Content className={styles.content}>
            <QueueAnim duration={500} delay={250} type="right">
              <Routes key={1}/>
            </QueueAnim>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default CustomLayout;
