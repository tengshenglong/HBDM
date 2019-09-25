/**
 * Create by tsl on 2019/3/13
 */
import React, { Component } from "react";
import { Layout, Icon, Select, message } from "antd";
import Cookies from "js-cookie";
import style from "./style.module.less";
import Bread from "../breadcrumb/CustomBread";
import Config from "../../common/Config";

const { Header } = Layout;
const { Option } = Select;


class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: Cookies.get("username") || "",
      projectID: Cookies.get("projectID") || "",
      projectIdList: JSON.parse(localStorage.projectIdList)
    };
  }

  handleCollapse = e => {
    e && e.preventDefault();
    this.props.onCollapse(!this.props.collapsed);
  };

  logout = () => {
    Cookies.remove("username", { path: "" });
    localStorage.removeItem("a");
    localStorage.projectName = "";
    window.location.href = "/login";
  };

  selectChange = (value, option) => {
    this.setState({ projectID: value }, () => {
      this.fetchSliderData(option);
    });
  };
  fetchSliderData = (option) => {
    let param = new FormData();
    param.append("username", escape(this.state.username));
    param.append("projectid", escape(this.state.projectID));
    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}login/select`, param)
      .then(res => {
        if (res.flag) {
          localStorage.a = JSON.stringify(res);
          localStorage.projectName = option.props.children;
          this.props.transmit(option.props.children);

        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        Promise.reject(error);
        // message.error(error.messageText);
      });
  };

  render() {
    return (
      <Header className={style.header}>
        <Icon
          className={style.icon}
          type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
          onClick={this.handleCollapse}
          style={{ float: "left", marginLeft: "-50px" }}
        />
        <Bread/>
        <div style={{ lineHeight: "48px", float: "left", marginLeft: "50px" }}>
          <span>模块：</span>
          <Select placeholder="选择模块"
                  style={{ width: 200 }}
                  onChange={this.selectChange}>
            {this.state.projectIdList.map((value, index) => {
              return (<Option value={value.projectId} key={index}>{value.projectName}</Option>);
            })}
          </Select>
        </div>
        <Icon
          className={style.icon}
          type="logout"
          onClick={this.logout}
          style={{ float: "right", marginRight: "-35px" }}
        />
        <div className={style.userName}>
          {/*<Icon type="user" onClick={this.toUser} />*/}
          <span>{`欢迎您, ${this.state.username}`}</span>
        </div>
      </Header>
    );
  }
}

export default CustomHeader;
