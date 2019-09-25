import React, { Component } from "react";
import { Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";
import Cookies from "js-cookie";

class OrderExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      dataList: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      startDate: "",
      endDate: "",
      orderNo: "", //服务工单号
      saleOrderNo: "", //京东销售单号
      itemCode: "", //京东sku
      hrSku:"",   //物料编码
      industry: "", //产业
      industrySelects: [],
      orderStatus: "3", //状态
      province: "", //省
      city: "", //市
      userName: "", //用户名
      currentUserId: Cookies.get("username"),
      pages:1,
      sizes:10000
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    let arr = [];
    JSON.parse(localStorage.a).industryList.map(it =>
        arr.push({ key: it.industryName, label: it.industryName })
    );
    this.setState({
      industryOptions: arr
    });
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
        saleOrderNo,
        itemCode,
        industry,
        hrSku,
        orderStatus,
        province,
        city,
        userName,
        currentUserId,
        currentPage,
        pageSize,
        startDate,
        endDate
      } = this.state;
      let url = `${
          Config.UEHCC_SERVICE
          }ueOrder/selectAssignMes?currentPage=${currentPage}&pageSize=${pageSize}&orderNo=${orderNo}`+
    `&saleOrderNo=${saleOrderNo}&itemCode=${itemCode}&industry=${industry}&hrSku=${hrSku}&orderStatus=${orderStatus}&province=${province}`+
    `&city=${city}&userName=${userName}&currentUserId=${currentUserId}&startDate=${startDate}&endDate=${endDate}`;
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
        startDate: "",
        endDate: "",
        orderNo: "", //服务工单号
        saleOrderNo: "", //京东销售单号
        itemCode: "", //京东sku
        industry: "", //产业
        industrySelects: [],
        orderStatus: "3", //状态
        province: "", //省
        city: "", //市
        userName: "", //用户名
        hrSku:"",  //物料编码
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
    } else if (id === "province") {
      this.setState({
        province: e.target.value
      });
    } else if (id === "city") {
      this.setState({
        city: e.target.value
      });
    } else if (id === "userName") {
      this.setState({
        userName: e.target.value
      });
    }else if (id === "hrSku") {
      this.setState({
        hrSku: e.target.value
      });
    }
  };

  handleStatusChange = value => {
    this.setState({
      orderStatus: value
    });
  };

  handleIndustryChange = value => {
    this.setState({
      industrySelects: value,
      industry: value.toString()
    });
  };

  handleDateChange = (date, dateString) => {
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    });
  };
  //获取导出条数数据
  receiveData=(data)=>{
    this.setState(data,function(){
      if(this.state.pages===null||this.state.sizes===null){
        message.error('导出范围不能为空');
        if(this.state.pages===null){
          this.setState({pages:1})
        }
        if(this.state.sizes===null){
          this.setState({sizes:1000})
        }
      }
    })
  };
  render() {
    const {
      orderNo,
      saleOrderNo,
      itemCode,
      hrSku,
      industry,
      industryOptions,
      industrySelects,
      orderStatus,
      province,
      city,
      userName,
      currentUserId,
      startDate,
      endDate,
      pages,
      sizes
    } = this.state;

    const columns = [
      {
        title: "服务工单号",
        dataIndex: "orderNo",
        align: "center",
        width: 150,
        key: "orderNo",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "京东商城销售订单号",
        dataIndex: "saleOrderNo",
        align: "center",
        width: 120,
        key: "saleOrderNo",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "服务类型名称",
        dataIndex: "serviceTypeName",
        align: "center",
        width: 100,
        key: "serviceTypeName"
      },
      {
        title: "履约商名称",
        dataIndex: "companyName",
        align: "center",
        width: 120,
        key: "companyName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "品牌名称",
        dataIndex: "brandName",
        align: "center",
        width: 100,
        key: "brandName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "产业",
        align: "center",
        dataIndex: "industry",
        width: 100,
        key: "industry"
      },
      {
        title: "京东SKU",
        align: "center",
        dataIndex: "itemCode",
        width: 100,
        key: "itemCode",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "物料编码",
        align: "center",
        dataIndex: "hrSku",
        width: 120,
        key: "hrSku",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "产品名称",
        align: "center",
        dataIndex: "itemName",
        width: 150,
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
        title: "服务单状态",
        align: "center",
        dataIndex: "orderMes",
        width: 120,
        key: "orderMes",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "用户姓名",
        dataIndex: "userName",
        align: "center",
        width: 100,
        key: "userName"
      },
      {
        title: "用户电话",
        dataIndex: "userMobileDecrypt",
        align: "center",
        width: 100,
        key: "userMobileDecrypt",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "服务所在省",
        dataIndex: "userProvince",
        align: "center",
        width: 100,
        key: "userProvince",
        render: text => <span title={text}>{text}</span>

      },
      {
        title: "服务所在市",
        align: "center",
        dataIndex: "userCity",
        width: 100,
        key: "userCity",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "服务所在详细地址",
        dataIndex: "userAddressDecrypt",
        align: "center",
        width: 150,
        key: "userAddressDecrypt",
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
        title: "购买时间",
        dataIndex: "buyDate",
        align: "center",
          width: 150,
        key: "buyDate",
        render: text =>
            text ? (
                <span title={this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </span>
            ) : (
                ""
            )
      },
      {
        title: "销售订单状态",
        align: "center",
        dataIndex: "saleOrderStat",
        width: 100,
        key: "saleOrderStat"
      },
      {
        title: "建单时间",
        align: "center",
        dataIndex: "createDate",
        width: 150,
        key: "createDate",
        render: text =>
            text ? (
                <span title={this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </span>
            ) : (
                ""
            )
      },
      {
        title: "妥投时间",
        align: "center",
        dataIndex: "deliverArriveDate",
        width: 150,
        key: "deliverArriveDate",
        render: text =>
            text ? (
                <span title={this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </span>
            ) : (
                ""
            )
      },
      {
        title: "预约送货日期",
        align: "center",
        dataIndex: "reserveDeliverTime",
        width: 120,
        key: "reserveDeliverTime",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "预约送货日期",
        align: "center",
        dataIndex: "reserveDeliverTime",
        width: 120,
        key: "reserveDeliverTime",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "服务单HBDM时间",
        dataIndex: "insertTime",
        align: "center",
        width: 150,
        key: "insertTime",
        render: text =>
            text ? (
                <span title={this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(text).format("YYYY-MM-DD HH:mm:ss")}
            </span>
            ) : (
                ""
            )
      },
      {
        title: "服务单更新时间",
        dataIndex: "updateStatusTime",
        align: "center",
        width: 150,
        key: "updateStatusTime",
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
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          id: "orderNo",
          value: orderNo,
          style: { width: 200 },
          onChange: this.handleInputChange
        }
      },
      {
        label: "商城销售单号",
        type: "input",
        value: "saleOrderNo",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "saleOrderNo",
          value: saleOrderNo,
          onChange: this.handleInputChange
        }
      },
      {
        label: "产业",
        type: "select",
        value: "industry",
        options: industryOptions,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请选择",
          mode: "multiple",
          value: industrySelects,
          style: { width: 200 },
          onChange: this.handleIndustryChange
        }
      },
      {
        label: "京东SKU",
        type: "input",
        value: "itemCode",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "itemCode",
          value: itemCode,
          onChange: this.handleInputChange
        }
      },
      {
        label: "物料编码",
        type: "input",
        value: "hrSku",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "hrSku",
          value: hrSku,
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
        style: { width: 380 },
        componentOptions: {
          value: orderStatus,
          style: { width: 200 },
          onChange: this.handleStatusChange
        }
      },
      {
        label: "用户姓名",
        type: "input",
        value: "userName",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "userName",
          value: userName,
          onChange: this.handleInputChange
        }
      },
      {
        label: "省",
        type: "input",
        value: "province",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "province",
          value: province,
          onChange: this.handleInputChange
        }
      },
      {
        label: "市",
        type: "input",
        value: "city",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "city",
          value: city,
          onChange: this.handleInputChange
        }
      },
      {
        label: "建单时间",
        type: "range",
        value: "createDate",
        options: null,
        style: { width: 380 },
        componentOptions: {
          style: { width: 200 },
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

    let exportUrl = `${Config.ajaxUrl}${
      Config.UEHCC_SERVICE
    }ueOrder/downAssignMes?orderNo=${orderNo}&pages=${pages}&sizes=${sizes}`+
    `&saleOrderNo=${saleOrderNo}&itemCode=${itemCode}&industry=${industry}&hrSku=${hrSku}&orderStatus=${orderStatus}&province=${province}`+
    `&city=${city}&userName=${userName}&currentUserId=${currentUserId}`+
    `&startDate=${startDate}&endDate=${endDate}`;

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.searchByParams}
          reset={this.resetCondition}
          isExpand
          isExport
          isRange
          receiveData={this.receiveData}
          exportUrl={exportUrl}
          startDate={startDate}
          endDate={endDate}
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
            scroll={{ x: 4000 }}
          />
        </section>
      </div>
    );
  }
}

export default OrderExport;
