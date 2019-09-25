import React, { Component } from "react";
import TableOperator from "../../tool/component/shared/TableOperator";
import style from "./style.module.less";
import { Divider, Popconfirm, Table, message } from "antd";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

export default class RolePage extends Component {
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
      treeData: [],
      roleId: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    this.findAllRole();
    this.findAllResource();
  }

  //查询所有角色
  findAllRole = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}role/findAllRole`)
      .then(res => {
        if (res.flag) {
          this.setState({
            dataList: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  //查询所有菜单
  findAllResource = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}resource/findAllResource`)
      .then(res => {
        if (res.flag) {
          const treeData = [];
          res.dataList.map((num, index) => {
            if (num.parentId === 1) {
              let a = {
                title: num.name,
                key: num.id,
                children: []
              };
              res.dataList.map(data => {
                if (data.parentId === num.id) {
                  a.children.push({ title: data.name, key: data.id });
                }
                return "";
              });
              treeData.push(a);
            }
            return "";
          });
          this.setState({
            treeData: treeData
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  toShow = record => () => {
    if (record) {
      this.setState({
        title: "修改权限",
        roleId: record.id
      });
    } else {
      this.setState({
        title: "添加角色",
        roleId: ""
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
    let url = `${Config.AUTHORITY_SERVICE}role/delRoleById?id=${key}`;
    this.$axios
      .get(url)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          const dataSource = [...this.state.dataList];
          this.setState({
            dataList: dataSource.filter(item => item.id !== key)
          });
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
    console.log(values);
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    let params = new FormData();
    params.append("roleName", values.name);
    params.append("resourcesArray", values.role);
    params.append("roleId", this.state.roleId);

    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}role/addOrUpdateRole`, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.findAllRole();
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
        treeData={this.state.treeData}
      />
    );
  };
  render() {
    const { title, flag, dataList, loading } = this.state;

    const columns = [
      {
        title: "角色",
        dataIndex: "name",
        align: "center",
        key: "name"
        // render: (text, record, index) => {
        //   return index + 1;
        // }
      },
      {
        title: "角色描述",
        dataIndex: "desc",
        align: "center",
        key: "desc"
      },
      {
        title: "操作",
        dataIndex: "action",
        align: "center",
        key: "action",
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
            buttonName="添加角色"
            onButtonClick={this.toShow()}
          />
          <CustomModal
            title={title}
            flag={flag}
            handleContent={this.renderContent()}
            hide={this.cancel}
          />
          <Table
            dataSource={dataList}
            columns={columns}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ showSizeChanger: true }}
          />
        </section>
      </div>
    );
  }
}
