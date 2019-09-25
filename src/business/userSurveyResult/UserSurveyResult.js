import React, { Component } from "react";
import { Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "../rejects/style.module.less";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

class UserSurveyResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      collapsed: false,
      openKeys: [],
      visible: false,
      dataList: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      telephone: "",
      address: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    this.getOrderInfos();
  }

  getOrderInfos = () => {
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
    let url = `${Config.CUSTOMER_SERVICE}UserSurveyResult/querySurveyResultUpDetail?currentPage=${
      this.state.currentPage
    }&pageSize=${this.state.pageSize}&telephone=${
      this.state.telephone
    }&address=${this.state.address}`;
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
          this.setState({
            dataList: res.dataList,
            total: res.totalElement
          });
        } else {
          message.error(res.message);
          this.setState({
            dataList: [],
            total: 0
          });
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

  pageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
        pageSize: pageSize
      },
      () => this.getOrderInfos()
    );
  };

  sizeChange = (current, pageSize) => {
    this.setState(
      {
        currentPage: 1,
        pageSize: pageSize
      },
      () => this.getOrderInfos()
    );
  };

  showTotalNum = (total, range) => <span>共 {total} 条</span>;

  searchByParams = () => {
    this.setState(
      {
        currentPage: 1
      },
      () => this.getOrderInfos()
    );
  };

  resetCondition = () => {
    this.setState(
      {
        currentPage: 1,
        partsCodes: "",
        telephone: "",
        address: ""
      },
      () => this.getOrderInfos()
    );
  };

  handleInputChange = e => {
    let id = e.target.id;
    if (id === "address") {
      this.setState({
        address: e.target.value
      });
    } else if (id === "telephone") {
      this.setState({
        telephone: e.target.value
      });
    }
  };

  // handleStatusChange = value => {
  //   this.setState({
  //     bxStatus: value
  //   });
  // };

  // handleDateChange = (date, dateString) => {
  //   this.setState({
  //     startDate: dateString[0],
  //     endDate: dateString[1]
  //   });
  // };

  render() {
    const {
      telephone,
      address
    } = this.state;

    const columns = [
      {
        title: "联系方式",
        dataIndex: "telephone",
        width: 60,
        align: "center",
        key: "telephone"
      },
      {
        title: "联系地址",
        dataIndex: "address",
        width: 80,
        align: "center",
        key: "address"
      },
      {
        title: "用户需要上门设计的家电",
        dataIndex: "result",
        width: 130,
        align: "center",
        key: "result"
      }
    ];

    const conditionConfig = [
      {
        label: "联系方式",
        type: "input",
        value: "telephone",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "telephone",
          value: telephone,
          onChange: this.handleInputChange
        }
      },
      {
        label: "联系地址",
        type: "input",
        value: "address",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "address",
          value: address,
          onChange: this.handleInputChange
        }
      }
    ];

    let uploadUrl = `${Config.ajaxUrl}${
      Config.CUSTOMER_SERVICE
    }UserSurveyResult/userSurveyResultExcelUp`;
    let templateDown = `${Config.ajaxUrl}${
      Config.CUSTOMER_SERVICE
    }UserSurveyResult/userSurveyResultMould`;

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.searchByParams}
          reset={this.resetCondition}
          isDownLoad
          isUpLoad
          uploadUrl={uploadUrl}
          downLoadUrl={templateDown}
        />
        <section className={style["table-wrapper"]}>
          <Table
            dataSource={this.state.dataList}
            loading={this.state.loading}
            columns={columns}
            rowKey="orderNo"
            bordered
            pagination={{
              pageSize: this.state.pageSize,
              current: this.state.currentPage,
              total: this.state.total,
              hideOnSinglePage: true,
              showSizeChanger: true,
              onShowSizeChange: this.sizeChange,
              showTotal: this.showTotalNum,
              onChange: this.pageChange
            }}
            scroll={{ x: 1000 }}
          />
        </section>
      </div>
    );
  }
}

export default UserSurveyResult;
