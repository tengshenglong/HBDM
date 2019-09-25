import React, { Component } from "react";
import { Breadcrumb } from "antd";

class CustomBread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentTag: "",
      childTag: ""
    };
  }

  componentWillMount() {
    setInterval(this.refreshBread, 100);
  }

  refreshBread = () => {
    let sliderList = [];
    if (localStorage.a) {
      sliderList = JSON.parse(localStorage.a).rs;
    } else {
      sliderList = [];
    }
    let hash = window.location.pathname;
    let parentId = "";
    sliderList.map(data => {
      if (data.url === hash) {
        this.setState({
          childTag: data.name
        });
        parentId = data.parentId;
      }
      return "";
    });
    sliderList.map(data => {
      if (data.id === parentId) {
        this.setState({
          parentTag: data.name
        });
      }
      return "";
    });
  };

  render() {
    return (
      <div style={{ float: "left", margin: "12px" }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">首页</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.parentTag}</Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.childTag}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}

export default CustomBread;
