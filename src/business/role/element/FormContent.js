import React, { Component } from "react";
import { Button, Col, Input, Row, Tree, Form } from "antd";
const { TreeNode } = Tree;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: []
    };
  }

  componentWillMount() {
    let arr = [];
    if (this.props.content) {
      this.props.content.resources.map(data => {
        if(data.id !== 1 && data.parentId !== 1){
          arr.push(data.id);
        }
        return "";
      });
    }

    this.setState({
      checkedKeys:arr
    });
  }

  onExpand = expandedKeys => {
    console.log("onExpand", expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
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
    const { content: record, treeData } = this.props;

    return (
      <Form {...formItemLayout} onSubmit={this.submit}>
        <Form.Item label="角色名称">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "请输入角色名称"
              }
            ],
            initialValue: record.name ? record.name : ""
          })(<Input />)}
        </Form.Item>
        <Form.Item label="角色描述">
          {getFieldDecorator("desc", {
            rules: [
              {
                required: false,
                message: "Please input your desc!"
              }
            ],
            initialValue: record.desc ? record.desc : ""
          })(<Input type="text" />)}
        </Form.Item>
        <Form.Item label="赋予权限">
          {getFieldDecorator("role", {
            rules: [
              {
                type: 'array',
                required: false,
                message: "请选择权限"
              }
            ],
            initialValue: this.state.checkedKeys
          })(
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
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
