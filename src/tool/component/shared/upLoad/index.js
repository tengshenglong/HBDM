import React, { Component } from "react";
import {Button,Col,message,Upload,
  Icon} from 'antd';
import Cookies from "js-cookie";

class UpLoad extends Component{
  constructor(props){
    super(props);
    this.state=({
      fileList: []
    });
  }

  excelUp = (info) => {
    //判断登陆状态
    if (!Cookies.get("username")) {
      window.location.href = "/login";
      return;
    }
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (info.file.status === 'error') {
        message.error("数据异常，请联系管理员！");
        return false;
      }
      if (file.response) {
        message.success(`${info.file.name} ${file.response.message}`);
        return file.response.status === 'success';
      }
      return true;
    });
    this.setState({fileList});
  };
  render(){
    let fileProps = {
      action: this.props.uploadUrl,
      onChange: this.excelUp,
      data:this.props.params ? this.props.params : {},
      multiple: true
    };
    return(
      <Col xl={this.props.spanSize === undefined ? 2 : this.props.spanSize} style={this.props.upStyle===undefined ? {} :this.props.upStyle}>
        <Upload {...fileProps} fileList={this.state.fileList} >
          <Button type="primary">
            <Icon type="upload"/>{this.props.buttonName}
          </Button>
        </Upload>
      </Col>
    )
  }
}

export default UpLoad;