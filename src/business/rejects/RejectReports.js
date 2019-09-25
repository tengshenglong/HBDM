import React, { Component } from "react";
import { Table, message, Tooltip } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";
import Cookies from "js-cookie";

class RejectReports extends Component {
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
      industry: "", //产业
      hrRegionNam: "", //中心
      hbdmRowId: "", //网单号
      partsCodes: "", //备件条码
      duty: "", //责任位
      detailStatus: [], //状态
      reqNum: "", //推送HCC单号
      customerProductNo: "", //鉴定机编
      returnNumber: "", //46负提单
      bstkde38: "", //38入库单
      vbeln1: "", //80入库凭证号
      currentUserId:Cookies.get("username"),
      industrySelects: [],
      regionOptions: [],
      regionSelects: [],
      dutyOptions: [
        { key: "海尔责任已推送", label: "海尔责任已推送" },
        { key: "海尔责任未推送", label: "海尔责任未推送" },
        { key: "京东责任已推送", label: "京东责任已推送" },
        { key: "京东责任未推送", label: "京东责任未推送" }
      ],
      dutySelects: [],
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
    this.getRegionInfos();
  }

  getRegionInfos = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    this.$axios
      .get(`${Config.CUSTOMER_SERVICE}hccDetailsView/findhrRegionNam`)
      .then(res => {
        if (res.flag) {
          let arr = [];
          res.dataList.forEach(it => {
            arr.push({ key: it, label: it });
          });
          this.setState({
            regionOptions: arr
          });
        } else {
          message.error(res.message);
          this.setState({
            regionOptions: []
          });
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

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
      industry,
      hrRegionNam,
      hbdmRowId,
      partsCodes,
      duty,
      detailStatus,
      reqNum,
      customerProductNo,
      returnNumber,
      bstkde38,
      vbeln1,
      currentUserId,
      currentPage,
      pageSize,
      startDate,
      endDate
    } = this.state;
    let url = `${
      Config.CUSTOMER_SERVICE
    }hccDetailsView/showDetailcollect?currentPage=${currentPage}&pageSize=${pageSize}&industry=${industry}
    &partsCodes=${partsCodes}&detailStatus=${detailStatus}&hrRegionNam=${hrRegionNam}&duty=${duty}
    &reqNum=${reqNum}&customerProductNo=${customerProductNo}&vbeln1=${vbeln1}&currentUserId=${currentUserId}
    &hbdmRowId=${hbdmRowId}&returnNumber=${returnNumber}&bstkde38=${bstkde38}&startDate=${startDate}&endDate=${endDate}`;
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
        industry: "", //产业
        industrySelects: [],
        regionSelects: [],
        hrRegionNam: "", //中心
        hbdmRowId: "", //网单号
        partsCodes: "", //备件条码
        duty: "", //责任位
        dutySelects: [],
        detailStatus: [], //状态
        reqNum: "", //推送HCC单号
        customerProductNo: "", //鉴定机编
        returnNumber: "", //46负提单
        bstkde38: "", //38入库单
        vbeln1: "" //80入库凭证号
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
    } else if (id === "reqNum") {
      this.setState({
        reqNum: e.target.value
      });
    } else if (id === "customerProductNo") {
      this.setState({
        customerProductNo: e.target.value
      });
    } else if (id === "vbeln1") {
      this.setState({
        vbeln1: e.target.value
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

  handleIndustryChange = value => {
    this.setState({
      industrySelects: value,
      industry: value.toString()
    });
  };

  handleRegionChange = value => {
    this.setState({
      regionSelects: value,
      hrRegionNam: value.toString()
    });
  };

  handleDutyChange = value => {
    this.setState({
      dutySelects: value,
      duty: value.toString()
    });
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
      industry,
      hrRegionNam,
      duty,
      hbdmRowId,
      partsCodes,
      detailStatus,
      reqNum,
      customerProductNo,
      returnNumber,
      bstkde38,
      vbeln1,
      currentUserId,
      industryOptions,
      industrySelects,
      regionOptions,
      regionSelects,
      dutyOptions,
      dutySelects,
      startDate,
      endDate,
      pages,
      sizes
    } = this.state;

    const columns = [
      {
        title: "产业",
        dataIndex: "industry",
        align: "center",
        width: 100,
        key: "industry"
      },
      {
        title: "中心",
        dataIndex: "hrRegionNam",
        align: "center",
        width: 100,
        key: "hrRegionNam"
      },
      {
        title: "HBDM网单号",
        dataIndex: "hbdmRowId",
        align: "center",
        width: 250,
        key: "hbdmRowId"
      },
      {
        title: "备件条码",
        dataIndex: "partsCodes",
        align: "center",
        width: 150,
        key: "partsCodes"
      },
      {
        title: "入库时间",
        dataIndex: "entryStorageDate",
        align: "center",
        width: 200,
        key: "entryStorageDate"
      },
      {
        title: "库龄",
        dataIndex: "kuAge",
        align: "center",
        width: 100,
        key: "kuAge"
      },
      {
        title: "SKU编号",
        dataIndex: "jdSku",
        align: "center",
        width: 150,
        key: "jdSku"
      },
      {
        title: "海尔物料",
        dataIndex: "hrSku",
        align: "center",
        width: 150,
        key: "hrSku"
      },
      {
        title: "备件库",
        align: "center",
        dataIndex: "sparesStorage",
        width: 200,
        key: "sparesStorage"
      },
      {
        title: "签收时间",
        dataIndex: "signDate",
        align: "center",
        width: 200,
        key: "signDate",
        render: text => (text ? text : "拒收")
      },
      {
        title: "申请时间",
        dataIndex: "applicationDate",
        align: "center",
        width: 200,
        key: "applicationDate"
      },
      {
        title: "三包时效",
        align: "center",
        dataIndex: "sbAging",
        width: 100,
        key: "sbAging"
      },
      {
        title: "机编",
        align: "center",
        dataIndex: "machineCodes",
        width: 200,
        key: "machineCodes"
      },
      {
        title: "商品名称",
        align: "center",
        dataIndex: "goodName",
        width: 150,
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
        dataIndex: "errorMsg",
        width: 150,
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
        align: "center",
        width: 200,
        key: "jdOrderNum"
      },
      {
        title: "京东商场编号",
        dataIndex: "jdMarketCode",
        align: "center",
        width: 150,
        key: "jdMarketCode"
      },
      {
        title: "金额",
        dataIndex: "price",
        align: "center",
        width: 100,
        key: "price"
      },
      {
        title: "推送HCC时间",
        dataIndex: "hccReqDate",
        align: "center",
        width: 200,
        key: "hccReqDate"
      },
      {
        title: "推送HCC单号",
        dataIndex: "reqNum",
        align: "center",
        width: 250,
        key: "reqNum"
      },
      {
        title: "鉴定网点",
        dataIndex: "serviceNetName",
        align: "center",
        width: 150,
        key: "serviceNetName"
      },
      {
        title: "鉴定机编",
        dataIndex: "customerProductNo",
        align: "center",
        width: 200,
        key: "customerProductNo"
      },
      {
        title: "鉴定结果",
        dataIndex: "cyExamine",
        align: "center",
        width: 150,
        key: "cyExamine"
      },
      {
        title: "46负提单",
        dataIndex: "returnNumber",
        align: "center",
        width: 150,
        key: "returnNumber"
      },
      {
        title: "38入库单",
        dataIndex: "bstkde38",
        align: "center",
        width: 150,
        key: "bstkde38"
      },
      {
        title: "80入库凭证号",
        dataIndex: "vbeln1",
        align: "center",
        // width: 100,
        key: "vbeln1"
      }
    ];

    const conditionConfig = [
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
          style: { width: 270 },
          onChange: this.handleIndustryChange
        }
      },
      {
        label: "中心",
        type: "select",
        value: "hrRegionNam",
        options: regionOptions,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请选择",
          mode: "multiple",
          value: regionSelects,
          style: { width: 270 },
          onChange: this.handleRegionChange
        }
      },
      {
        label: "HBDM网单号",
        type: "input",
        value: "hbdmRowId",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
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
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
          id: "partsCodes",
          value: partsCodes,
          onChange: this.handleInputChange
        }
      },
      {
        label: "责任位",
        type: "select",
        value: "duty",
        options: dutyOptions,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请选择",
          mode: "multiple",
          value: dutySelects,
          style: { width: 270 },
          onChange: this.handleDutyChange
        }
      },
      {
        label: "当前状态",
        type: "select",
        value: "detailStatus",
        options: [
          { key: 1, label: "导入未处理" },
          { key: 2, label: "请求HCC成功" },
          { key: 3, label: "请求HCC失败" },
          { key: 4, label: "接收HCC鉴定信息" },
          { key: 5, label: "接收HCC换箱结果" },
          { key: 6, label: "接收HCC负提单信息" },
          { key: 7, label: "接收物流入库信息" },
          { key: 8, label: "关单" }
        ],
        style: { width: 380 },
        componentOptions: {
          placeholder: "请选择",
          mode: "multiple",
          value: detailStatus,
          style: { width: 270 },
          onChange: this.handleStatusChange
        }
      },
      {
        label: "推送HCC单号",
        type: "input",
        value: "reqNum",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
          id: "reqNum",
          value: reqNum,
          onChange: this.handleInputChange
        }
      },
      {
        label: "鉴定机编",
        type: "input",
        value: "customerProductNo",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
          id: "customerProductNo",
          value: customerProductNo,
          onChange: this.handleInputChange
        }
      },

      {
        label: "46单号",
        type: "input",
        value: "returnNumber",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
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
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
          id: "bstkde38",
          value: bstkde38,
          onChange: this.handleInputChange
        }
      },
      {
        label: "80入库凭证号",
        type: "input",
        value: "vbeln1",
        options: null,
        style: { width: 380 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 270 },
          id: "vbeln1",
          value: vbeln1,
          onChange: this.handleInputChange
        }
      },
      {
        label: "导入时间",
        type: "range",
        value: "createDate",
        options: null,
        style: { width: 380 },
        componentOptions: {
          style: { width: 270 },
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
      Config.CUSTOMER_SERVICE
    }hccDetailsView/downCollect?industry=${industry}&pages=${pages}&sizes=${sizes}`+
    `&partsCodes=${partsCodes}&detailStatus=${detailStatus}&hrRegionNam=${hrRegionNam}&duty=${duty}`+
    `&reqNum=${reqNum}&customerProductNo=${customerProductNo}&vbeln1=${vbeln1}&currentUserId=${currentUserId}`+
    `&hbdmRowId=${hbdmRowId}&returnNumber=${returnNumber}&bstkde38=${bstkde38}&startDate=${startDate}&endDate=${endDate}`;

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
            scroll={{ x: 4300 }}
          />
        </section>
      </div>
    );
  }
}

export default RejectReports;
