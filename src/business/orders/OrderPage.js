import React, { Component } from "react";
import { Drawer, Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import DrawerContent from "./element/DrawerContent";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

class OrderPage extends Component {
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
      orderNo: "",
      saleOrderNo: "",
      itemCode: "",
      orderStatus: "3",
      startDate: "",
      endDate: "",
      checkOrderNo: ""
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
    let url = `${Config.UEHCC_SERVICE}ueOrder/listOrderPage?currentPage=${
      this.state.currentPage
    }&pageSize=${this.state.pageSize}&orderNo=${
      this.state.orderNo
    }&saleOrderNo=${this.state.saleOrderNo}&orderStatus=${
      this.state.orderStatus
    }&startDate=${this.state.startDate}&endDate=${
      this.state.endDate
    }&itemCode=${this.state.itemCode}`;
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
        saleOrderNo: "",
        itemCode: "",
        orderStatus: "3",
        startDate: "",
        endDate: ""
      },
      () => this.getOrderInfos()
    );
  };

  handleInputChange = e => {
    let id = e.target.id;
    if (id === "orderNo") {
      this.setState({
        orderNo: e.target.value
      });
    } else if (id === "saleOrderNo") {
      this.setState({
        saleOrderNo: e.target.value
      });
    } else if (id === "itemCode") {
      this.setState({
        itemCode: e.target.value
      });
    }
  };

  handleStatusChange = value => {
    this.setState({
      orderStatus: value
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
      saleOrderNo,
      orderStatus,
      startDate,
      endDate,
      itemCode
    } = this.state;

    const columns = [
      {
        title: "服务工单号",
        dataIndex: "orderNo",
        align: "center",
        key: "orderNo",
        render: text => (
          <a href=" # " onClick={() => this.showDrawer(text)}>
            <span title={text}>{text}</span>
          </a>
        )
      },
      {
        title: "销售订单号",
        dataIndex: "saleOrderNo",
        align: "center",
        key: "saleOrderNo",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "SKU编码",
        dataIndex: "itemCode",
        align: "center",
        key: "itemCode",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "物料编码",
        dataIndex: "hrSku",
        align: "center",
        key: "hrSku",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "产品名称",
        dataIndex: "itemName",
        align: "center",
        key: "itemName",
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
        title: "数量",
        dataIndex: "qty",
        align: "center",
        key: "qty",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "工单状态",
        dataIndex: "orderStatus",
        align: "center",
        key: "orderStatus",
        render: text =>
          text === 0 ? (
            <span title="待处理">待处理</span>
          ) : text === 1 ? (
            <span title="下载完成">下载完成</span>
          ) : text === 10 ? (
            <span title="物流妥投">物流妥投</span>
          ) : text === 11 ? (
            <span title="用户拒收">用户拒收</span>
          ) : text === 12 ? (
            <span title="用户退单">用户退单</span>
          ) : text === 13 ? (
            <span title="OMS退单">OMS退单</span>
          ) : text === 14 ? (
            <span title="工单配件回传">工单配件回传</span>
          ) : text === 20 ? (
            <span title="指派/改派服务商">指派/改派服务商</span>
          ) : text === 21 ? (
            <span title="指派/改派师傅">指派/改派师傅</span>
          ) : text === 22 ? (
            <span title="预约/改约上门">预约/改约上门</span>
          ) : text === 23 ? (
            <span title="服务过程反馈">服务过程反馈</span>
          ) : text === 30 ? (
            <span title="服务完成">服务完成</span>
          ) : text === 31 ? (
            <span title="工单评价回传">工单评价回传</span>
          ) : (
            ""
          )
      },
      {
        title: "创建时间",
        dataIndex: "createDate",
        // width: 180,
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
        label: "服务工单号",
        type: "input",
        value: "orderNo",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "orderNo",
          value: orderNo,
          onChange: this.handleInputChange
        }
      },
      {
        label: "销售订单号",
        type: "input",
        value: "saleOrderNo",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "saleOrderNo",
          value: saleOrderNo,
          onChange: this.handleInputChange
        }
      },
      {
        label: "SKU编码",
        type: "input",
        value: "itemCode",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "itemCode",
          value: itemCode,
          onChange: this.handleInputChange
        }
      },
      {
        label: "工单状态",
        type: "select",
        value: "orderStatus",
        options: [
          { key: "3", label: "全部" },
          { key: "0", label: "待处理" },
          { key: "1", label: "处理中" },
          { key: "2", label: "完成" }
        ],
        // style: { width: 190 },
        componentOptions: {
          value: orderStatus,
          // style: { width: 100 },
          onChange: this.handleStatusChange
        }
      },
      {
        label: "创建时间",
        type: "range",
        value: "createDate",
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

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.searchByParams}
          reset={this.resetCondition}
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
            // scroll={{ x: 4350 }}
          />
        </section>
        <Drawer
          width="40%"
          // title="详细信息"
          placement="right"
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

export default OrderPage;
