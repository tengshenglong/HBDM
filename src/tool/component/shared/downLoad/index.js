import React, { Component } from "react";
import {Button,Col,message} from 'antd';
import Cookies from "js-cookie";

class DownLoad extends Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  download = () => {
    const date=new Date(this.props.endDate).getTime()-new Date(this.props.startDate).getTime();
    const days=Math.floor(date/(24*3600*1000));
    if(days>30){
      message.error("时间间隔不能大于30天");
      return;
    }
    //判断登陆状态
    if (!Cookies.get("username")) {
      window.location.href = "/login";
      return;
    }

    let api =this.props.downLoadUrl;
    window.location.href = api;
  };
  render(){
    return(
      <Col xl={this.props.spanSize===undefined ? 2 : this.props.spanSize} style={this.props.downStyle===undefined ? {marginLeft:-1.5,marginBottom:10} :this.props.downStyle}>
        <Button onClick={this.download} type="primary" icon="download">
          {this.props.buttonName}
        </Button>
      </Col>
    )
  }
}

export default DownLoad;