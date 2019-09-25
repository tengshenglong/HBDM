import React, { Component } from "react";
import { Modal } from "antd";

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  handleCancel = () => {
    this.props.hide();
  };
  render() {
    const { title, flag, handleContent,customWidth } = this.props;
    return (
      <Modal
        title={title}
        visible={flag}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        footer={null}
        centered={true}
        width={customWidth ? customWidth : 520}
        // closable={false}
      >
        {handleContent}
      </Modal>
    );
  }
}

export default CustomModal;
