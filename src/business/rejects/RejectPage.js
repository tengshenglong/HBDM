import React, { Component } from "react";
import { Drawer, Table, message } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import DrawerContent from "./element/DrawerContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

class RejectPage extends Component {
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
      startDate: "",
      endDate: "",
      hbdmRowId: "",
      returnNumber: "",
      bstkde38: "",
      checkOrderNo: "",
      orderNo: "", //京东订单号
      partsCodes: "", //备件条码
      detailStatus: 0, //状态
      hrSku: "", //单机物料号
      jdSku: "", //京东SKU编码
      sparesStorage: "" //备件库
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
    const {
      orderNo,
      partsCodes,
      detailStatus,
      hrSku,
      jdSku,
      sparesStorage,
      currentPage,
      startDate,
      endDate,
      hbdmRowId,
      returnNumber,
      bstkde38,
      pageSize
    } = this.state;
    let url = `${
      Config.CUSTOMER_SERVICE
    }hccRejects/showRejects?currentPage=${currentPage}&pageSize=${pageSize}&jdOrderNum=${orderNo}
    &partsCodes=${partsCodes}&detailStatus=${detailStatus}&hrSku=${hrSku}&jdSku=${jdSku}
    &sparesStorage=${sparesStorage}&startDate=${startDate}&endDate=${endDate}
    &hbdmRowId=${hbdmRowId}&returnNumber=${returnNumber}&bstkde38=${bstkde38}`;
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

  showDrawer = key => {
    this.setState({
      visible: true,
      checkOrderNo: key
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      checkOrderNo: ""
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
        orderNo: "",
        partsCodes: "",
        detailStatus: 0,
        hrSku: "",
        jdSku: "",
        startDate: "",
        endDate: "",
        hbdmRowId: "",
        returnNumber: "",
        bstkde38: "",
        sparesStorage: ""
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
    } else if (id === "jdSku") {
      this.setState({
        jdSku: e.target.value
      });
    } else if (id === "orderNo") {
      this.setState({
        orderNo: e.target.value
      });
    } else if (id === "sparesStorage") {
      this.setState({
        sparesStorage: e.target.value
      });
    } else if (id === "hbdmRowId") {
      this.setState({
        hbdmRowId: e.target.value
      });
    } else if (id === "returnNumber") {
      this.setState({
        returnNumber: e.target.value
      });
    } else if (id === "bstkde38") {
      this.setState({
        bstkde38: e.target.value
      });
    }
  };

  handleStatusChange = value => {
    this.setState({
      detailStatus: value
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
      orderNo,
      partsCodes,
      detailStatus,
      hrSku,
      jdSku,
      startDate,
      endDate,
      hbdmRowId,
      returnNumber,
      bstkde38,
      sparesStorage
    } = this.state;

    const columns = [
      {
        title: "套/单机单号",
        dataIndex: "hbdmRowId",
        align: "center",
        key: "hbdmRowId",
        render: text => (
          <a href=" # " onClick={() => this.showDrawer(text)}>
            {text}
          </a>
        )
      },
      {
        title: "备件条码",
        dataIndex: "partsCodes",
        align: "center",
        key: "partsCodes"
      },
      {
        title: "单机物料号",
        dataIndex: "hrSku",
        align: "center",
        key: "hrSku"
      },
      {
        title: "京东SKU",
        dataIndex: "jdSku",
        align: "center",
        key: "jdSku"
      },
      {
        title: "京东订单号",
        dataIndex: "jdOrderNum",
        align: "center",
        key: "jdOrderNum"
      },
      {
        title: "备件库",
        align: "center",
        dataIndex: "sparesStorage",
        key: "sparesStorage"
      },
      {
        title: "状态",
        dataIndex: "detailStatus",
        align: "center",
        key: "detailStatus",
        render: text =>
          text === 1 ? (
            <span>导入未处理</span>
          ) : text === 2 ? (
            <span>请求HCC成功</span>
          ) : text === 3 ? (
            <span>请求HCC失败</span>
          ) : text === 4 ? (
            <span>接收HCC鉴定信息</span>
          ) : text === 5 ? (
            <span>接收HCC换箱结果</span>
          ) : text === 6 ? (
            <span>接收HCC负提单信息</span>
          ) : text === 7 ? (
            <span>接收物流入库信息</span>
          ) : text === 8 ? (
            <span>关单</span>
          ) : (
            ""
          )
      },
      {
        title: "导入时间",
        dataIndex: "createDate",
        align: "center",
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
        label: "套/单机单号",
        type: "input",
        value: "hbdmRowId",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "hbdmRowId",
          value: hbdmRowId,
          onChange: this.handleInputChange
        }
      },
      {
        label: "备件条码",
        type: "input",
        value: "partsCodes",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "partsCodes",
          value: partsCodes,
          onChange: this.handleInputChange
        }
      },
      {
        label: "单机物料号",
        type: "input",
        value: "hrSku",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "hrSku",
          value: hrSku,
          onChange: this.handleInputChange
        }
      },
      {
        label: "SKU编号",
        type: "input",
        value: "jdSku",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "jdSku",
          value: jdSku,
          onChange: this.handleInputChange
        }
      },
      {
        label: "京东订单号",
        type: "input",
        value: "orderNo",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "orderNo",
          value: orderNo,
          onChange: this.handleInputChange
        }
      },
      {
        label: "备件库",
        type: "input",
        value: "sparesStorage",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "sparesStorage",
          value: sparesStorage,
          onChange: this.handleInputChange
        }
      },
      {
        label: "46单号",
        type: "input",
        value: "returnNumber",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "returnNumber",
          value: returnNumber,
          onChange: this.handleInputChange
        }
      },
      {
        label: "38单号",
        type: "input",
        value: "bstkde38",
        options: null,
        style: { width: 360 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 260 },
          id: "bstkde38",
          value: bstkde38,
          onChange: this.handleInputChange
        }
      },
      {
        label: "状态",
        type: "select",
        value: "detailStatus",
        options: [
          { key: 0, label: "---" },
          { key: 1, label: "导入未处理" },
          { key: 2, label: "请求HCC成功" },
          { key: 3, label: "请求HCC失败" },
          { key: 4, label: "接收HCC鉴定信息" },
          { key: 5, label: "接收HCC换箱结果" },
          { key: 6, label: "接收HCC负提单信息" },
          { key: 7, label: "接收物流入库信息" },
          { key: 8, label: "关单" }
        ],
        style: { width: 360 },
        componentOptions: {
          value: detailStatus,
          style: { width: 260 },
          onChange: this.handleStatusChange
        }
      },
      {
        label: "导入时间",
        type: "range",
        value: "createDate",
        options: null,
        style: { width: 360 },
        componentOptions: {
          style: { width: 260 },
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

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.searchByParams}
          reset={this.resetCondition}
          isExpand
        />
        <section className={style["table-wrapper"]}>
          <Table
            dataSource={this.state.dataList}
            loading={this.state.loading}
            columns={columns}
            // rowKey="hbdmRowId"
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
            // scroll={{ x: 4200 }}
          />
        </section>
        <Drawer
          width="40%"
          // title="详细信息"
          // placement="bottom"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          destroyOnClose={true}
        >
          <DrawerContent orderNo={this.state.checkOrderNo} />
        </Drawer>
      </div>
    );
  }
}

export default RejectPage;
