/**
 *  Created by tsl on 2019/3/13
 */
import React, { Component } from "react";
import { Button, Col, Form, Icon, Input, Row, message } from "antd";
import Cookies from "js-cookie";
import style from "./login.module.less";
import image from "../../asset/welcomeLogo.png";
import Texty from "rc-texty";
import QueueAnim from "rc-queue-anim";
import Config from "../../tool/common/Config";

const FormItem = Form.Item;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: Cookies.get("username") || "",
      password: "",
      redirect: "/",
      loading: false
    };
  }

  componentWillMount() {
    if (this.state.username) {
      this.props.history.push(this.state.redirect);
    }
    document.addEventListener("keydown", this.handleEnterKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEnterKey);
  }

  onInputChange(e) {
    let inputValue = e.target.value,
      inputName = e.target.name;
    this.setState({
      [inputName]: inputValue
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    let param = new FormData();
    param.append("username", escape(this.state.username));
    param.append("pwd", escape(this.state.password).replace(/\+/g, "%2B"));
    param.append("password", "admin");
    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}login`, param)
      .then(res => {
        this.setState({
          loading: false
        });
        if (res.flag) {
          const inFifteenMinutes = new Date(
            new Date().getTime() + 30 * 60 * 1000
          );
          Cookies.set("username", this.state.username, {
            expires: inFifteenMinutes,
            path: ""
          });
          localStorage.projectIdList = JSON.stringify(res.projectIdList);
          this.props.history.push(this.state.redirect);
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

  handleEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { captcha } = this.props;
    return (
      <div className={style["login-page"]}>
        <div className={style["login-bg"]}/>
        <div className={style["login-wrapper"]}>
          <QueueAnim duration={800} delay={150} type="bottom">
            <div className={style["login-box"]} key={1}>
              <div className={style["login-content"]}>
                <Form
                  onSubmit={this.handleSubmit}
                  className={style["login-form"]}
                >
                  <FormItem>
                    {getFieldDecorator("account", {
                      rules: [{ required: true, message: "请输入用户名" }]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="用户名"
                        name="username"
                        onChange={e => this.onInputChange(e)}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator("password", {
                      rules: [{ required: true, message: "请输入密码" }]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        suffix={
                          <Icon
                            type="eye"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        type="password"
                        name="password"
                        placeholder="密码"
                        onChange={e => this.onInputChange(e)}
                      />
                    )}
                  </FormItem>
                  {captcha && (
                    <FormItem>
                      <Row gutter={8}>
                        <Col span={16}>
                          {getFieldDecorator("captcha", {
                            rules: [{ required: true, message: "请输入验证码" }]
                          })(<Input placeholder="验证码"/>)}
                        </Col>
                        <Col span={8}>
                          <img
                            alt={"这是一个图片"}
                            className={style["login-captcha"]}
                            src={`data:image/svg+xml;utf8,${captcha}`}
                          />
                        </Col>
                      </Row>
                    </FormItem>
                  )}
                  <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.handleSubmit}
                      loading={this.state.loading}
                      className={style["login-form-button"]}
                    >
                      登录
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </QueueAnim>
          <div className={style["login-box-header"]}>
            <img src={image} alt={"这是一个图片"}/>
            <h2>
              <Texty>HBDM</Texty>
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
