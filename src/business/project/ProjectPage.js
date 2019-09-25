import React, { Component } from "react";
import TableOperator from "../../tool/component/shared/TableOperator";
import style from "./style.module.less";
import { Divider, message, Popconfirm, Table } from "antd";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

export default class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      condition: {},
      flag: false,
      dataRecord: "",
      title: "",
      dataList: [],
      productId:""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    this.findAllProject();
  }

  /*
  查找所有模块
   */
  findAllProject = () => {
    this.setState({
      loading: {
        spinning: true,
        size: "large"
      }
    });
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}project/findAllProject`)
      .then(res => {
        this.setState({
          loading: {
            spinning: false,
            size: "large"
          }
        });
        if (res.flag) {
          this.setState({
            dataList: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        this.setState({
          loading: {
            spinning: false,
            size: "large"
          }
        });
        Promise.reject(error);
      });
  };



  toShow = record => () => {
    if (record) {
      this.setState({
        id: record.id,
        title: "修改模块"
      });
    } else {
      this.setState({
        id: "",
        title: "新增模块"
      });
    }
    let recorder = record ? record : "";
    this.setState({
      flag: true,
      dataRecord: recorder
    });
  };

  handleDelete = key => {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}project/delProjectById?id=${key}`)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.findAllProject();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  cancel = () => {
    this.setState({
      flag: false
    });
  };

  submit = values => {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    let params = new FormData();
    params.append("projectId", values.projectId);
    params.append("projectName", values.projectName);
    params.append("id", this.state.id);

    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}project/addOrUpdateProject`, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.findAllProject();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  renderContent = () => {
    return (
      <FormContent
        handleCancel={this.cancel}
        handleSubmit={this.submit}
        content={this.state.dataRecord}
      />
    );
  };
  render() {
    const columns = [
      {
        title: "模块名称",
        dataIndex: "projectName",
        align: "center",
        key: "projectName"
      },
      {
        title: "模块标识",
        dataIndex: "projectId",
        align: "center",
        key: "projectId"
      },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
        render: (text, record) => {
          return (
            <span>
              <a href=" #" onClick={this.toShow(record)}>
                修改
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除?"
                onConfirm={() => this.handleDelete(record.id)}
              >
                <a href=" #">删除</a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];

    return (
      <div>
        <section className={style["table-wrapper"]}>
          <TableOperator
            hasSearchBox={false}
            buttonName="添加模块"
            onButtonClick={this.toShow()}
          />
          <CustomModal
            title={this.state.title}
            flag={this.state.flag}
            handleContent={this.renderContent()}
            hide={this.cancel}
          />
          <Table
            dataSource={this.state.dataList}
            columns={columns}
            // scroll={{ x: 1366 }}
            rowKey="id"
          />
        </section>
      </div>
    );
  }
}
