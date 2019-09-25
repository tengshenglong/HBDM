import React, { Component } from "react";
import { Drawer, Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import DrawerContentIsv from "./element/DrawerContentIsv";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

class IsvOrderPage extends Component {
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
      jdWareId: "",
      orderId: "",
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
    let url = `${Config.UEHCC_SERVICE}isvOrder/isvOrderPage?currentPage=${
      this.state.currentPage
    }&pageSize=${this.state.pageSize}&orderNo=${
      this.state.orderNo
    }&jdWareId=${this.state.jdWareId}&orderStatus=${
      this.state.orderStatus
    }&startDate=${this.state.startDate}&endDate=${
      this.state.endDate
    }&orderId=${this.state.orderId}`;
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
        jdWareId: "",
        orderId: "",
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
    } else if (id === "jdWareId") {
      this.setState({
        jdWareId: e.target.value
      });
    } else if (id === "orderId") {
      this.setState({
        orderId: e.target.value
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
      jdWareId,
      orderStatus,
      startDate,
      endDate,
      orderId
    } = this.state;

    const columns = [
      {
        title: "服务单号",
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
        title: "商品京东编号",
        dataIndex: "jdWareId",
        align: "center",
        key: "jdWareId",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "订单号",
        dataIndex: "orderId",
        align: "center",
        key: "orderId",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "商品名称",
        dataIndex: "productName",
        align: "center",
        key: "productName",
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
        title: "工单状态",
        dataIndex: "orderStatusMsg",
        align: "center",
        key: "orderStatusMsg",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "创建时间",
        dataIndex: "createOrderTime",
        // width: 180,
        align: "center",
        key: "createOrderTime",
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
        label: "服务单号",
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
        label: "商品京东编号",
        type: "input",
        value: "jdWareId",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "jdWareId",
          value: jdWareId,
          onChange: this.handleInputChange
        }
      },
      {
        label: "订单号",
        type: "input",
        value: "orderId",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "orderId",
          value: orderId,
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
        value: "createOrderTime",
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
          <DrawerContentIsv orderNo={this.state.checkOrderNo} />
        </Drawer>
      </div>
    );
  }
}

export default IsvOrderPage;
