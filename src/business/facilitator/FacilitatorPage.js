import React, { Component } from "react";
import { Drawer, message, Table } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import DrawerContent from "./element/DrawerContent";
import { loginStatus } from "../../tool/common/loginStatus";
import Config from "../../tool/common/Config";

class FacilitatorPage extends Component {
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
      siteName: "",
      province: "",
      city: "",
      county: "",
      pageSize: 10,
      total: 0,
      currentPage: 1,
      startDate: "",
      endDate: "",
      siteId: "",
      dataList: []
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
    let url = `${Config.UEHCC_SERVICE}ueOrder/querySiteDo?currentPage=${
      this.state.currentPage
    }&pageSize=${this.state.pageSize}&siteName=${
      this.state.siteName
    }&province=${this.state.province}&city=${this.state.city}&startDate=${
      this.state.startDate
    }&endDate=${this.state.endDate}&county=${this.state.county}`;
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
      siteId: key
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      siteId: ""
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
        siteName: "",
        province: "",
        city: "",
        county: "",
        startDate: "",
        endDate: ""
      },
      () => this.getOrderInfos()
    );
  };

  handleInputChange = e => {
    let id = e.target.id;
    if (id === "siteName") {
      this.setState({
        siteName: e.target.value
      });
    } else if (id === "province") {
      this.setState({
        province: e.target.value
      });
    } else if (id === "city") {
      this.setState({
        city: e.target.value
      });
    } else if (id === "county") {
      this.setState({
        county: e.target.value
      });
    }
  };

  handleDateChange = (date, dateString) => {
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    });
  };

  render() {
    const {
      siteName,
      province,
      city,
      county,
      startDate,
      endDate,
      dataList,
      loading,
      pageSize,
      currentPage,
      total,
      visible,
      siteId
    } = this.state;

    const columns = [
      {
        title: "服务商名称",
        dataIndex: "siteName",
        align: "center",
        key: "siteName",
        render: (text, record) => (
          <a href=" # " onClick={() => this.showDrawer(record.id)}>
            {text}
          </a>
        )
      },
      {
        title: "服务商联系人",
        dataIndex: "contactMan",
        align: "center",
        key: "contactMan"
      },
      {
        title: "服务商联系方式",
        align: "center",
        dataIndex: "siteMobile",
        key: "siteMobile"
      },
      {
        title: "省",
        dataIndex: "province",
        align: "center",
        key: "province"
      },
      {
        title: "市",
        align: "center",
        dataIndex: "city",
        key: "city"
      },
      {
        title: "区(县)",
        dataIndex: "county",
        align: "center",
        key: "county"
      },
      {
        title: "服务商识别码",
        dataIndex: "siteCode",
        align: "center",
        key: "siteCode"
      },
      {
        title: "创建时间",
        dataIndex: "createDate",
        align: "center",
        key: "createDate",
        render: text =>
          text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      }
    ];

    const conditionConfig = [
      {
        label: "服务商名称",
        type: "input",
        value: "siteName",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "siteName",
          value: siteName,
          onChange: this.handleInputChange
        }
      },
      {
        label: "省",
        type: "input",
        value: "province",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
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
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "city",
          value: city,
          onChange: this.handleInputChange
        }
      },
      {
        label: "区(县)",
        type: "input",
        value: "county",
        options: null,
        // style: { width: 200 },
        componentOptions: {
          placeholder: "请输入",
          // style: { width: 120 },
          id: "county",
          value: county,
          onChange: this.handleInputChange
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
            dataSource={dataList}
            loading={loading}
            columns={columns}
            rowKey="orderNo"
            bordered
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              total: total,
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
          visible={visible}
          destroyOnClose={true}
        >
          <DrawerContent siteId={siteId} />
        </Drawer>
      </div>
    );
  }
}

export default FacilitatorPage;
