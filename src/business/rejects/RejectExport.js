import React, { Component } from "react";
import { Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

class RejectExport extends Component {
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
      partsCodes: "",
      hrSku: "",
      bxStatus: 3,
      createDate: "",
      checkOrderNo: "",
      sparesStorage: "",
      startDate: "",
      endDate: ""
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
    let url = `${Config.CUSTOMER_SERVICE}upDetail/queryUpDetail?currentPage=${
      this.state.currentPage
    }&pageSize=${this.state.pageSize}&partsCodes=${
      this.state.partsCodes
    }&hrSku=${this.state.hrSku}&sparesStorage=${
      this.state.sparesStorage
    }&startDate=${this.state.startDate}&endDate=${
      this.state.endDate
    }&bxStatus=${this.state.bxStatus}`;
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
        hrSku: "",
        sparesStorage: "",
        startDate: "",
        endDate: ""
      },
      () => this.getOrderInfos()
    );
  };

  handleInputChange = e => {
    let id = e.target.id;
    if (id === "partsCodes") {
      this.setState({
        partsCodes: e.target.value
      });
    } else if (id === "hrSku") {
      this.setState({
        hrSku: e.target.value
      });
    } else if (id === "sparesStorage") {
      this.setState({
        sparesStorage: e.target.value
      });
    }
  };

  handleStatusChange = value => {
    this.setState({
      bxStatus: value
    });
  };

  handleDateChange = (date, dateString) => {
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    });
  };

  render() {
    const {
      partsCodes,
      hrSku,
      sparesStorage,
      bxStatus,
      startDate,
      endDate
    } = this.state;

    const columns = [
      {
        title: "备件条码",
        dataIndex: "partsCodes",
        width: 150,
        align: "center",
        key: "partsCodes"
      },
      {
        title: "入库时间",
        dataIndex: "entryStorageDate",
        width: 180,
        align: "center",
        key: "entryStorageDate",
        render: text =>
          text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      },
      {
        title: "SKU编号",
        dataIndex: "jdSku",
        width: 150,
        align: "center",
        key: "jdSku"
      },
      {
        title: "海尔物料",
        align: "center",
        width: 150,
        dataIndex: "hrSku",
        key: "hrSku"
      },
      {
        title: "备件库",
        align: "center",
        width: 200,
        dataIndex: "sparesStorage",
        key: "sparesStorage"
      },
      {
        title: "签收时间",
        dataIndex: "signDate",
        width: 180,
        align: "center",
        key: "signDate",
        render: text =>
          text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : "拒收"
      },
      {
        title: "申请时间",
        dataIndex: "applicationDate",
        width: 180,
        align: "center",
        key: "applicationDate",
        render: text =>
          text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      },
      {
        title: "机编",
        dataIndex: "machineCodes",
        width: 200,
        align: "center",
        key: "machineCodes"
      },
      {
        title: "商品名称",
        align: "center",
        width: 150,
        dataIndex: "goodName",
        key: "goodName",
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: "pointer"
            }
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: "故障描述",
        align: "center",
        width: 150,
        dataIndex: "errorMsg",
        key: "errorMsg",
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: "pointer"
            }
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        )
      },
      {
        title: "京东订单号",
        dataIndex: "jdOrderNum",
        width: 150,
        align: "center",
        key: "jdOrderNum"
      },
      {
        title: "京东商场编号",
        align: "center",
        width: 150,
        dataIndex: "jdMarketCode",
        key: "jdMarketCode"
      },
      {
        title: "导入时间",
        dataIndex: "createDate",
        align: "center",
        // width: 180,
        key: "createDate",
        render: text =>
          text ? (
            <span title={this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          ) : (
            ""
          )
      }
    ];

    const conditionConfig = [
      {
        label: "备件条码",
        type: "input",
        value: "partsCodes",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "partsCodes",
          value: partsCodes,
          onChange: this.handleInputChange
        }
      },
      {
        label: "海尔物料",
        type: "input",
        value: "hrSku",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "hrSku",
          value: hrSku,
          onChange: this.handleInputChange
        }
      },
      {
        label: "备件库",
        type: "input",
        value: "sparesStorage",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "sparesStorage",
          value: sparesStorage,
          onChange: this.handleInputChange
        }
      },
      {
        label: "保修状态",
        type: "select",
        value: "bxStatus",
        options: [
          { key: 3, label: "全部" },
          { key: 1, label: "已超期" },
          { key: 0, label: "未超期" }
        ],
        // style: { width: 200 },
        componentOptions: {
          value: bxStatus,
          // style: { width: 110 },
          onChange: this.handleStatusChange
        }
      },
      {
        label: "导入时间",
        type: "range",
        value: "hrSku",
        options: null,
        style: { width: 350 },
        componentOptions: {
          // style: { width: 120 },
          value:
            startDate && endDate
              ? [
                  this.$moment(startDate, "YYYY-MM-DD"),
                  this.$moment(endDate, "YYYY-MM-DD")
                ]
              : "",
          format: "YYYY-MM-DD",
          onChange: this.handleDateChange
        }
      }
    ];

    let uploadUrl = `${Config.ajaxUrl}${
      Config.CUSTOMER_SERVICE
    }pdTHExcel/pdTHExcelUp`;
    let templateDown = `${Config.ajaxUrl}${
      Config.CUSTOMER_SERVICE
    }pdTHExcel/mould`;

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
            scroll={{ x: 2300 }}
          />
        </section>
      </div>
    );
  }
}

export default RejectExport;
