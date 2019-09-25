import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Select } from "antd";
const { Option } = Select;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
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
    const { content: record, showItem ,projectList} = this.props;

    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="菜单名称">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "请输入菜单名称"
              }
            ],
            initialValue: record.name ? record.name : ""
          })(<Input type="text" />)}
        </Form.Item>
        <Form.Item label="模块权限选择">
          {getFieldDecorator("project", {
            rules: [{ required: true, message: "请选择模块!" }],
            initialValue: record ? record.project.split(",") : []
          })(
            <Select placeholder="选择模块" mode="multiple">
              {projectList.map(values => (
                <Option key={values.projectId}>{values.projectName}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {showItem === "2" && (
          <Form.Item label="菜单路径">
            {getFieldDecorator("url", {
              rules: [
                {
                  required: true,
                  message: "请输入菜单路径"
                }
              ],
              initialValue: record.url ? record.url : ""
            })(<Input type="text" />)}
          </Form.Item>
        )}
        <Form.Item label="菜单位置">
          {getFieldDecorator("location", {
            rules: [
              {
                required: false,
                message: "请输入菜单位置"
              }
            ],
            initialValue: record.location ? record.location : ""
          })(<Input type="number" placeholder="请输入数字" />)}
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
