import React, { Component } from "react";
import { Form, Input, Select, Row, Col, Button } from "antd";

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
    const { content: record, industryList } = this.props;
    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="产品组CODE">
          {getFieldDecorator("invsortsCode", {
            rules: [
              {
                required: true,
                message: "请输入产品组CODE"
              }
            ],
            initialValue: record.invsortsCode ? record.invsortsCode : ""
          })(<Input />)}
        </Form.Item>
        <Form.Item label="产品组名称">
          {getFieldDecorator("invsortsName", {
            rules: [
              {
                required: false,
                message: "请输入产品组名称!"
              }
            ],
            initialValue: record.invsortsName ? record.invsortsName : ""
          })(<Input type="text" />)}
        </Form.Item>
        <Form.Item label="产业选择">
          {getFieldDecorator("industryId", {
            rules: [{ required: true, message: "请选择产业!" }],
            initialValue: record.industry ? record.industry.id : ""
          })(
            <Select placeholder="选择产业">
              {industryList.map(it => (
                <Option value={it.id}>{it.industryName}</Option>
              ))}
            </Select>
          )}
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
