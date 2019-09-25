import React, { Component } from "react";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import TableOperator from "../../tool/component/shared/TableOperator";
import style from "./style.module.less";
import { Divider, message, Popconfirm, Table } from "antd";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      condition: "",
      flag: false,
      dataRecord: "",
      title: "",
      industryList: [], //产业数据
      industryOptions: [], //产业下拉框
      roleList: [], //角色数据
      roleOptions: [], //角色下拉框
      industrySelect: [], //产业选中数据
      searchIndustrySelect: ["全部"], //查询产业选中数据
      roleSelect: [], //角色选中数据
      searchRoleSelect: ["全部"], //角色选中数据
      treeData: [], //工贸网格树
      projectList: [], //模块列表
      jurisdiction: "", //权限条件搜索
      jurisdictionValue: ["S"], //权限条件搜索
      searchIndustry: "全部",
      searchRole: "0",
      userId: "",
      dataList: []
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    this.findAllIndustry();
    this.findAllRole();
    this.findAllRegionGrid();
    this.findAllProject();
  }

  /*
  查找所有模块
  */
  findAllProject = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}project/findAllProject`)
      .then(res => {
        if (res.flag) {
          this.setState({
            projectList: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  findAllIndustry = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}industry/getIndustrySelectList`)
      .then(res => {
        if (res.flag) {
          let arr = [];
          res.dataList
            .filter(it => "其他" !== it.industryName)
            .map(it => arr.push({ key: it.id, label: it.industryName }));
          this.setState(
            {
              industryList: res.dataList,
              industryOptions: arr
            },
            () => this.loadingUser()
          );
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  loadingUser = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    this.setState({
      loading: {
        spinning: true,
        size: "large"
      }
    });
    let url =
      `${Config.AUTHORITY_SERVICE}user/findAllUser?condition=${
        this.state.condition
      }&jurisdiction=${this.state.jurisdiction}&projectId=` +
      `&industry=${this.state.searchIndustry}&roleId=${this.state.searchRole}`;
    this.$axios
      .get(url)
      .then(res => {
        this.setState({
          loading: {
            spinning: false,
            size: "large"
          }
        });
        if (res.flag) {
          /*产业回显信息格式化*/
          let industryList = this.state.industryList;
          for (let i = 0; i < res.dataList.length; i++) {
            for (let j = 0; j < industryList.length; j++) {
              if (res.dataList[i].industry === "all") {
                res.dataList[i].industry = "全部";
              } else if (
                res.dataList[i].industry === industryList[j].id.toString()
              ) {
                res.dataList[i].industry = industryList[j].industryName;
              }
            }
          }
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

  //查询所有角色
  findAllRole = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}role/findAllRole`)
      .then(res => {
        if (res.flag) {
          let arr = [{ key: 0, label: "全部" }];
          res.dataList.map(it => arr.push({ key: it.id, label: it.name }));
          this.setState({
            roleList: res.dataList,
            roleOptions: arr
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  //查询所有工贸网格
  findAllRegionGrid = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}regionGrid/regionGridTree`)
      .then(res => {
        if (res.flag) {
          this.setState({
            treeData: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  handleConditionChange = e => {
    this.setState({
      condition: e.target.value
    });
  };

  handleIndustryChange = value => {
    this.setState({
      searchIndustry: value,
      searchIndustrySelect: [value]
    });
  };

  handleRoleChange = value => {
    this.setState({
      searchRole: value,
      searchRoleSelect: [value]
    });
  };

  handleJurisdictionChange = value => {
    this.setState({
      jurisdictionValue: value,
      jurisdiction: value.toString()
    });
  };

  searchPromotion = () => {
    this.loadingUser();
  };
  resetCondition = () => {
    this.setState(
      {
        condition: "",
        searchIndustry: "全部",
        searchIndustrySelect: ["全部"],
        searchRole: "0",
        searchRoleSelect: ["全部"],
        jurisdictionValue: ["S"],
        jurisdiction: ""
      },
      () => this.loadingUser()
    );
  };
  toShow = record => () => {
    if (record) {
      this.setState({
        title: "修改用户",
        userId: record.id
      });
    } else {
      this.setState({
        title: "新建用户",
        userId: ""
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
    if (loginStatus() === false) {
      return;
    }
    let url = `${Config.AUTHORITY_SERVICE}user/delUserById?id=${key}`;
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
  renderContent = () => {
    return (
      <FormContent
        handleCancel={this.cancel}
        handleSubmit={this.submit}
        content={this.state.dataRecord}
        industryList={this.state.industryList}
        roleList={this.state.roleList}
        projectList={this.state.projectList}
        treeData={this.state.treeData}
      />
    );
  };

  submit = values => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let params = new FormData();
    params.append("loginName", values.loginName);
    params.append("name", values.name);
    params.append("industry", values.industry);
    params.append("roleId", values.roleId);
    params.append("userId", this.state.userId);
    params.append("region", values.region);
    params.append("salt", values.salt);
    params.append("projectId", values.project);

    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}user/addOrUpdateUser`, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.loadingUser();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  render() {
    const columns = [
      {
        title: "登录账号",
        dataIndex: "loginName",
        align: "center",
        key: "loginName"
      },
      {
        title: "姓名",
        dataIndex: "name",
        align: "center",
        key: "name"
      },
      {
        title: "所属产业",
        align: "center",
        dataIndex: "industry",
        key: "industry"
      },
      {
        title: "所属角色",
        dataIndex: "roleList[0].name",
        align: "center",
        key: "invSorts"
      },
      {
        title: "拥有模块",
        dataIndex: "projectId",
        align: "center",
        key: "projectId"
      },
      {
        title: "拥有权限",
        dataIndex: "salt",
        align: "center",
        render: (text, record) => {
          text = text.replace("S", "查询");
          text = text.replace("W", "维护");
          text = text.replace("D", "下载");
          return <span>{text}</span>;
        }
      },
      {
        title: "创建日期",
        dataIndex: "registerDate",
        align: "center",
        key: "registerDate"
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

    const conditionConfig = [
      {
        label: "账号或姓名",
        type: "input",
        value: "name",
        options: null,
        // style: { width: 210 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          value: this.state.condition,
          onChange: this.handleConditionChange
        }
      },
      {
        label: "产业选择",
        type: "select",
        value: "ins",
        options: this.state.industryOptions,
        // style: { width: 190 },
        componentOptions: {
          placeholder: "选择产业",
          value: this.state.searchIndustrySelect,
          // style: { width: 100 },
          onChange: this.handleIndustryChange
        }
      },
      {
        label: "角色选择",
        type: "select",
        value: "role",
        options: this.state.roleOptions,
        // style: { width: 240 },
        componentOptions: {
          placeholder: "选择角色",
          value: this.state.searchRoleSelect,
          // style: { width: 150 },
          onChange: this.handleRoleChange
        }
      },
      {
        label: "权限选择",
        type: "select",
        value: "ins",
        options: [
          { key: "S", label: "查询权限" },
          { key: "W", label: "维护权限" },
          { key: "D", label: "下载权限" }
        ],
        style: { width: 400 },
        componentOptions: {
          placeholder: "权限选择",
          mode: "multiple",
          value: this.state.jurisdictionValue,
          style: { width: 310 },
          onChange: this.handleJurisdictionChange
        }
      }
    ];

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.searchPromotion}
          reset={this.resetCondition}
        />
        <section className={style["table-wrapper"]}>
          <TableOperator
            hasSearchBox={false}
            buttonName="新建用户"
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
            loading={this.state.loading}
            columns={columns}
            rowKey="loginName"
            bordered
            pagination={{ showSizeChanger: true }}
            // scroll={{ y: 400 }}
          />
        </section>
      </div>
    );
  }
}
