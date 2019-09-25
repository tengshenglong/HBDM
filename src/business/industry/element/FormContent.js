import React, { Component } from "react";
import { Button, Col, Input, Row, Form } from "antd";

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
    const { content: record } = this.props;

    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="产业名称">
          {getFieldDecorator("industryName", {
            rules: [
              {
                required: true,
                message: "请输入产业名称"
              }
            ],
            initialValue: record.industryName ? record.industryName : ""
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
