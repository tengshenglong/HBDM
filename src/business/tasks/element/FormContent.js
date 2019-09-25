import React, { Component } from "react";
import { Form, Input, Row, Col, Button } from "antd";

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

    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="类路径">
          {getFieldDecorator("jobClassName", {
            rules: [
              {
                required: true,
                message: "请输入类路径"
              }
            ],
            initialValue: record.jobClassName ? record.jobClassName : ""
          })(<Input disabled={!!record.jobClassName} />)}
        </Form.Item>
        <Form.Item label="分组名称">
          {getFieldDecorator("jobGroupName", {
            rules: [
              {
                required: true,
                message: "请输入分组名称"
              }
            ],
            initialValue: record.triggerGroup ? record.triggerGroup : ""
          })(<Input disabled={!!record.triggerGroup} />)}
        </Form.Item>
        <Form.Item label="CRON表达式">
          {getFieldDecorator("cronExpression", {
            rules: [
              {
                required: true,
                message: "请输入CRON表达式"
              }
            ],
            initialValue: record.timeZoneId ? record.timeZoneId : ""
          })(<Input />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator("jobDescription", {
            rules: [
              {
                required: true,
                message: "请输入描述信息"
              }
            ],
            initialValue: record.description ? record.description : ""
          })(<Input />)}
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
