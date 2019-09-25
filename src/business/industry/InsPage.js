import React, { Component } from "react";
import TableOperator from "../../tool/component/shared/TableOperator";
import style from "./style.module.less";
import { Divider, message, Popconfirm, Table } from "antd";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Cookies from "js-cookie";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

export default class InsPage extends Component {
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
      industryId: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    this.findAllIndustry();
  }

  findAllIndustry = () => {
    this.setState({
      loading: {
        spinning: true,
        size: "large"
      }
    });
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}industry/findAllIndustry`)
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
        industryId: record.id,
        title: "修改产业"
      });
    } else {
      this.setState({
        industryId: "",
        title: "添加产业"
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
    if (!Cookies.get("username")) {
      window.location.href = "/login";
      return;
    }

    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}industry/delIndustryById?id=${key}`)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.findAllIndustry();
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
    if (!Cookies.get("username")) {
      window.location.href = "/login";
      return;
    }

    const { industryId } = this.state;
    let params = new FormData();
    params.append("industryId", industryId);
    params.append("industryName", values.industryName);

    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}industry/addOrUpdateIndustry`, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.findAllIndustry();
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

  handleCancelPro = record => {
    //判断登陆状态
    if (!Cookies.get("username")) {
      window.location.href = "/login";
      return;
    }
    if (record.invsortsName === null) {
      record.invsortsName = "";
    }

    this.$axios
      .get(
        `${Config.AUTHORITY_SERVICE}invsorts/addOrUpdateInvsorts?invsortsName=${
          record.invsortsName
        }&invsortsCode=${record.invsortsCode}&invsortsId=${
          record.id
        }&industryId=`
      )
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.findAllIndustry();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  expandedRowRender = (expanded, record) => {
    const columns = [
      { title: "产品组CODE", dataIndex: "invsortsCode", align: "center" },
      { title: "产品组名称", dataIndex: "invsortsName", align: "center" },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="是否取消关联该产品组？"
                onConfirm={() => this.handleCancelPro(record)}
              >
                <a href=" #">取消关联</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <Table
        columns={columns}
        dataSource={expanded.invsortsList}
        pagination={false}
        showHeader={true}
      />
    );
  };

  render() {
    const columns = [
      {
        title: "产业名称",
        dataIndex: "industryName",
        align: "center",
        key: "industryName"
      },
      {
        title: "创建日期",
        dataIndex: "createDate",
        align: "center",
        key: "createDate"
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
                title="删除产业将会删除所属产品组！是否继续？"
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
            buttonName="添加产业"
            onButtonClick={this.toShow()}
          />
          <CustomModal
            title={this.state.title}
            flag={this.state.flag}
            handleContent={this.renderContent()}
            hide={this.cancel}
          />
          <Table
            loading={this.state.loading}
            className="components-table-demo-nested"
            dataSource={this.state.dataList}
            columns={columns}
            rowKey="industryName"
            expandedRowRender={this.expandedRowRender}
          />
        </section>
      </div>
    );
  }
}
