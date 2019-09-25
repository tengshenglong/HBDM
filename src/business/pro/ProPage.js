import React, { Component } from "react";
import TableOperator from "../../tool/component/shared/TableOperator";
import style from "./style.module.less";
import { Divider, message, Popconfirm, Table } from "antd";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

export default class ProPage extends Component {
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
      industryList: [], //产业数据
      dataList: [],
      productId: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    this.findAllProducts();
    this.findAllIndustry();
  }

  /*
  查找所有产品组
   */
  findAllProducts = () => {
    this.setState({
      loading: {
        spinning: true,
        size: "large"
      }
    });
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}invsorts/findAllInvsorts`)
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

  /*
  查找所有产业信息
   */
  findAllIndustry = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}industry/findAllIndustry`)
      .then(res => {
        if (res.flag) {
          this.setState({
            industryList: res.dataList
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
        productId: record.id,
        title: "修改产品组"
      });
    } else {
      this.setState({
        productId: "",
        title: "新增产品组"
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

    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}invsorts/delInvsortsById?id=${key}`)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.findAllProducts();
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
    if (loginStatus() === false) {
      return;
    }

    const { productId } = this.state;

    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}invsorts/addOrUpdateInvsorts?
      industryId=${values.industryId}&invsortsName=${values.invsortsName}
      &invsortsCode=${values.invsortsCode}&invsortsId=${productId}`)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.findAllProducts();
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
        industryList={this.state.industryList}
      />
    );
  };

  render() {
    const columns = [
      {
        title: "产品组CODE",
        dataIndex: "invsortsCode",
        align: "center",
        key: "invsortsCode"
      },
      {
        title: "产品组名称",
        dataIndex: "invsortsName",
        align: "center",
        key: "industryName"
      },
      {
        title: "所属产业",
        dataIndex: "industry.industryName",
        align: "center",
        key: "industryindustryName"
      },
      {
        title: "日期",
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
              <Divider type="vertical"/>
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
            buttonName="添加产品组"
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
