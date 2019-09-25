import React, { Component } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  TreeSelect
} from "antd";

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const plainOptions = [
  { label: "维护权限（维护按钮，上传，模版下载，删除）", value: "W" },
  { label: "数据下载权限", value: "D" }
];

class RegistrationForm extends Component {
  state = {};

  submit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
    // this.props.handleCancel();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 2
        },
        sm: {
          span: 10,
          offset: 8
        }
      }
    };
    const record = this.props.content;
    const { industryList, roleList, treeData, projectList } = this.props;
    const tProps = {
      treeData,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: "请选择网格工贸",

      dropdownStyle: {
        height: 400
      }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="账户名称">
          {getFieldDecorator("loginName", {
            rules: [
              {
                required: true,
                message: "请输入账户名称"
              }
            ],
            initialValue: record.loginName ? record.loginName : ""
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="姓名">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your name!"
              }
            ],
            initialValue: record.name ? record.name : ""
          })(<Input type="text"/>)}
        </Form.Item>
        <Form.Item label="产业选择">
          {getFieldDecorator("industry", {
            rules: [{ required: true, message: "请选择产业!" }],
            initialValue: record.industry ? record.industry : ""
          })(
            <Select placeholder="选择产业">
              {industryList.map(values =>
                values.industryName !== "其他" ? (
                  <Option value={values.id}>{values.industryName}</Option>
                ) : (
                  ""
                )
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="角色选择">
          {getFieldDecorator("roleId", {
            rules: [{ required: true, message: "请选择角色!" }],
            initialValue: record ? record.roleList[0].id : ""
          })(
            <Select placeholder="选择角色">
              {roleList.map(values => (
                <Option value={values.id}>{values.name}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="模块权限选择">
          {getFieldDecorator("project", {
            rules: [{ required: true, message: "请选择模块!" }],
            initialValue: record ? record.projectId.split(",") : []
          })(
            <Select placeholder="选择模块" mode="multiple">
              {projectList.map(values => (
                <Option key={values.projectId}>{values.projectName}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="工贸权限选择">
          {getFieldDecorator("region", {
            rules: [
              { required: true, message: "请选择工贸权限", type: "array" }
            ],
            initialValue: record.treeNodeList ? record.treeNodeList : []
          })(<TreeSelect {...tProps} />)}
        </Form.Item>

        <Form.Item label="操作权限设置">
          {getFieldDecorator("salt", {
            initialValue: record.salt ? record.salt.toString().split(",") : []
          })(<CheckboxGroup options={plainOptions}/>)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Row>
            <Col span={12}>
              <Button onClick={this.props.handleCancel}>取消</Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  RegistrationForm
);
export default WrappedRegistrationForm;
