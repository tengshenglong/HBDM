/**
 * Create by tsl on 2019/3/13
 */
import React, { Component } from "react";
import { Layout, Icon, Menu } from "antd";
import styles from "./style.module.less";
import { Link } from "react-router-dom";
// import image from "../../../asset/welcomeLogo.png";

const { SubMenu } = Menu;
const { Sider } = Layout;

class CustomSider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: []
    };
  }

  componentWillMount() {
  }

  onOpenChange = openKeys => {
    this.setState({ openKeys: [openKeys[openKeys.length - 1]] });
  };

  render() {
    let loginStatus = [];
    if (localStorage.a) {
      loginStatus = JSON.parse(localStorage.a).rs;
    } else {
      loginStatus = [];
    }
    return (
      <Sider
        theme="light"
        collapsed={this.props.collapsed}
        style={{ height: "100%" }}
        trigger={null}
        collapsible
        breakpoint="lg"
        width={200}
        className={styles.sider}
      >
        <div className={styles.logo} id="logo">
          <h1>{this.props.projectName}</h1>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
        >
          {loginStatus.map(num => {
            if (num.parentId === 1) {
              return (
                <SubMenu
                  key={num.id}
                  title={
                    <span>
                      <Icon type="inbox"/>
                      <span>{num.name}</span>
                    </span>
                  }
                >
                  {loginStatus.map(data => {
                    if (data.parentId === num.id) {
                      return (
                        <Menu.Item key={data.id}>
                          <Link to={data.url}>{data.name}</Link>
                        </Menu.Item>
                      );
                    }
                    return "";
                  })}
                </SubMenu>
              );
            }
            return "";
          })}
        </Menu>
      </Sider>
    );
  }
}

export default CustomSider;
