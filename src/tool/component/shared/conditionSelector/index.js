import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Cascader,
  Select,
  Icon,
  message,
  InputNumber,
  Upload
} from "antd";
import styles from "./style.module.less";
import { isEmpty } from "lodash";
import { loginStatus } from "../../../common/loginStatus";

const { RangePicker } = DatePicker;

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      fileList: []
    };
  }

  componentSelector = component => {
    if (isEmpty(component.type)) {
      return null;
    }
    const { componentOptions: config } = component;
    const { style = {} } = config;
    switch (component.type.toLowerCase()) {
      case "date":
        return <DatePicker {...config} size="small" style={{ width: 160, ...style }} />;
      case "cascader":
        return <Cascader {...config} size="small" style={{ width: 160, ...style }} />;
      case "range":
        return <RangePicker {...config} size="small" style={{ width: 260, ...style }} />;
      case "select":
        return (
          <Select style={{ width: 160, ...style }} size="small" {...config}>
            {component.options.map((o, index) => {
              return (
                <Select.Option key={index} value={o.key}>
                  {o.label}
                </Select.Option>
              );
            })}
          </Select>
        );
      default:
        return <Input {...config} size="small" style={{ width: 160, ...style }} />;
    }
  };

  handleSubmit = () => {
    this.props.onSubmit();
  };

  handleReset = () => {
    this.props.reset();
  };

  handleCustomBtn = () => {
    this.props.customBtnClick();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleDownLoad = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let api = this.props.downLoadUrl;
    window.location.href = api;
  };

  excelUp = info => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (info.file.status === "error") {
        message.error("数据异常，请联系管理员！");
        return false;
      }
      if (file.response) {
        message.success(`${info.file.name} ${file.response.message}`);
        return file.response.status === "success";
      }
      return true;
    });
    this.setState({ fileList });
  };

  handleExport = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    if (this.props.startDate === "" || this.props.endDate === "") {
      message.error("请先选择时间");
      return;
    }
    let api = this.props.exportUrl;

    function GetQueryString(name) {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var str=api.split('?');
      var r = str[1].substr(1).match(reg);//search,查询？后面的参数，并匹配正则
      if(r!=null)return  unescape(r[2]); return null;
    }
    if(GetQueryString('sizes')&&GetQueryString('pages')){
      if(GetQueryString('sizes')-GetQueryString('pages')>9999){
        message.error("条数不能大于一万");
        return;
      }
    }
    window.location.href = api;
  };
  onChange=(value,data) =>{
    this.props.receiveData({[value]:data})
  };
  render() {
    let fileProps = {
      action: this.props.uploadUrl,
      onChange: this.excelUp,
      data: this.props.params ? this.props.params : {},
      multiple: true
    };
    // const { getFieldDecorator } = this.props.form;
    const {
      isExport,
      isDownLoad,
      isUpLoad,
      isExpand,
      isCustom,
      customName,
      conditions,
      isRange
    } = this.props;
    const { expand, fileList } = this.state;
    return (
      <section className={styles["search-bar"]}>
        <Form layout="inline">
          <section className={styles["search-items"]}>
            {!isExpand &&
              conditions.map((d, index) => {
                const { style = {}, className } = d;
                return (
                  <Form.Item
                    key={index}
                    label={d.label}
                    style={style}
                    className={className}
                  >
                    {this.componentSelector(d)}
                  </Form.Item>
                );
              })}
            {isExpand &&
              expand &&
              conditions.map((d, index) => {
                const { style = {}, className } = d;
                return (
                  <Form.Item
                    key={index}
                    label={d.label}
                    style={style}
                    className={className}
                  >
                    {this.componentSelector(d)}
                  </Form.Item>
                );
              })}
            {isExpand &&
              !expand &&
              conditions.slice(0, 3).map((d, index) => {
                const { style = {}, className } = d;
                return (
                  <Form.Item
                    key={index}
                    label={d.label}
                    style={style}
                    className={className}
                  >
                    {this.componentSelector(d)}
                  </Form.Item>
                );
              })}
          </section>

          <section className={styles["search-btns"]}>
            <Form.Item>
              {isCustom ? (
                <Button
                  type="primary"
                  icon="add"
                  style={{ marginRight: 16 }}
                  onClick={this.handleCustomBtn}
                >
                  {customName}
                </Button>
              ) : null}
              {isDownLoad ? (
                <Button
                  type="primary"
                  icon="download"
                  style={{ marginRight: 16 }}
                  onClick={this.handleDownLoad}
                >
                  下载模板
                </Button>
              ) : null}
              {isUpLoad ? (
                <Upload {...fileProps} fileList={fileList}>
                  <Button
                    type="primary"
                    icon="upload"
                    style={{ marginRight: 16 }}
                    // onClick={this.handleUpLoad}
                  >
                    上传
                  </Button>
                </Upload>
              ) : null}
              {isExport ? (
                <Button
                  type="primary"
                  icon="download"
                  onClick={this.handleExport}
                >
                  导出
                </Button>
              ) : null}
              {isRange ? (
                <span style={{marginLeft:20}}>
                  <span>导出范围：</span>
                  <InputNumber min={1}  defaultValue={1} onChange={this.onChange.bind(this,'pages')}/>
                  <span style={{marginLeft:5,marginRight:5}}>--</span>
                  <InputNumber min={1}  defaultValue={10000} onChange={this.onChange.bind(this,'sizes')}/>
                </span>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                key="submit"
                htmlType="submit"
              >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>

              {isExpand && (
                <a
                  href=" #"
                  style={{ marginLeft: 8, fontSize: 14 }}
                  onClick={this.toggle}
                >
                  {expand ? "收起" : "展开"}
                  <Icon type={expand ? "up" : "down"} />
                </a>
              )}
            </Form.Item>
          </section>
        </Form>
      </section>
    );
  }
}
