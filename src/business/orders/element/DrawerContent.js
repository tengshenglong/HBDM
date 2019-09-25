import React, { Component } from "react";
import { Table, message, Row, Col, Divider, Icon } from "antd";
import Config from "../../../tool/common/Config";
import { loginStatus } from "../../../tool/common/loginStatus";

const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)"
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)"
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand1: true,
      expand2: false,
      expand3: false,
      expand4: false,
      expand5: false,
      expand6: false,
      expand7: false,
      expand8: false,
      expand9: false,
      dataList: {}
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    this.getOrderDetails();
  }

  getOrderDetails = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let url = `${Config.UEHCC_SERVICE}ueOrder/listOrderAll?orderNo=${
      this.props.orderNo
    }`;
    this.$axios
      .get(url)
      .then(res => {
        if (res.flag) {
          this.setState({
            dataList: res.dataList[0]
          });
        } else {
          message.error(res.message);
          this.setState({
            dataList: {}
          });
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  toggle = flag => {
    const {
      expand1,
      expand2,
      expand3,
      expand4,
      expand5,
      expand6,
      expand7,
      expand8,
      expand9
    } = this.state;
    if (flag === "1") {
      this.setState({ expand1: !expand1 });
    } else if (flag === "2") {
      this.setState({ expand2: !expand2 });
    } else if (flag === "3") {
      this.setState({ expand3: !expand3 });
    } else if (flag === "4") {
      this.setState({ expand4: !expand4 });
    } else if (flag === "5") {
      this.setState({ expand5: !expand5 });
    } else if (flag === "6") {
      this.setState({ expand6: !expand6 });
    } else if (flag === "7") {
      this.setState({ expand7: !expand7 });
    } else if (flag === "8") {
      this.setState({ expand8: !expand8 });
    } else if (flag === "9") {
      this.setState({ expand9: !expand9 });
    }
  };

  render() {
    const {
      expand1,
      expand2,
      expand3,
      expand4,
      expand5,
      expand6,
      expand7,
      expand8,
      expand9,
      dataList
    } = this.state;

    const columns = [
      {
        title: "数据插入时间",
        dataIndex: "createdAt",
        align: "center",
        key: "createdAt",
        width: 150,
        render: text =>
          text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      },
      {
        title: "操作人",
        dataIndex: "createBy",
        align: "center",
        width: 100,
        key: "createBy"
      },
      {
        title: "状态",
        dataIndex: "orderStatusMsg",
        align: "center",
        width: 150,
        key: "orderStatusMsg"
        // render: text =>
        //   text === 0 ? (
        //     <span>待处理</span>
        //   ) : text === 1 ? (
        //     <span>HCC下载完成</span>
        //   ) : text === 10 ? (
        //     <span>物流妥投</span>
        //   ) : text === 11 ? (
        //     <span>用户拒收</span>
        //   ) : text === 12 ? (
        //     <span>用户退单</span>
        //   ) : text === 13 ? (
        //     <span>HCC退单</span>
        //   ) : text === 14 ? (
        //     <span>工单配件回传</span>
        //   ) : text === 20 ? (
        //     <span>指派/改派服务商</span>
        //   ) : text === 21 ? (
        //     <span>指派师傅</span>
        //   ) : text === 22 ? (
        //     <span>预约上门</span>
        //   ) : text === 23 ? (
        //     <span>服务过程反馈</span>
        //   ) : text === 30 ? (
        //     <span>服务完成</span>
        //   ) : text === 31 ? (
        //     <span>工单评价回传</span>
        //   ) : (
        //     ""
        //   )
      },
      {
        title: "内容",
        dataIndex: "orderContent",
        align: "center",
        key: "orderContent"
      }
    ];

    const columns1 = [
      {
        title: "服务工单号",
        dataIndex: "orderNo",
        align: "center",
        key: "orderNo"
      },
      {
        title: "关闭原因",
        dataIndex: "reason",
        align: "center",
        key: "reason"
      }
    ];
      const columns2 = [
          {
              title: "服务工单号",
              dataIndex: "orderNo",
              align: "center",
              key: "orderNo"
          },
          {
              title: "节点类型",
              dataIndex: "deliverType",
              align: "center",
              key: "deliverType",
              render: text =>
                  text === 1 ? (
                      <span title="签收">签收</span>
                  ) : text === 2 ? (
                      <span title="下载完成">拒收</span>
                  ) : text === 100 ? (
                      <span title="物流妥投">全部</span>
                  ) :(
                      ""
                  )
          },
          {
              title: "物流节点描述",
              dataIndex: "deliverSpot",
              align: "center",
              key: "deliverSpot"
          },
          {
              title: "节点时间",
              dataIndex: "deliverDate",
              align: "center",
              key: "deliverDate",
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

    return (
      <div>
        {dataList.ueOrderDO && (
          <div>
            <p style={pStyle}>工单详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="服务类型名称"
                  content={dataList.ueOrderDO.serviceTypeName}
                />
              </Col>
            </Row>
            {expand1 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="履约商名称"
                      content={dataList.ueOrderDO.companyName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="品牌名称"
                      content={dataList.ueOrderDO.brandName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="商品购买时间"
                      content={
                          dataList.ueOrderDO.buyDate
                          ? this.$moment(dataList.ueOrderDO.buyDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="商品购买店铺"
                      content={dataList.ueOrderDO.buyShop}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="产品名称"
                      content={dataList.ueOrderDO.itemName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="产品分类"
                      content={dataList.ueOrderDO.itemCatName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="销售订单号"
                      content={dataList.ueOrderDO.saleOrderNo}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="销售订单状态"
                      content={dataList.ueOrderDO.saleOrderStat}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="SKU产品编码"
                      content={dataList.ueOrderDO.itemCode}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="物料编码"
                      content={dataList.ueOrderDO.hrSku}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="数量"
                      content={dataList.ueOrderDO.qty}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="创建时间"
                      content={
                        dataList.ueOrderDO.createDate
                          ? this.$moment(dataList.ueOrderDO.createDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )
                          : ""
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="保修类型"
                      content={
                        dataList.ueOrderDO.inOrOut === 0
                          ? "未知"
                          : dataList.ueOrderDO.inOrOut === 1
                          ? "保内"
                          : dataList.ueOrderDO.inOrOut === 2
                          ? "保外"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="出厂机编"
                      content={dataList.ueOrderDO.productSn}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="期望上门时间"
                      content={dataList.ueOrderDO.wishBookDate}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="物流公司"
                      content={dataList.ueOrderDO.deliverCompany}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约送货日期"
                      content={
                        dataList.ueOrderDO.reserveDeliverTime
                          ? this.$moment(
                              dataList.ueOrderDO.reserveDeliverTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="物流单号"
                      content={dataList.ueOrderDO.deliverNo}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约安装日期"
                      content={
                        dataList.ueOrderDO.reserveSetupTime
                          ? this.$moment(
                              dataList.ueOrderDO.reserveSetupTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="是否是结算服务单"
                      content={
                        dataList.ueOrderDO.settleStat === 0
                          ? "否"
                          : dataList.ueOrderDO.settleStat === 1
                          ? "是"
                          : ""
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="妥投时间"
                      content={
                        dataList.ueOrderDO.deliverArriveDate
                          ? this.$moment(
                              dataList.ueOrderDO.deliverArriveDate
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="白名单校验状态"
                      content={
                        dataList.ueOrderDO.whiteListStat === 0
                          ? "未校验"
                          : dataList.ueOrderDO.whiteListStat === 1
                          ? "校验通过"
                          : dataList.ueOrderDO.whiteListStat === 2
                          ? "校验失败"
                          : ""
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务单状态"
                      content={
                        dataList.ueOrderDO.orderStatus === 0
                          ? "待处理"
                          : dataList.ueOrderDO.orderStatus === 1
                          ? "HCC下载完成"
                          : dataList.ueOrderDO.orderStatus === 10
                          ? "物流妥投"
                          : dataList.ueOrderDO.orderStatus === 11
                          ? "用户拒收"
                          : dataList.ueOrderDO.orderStatus === 12
                          ? "用户退单"
                          : dataList.ueOrderDO.orderStatus === 13
                          ? "OMS退单"
                          : dataList.ueOrderDO.orderStatus === 14
                          ? "工单配件回传"
                          : dataList.ueOrderDO.orderStatus === 20
                          ? "指派/改派服务商"
                          : dataList.ueOrderDO.orderStatus === 21
                          ? "指派/改派师傅"
                          : dataList.ueOrderDO.orderStatus === 22
                          ? "预约/改约上门"
                          : dataList.ueOrderDO.orderStatus === 23
                          ? "服务过程反馈"
                          : dataList.ueOrderDO.orderStatus === 30
                          ? "服务完成"
                          : dataList.ueOrderDO.orderStatus === 31
                          ? "工单评价回传"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="故障现象"
                      content={dataList.ueOrderDO.failureName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="工单备注"
                      content={dataList.ueOrderDO.remark}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("1")}>
                {expand1 ? "收起" : "展开"}
                <Icon type={expand1 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        <p style={pStyle}>工单流程详情</p>
        <Table
          dataSource={dataList.ueOrderHistoryNewDO}
          columns={columns}
          bordered
          size="middle"
          pagination={false}
          scroll={{ y: 240 }}
          style={{ marginBottom: 16 }}
        />

        {dataList.ueOrderCancleDO && (
          <div>
            <p style={pStyle}>退单/驳回/取消信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderCancleDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderCancleDO.createBy}
                />
              </Col>
            </Row>
            {expand2 && (
              <div>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="驳回/退单/取消原因"
                      content={dataList.ueOrderCancleDO.cancleReason}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("2")}>
                {expand2 ? "收起" : "展开"}
                <Icon type={expand2 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderPartDO && (
          <div>
            <p style={pStyle}>工单配件回传信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderPartDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="配件状态"
                  content={
                    dataList.ueOrderPartDO.partStat === 1
                      ? "申请"
                      : dataList.ueOrderPartDO.partStat === 2
                      ? "审核"
                      : dataList.ueOrderPartDO.partStat === 3
                      ? "出库"
                      : dataList.ueOrderPartDO.partStat === 4
                      ? "网点收货"
                      : dataList.ueOrderPartDO.partStat === 8
                      ? "驳回"
                      : dataList.ueOrderPartDO.partStat === 9
                      ? "取消"
                      : dataList.ueOrderPartDO.partStat === 11
                      ? "更换"
                      : dataList.ueOrderPartDO.partStat === 12
                      ? "网点返厂"
                      : dataList.ueOrderPartDO.partStat === 13
                      ? "返厂确认"
                      : ""
                  }
                />
              </Col>
            </Row>
            {expand3 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="物流公司"
                      content={dataList.ueOrderPartDO.deliverCompany}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="物流单号"
                      content={dataList.ueOrderPartDO.deliverNo}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="物流签收时间"
                      content={dataList.ueOrderPartDO.deliverArriveDate}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="旧配件编码"
                      content={dataList.ueOrderPartDO.oldPartCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="旧配件名称"
                      content={dataList.ueOrderPartDO.oldPartName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="旧配件更换数量"
                      content={dataList.ueOrderPartDO.oldPartQty}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="新配件编码"
                      content={dataList.ueOrderPartDO.newPartCode}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="新配件名称"
                      content={dataList.ueOrderPartDO.newPartName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="新配件更换数量"
                      content={dataList.ueOrderPartDO.newPartQty}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="新配件单价"
                      content={dataList.ueOrderPartDO.newPartPrice}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="操作人"
                      content={dataList.ueOrderPartDO.createBy}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="备注"
                      content={dataList.ueOrderPartDO.remark}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="唯一标识"
                      content={dataList.ueOrderPartDO.uniqueId}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("3")}>
                {expand3 ? "收起" : "展开"}
                <Icon type={expand3 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderAppointSiteDO && (
          <div>
            <p style={pStyle}>指派/改派服务商信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderAppointSiteDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderAppointSiteDO.createBy}
                />
              </Col>
            </Row>
            {expand4 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="指派次数"
                      content={dataList.ueOrderAppointSiteDO.appointTimes}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商识别码"
                      content={dataList.ueOrderAppointSiteDO.siteCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商名称"
                      content={dataList.ueOrderAppointSiteDO.siteName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="联系人"
                      content={dataList.ueOrderAppointSiteDO.contactMan}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="联系方式"
                      content={dataList.ueOrderAppointSiteDO.siteMobile}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="省"
                      content={dataList.ueOrderAppointSiteDO.province}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="市"
                      content={dataList.ueOrderAppointSiteDO.city}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="区(县)"
                      content={dataList.ueOrderAppointSiteDO.county}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="镇(街)"
                      content={dataList.ueOrderAppointSiteDO.town}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="详细地址"
                      content={dataList.ueOrderAppointSiteDO.address}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商图片"
                      content={
                        dataList.ueOrderAppointSiteDO.sitePhoto === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderAppointSiteDO.sitePhoto}>
                            图片下载
                          </a>
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="保险单"
                      content={dataList.ueOrderAppointSiteDO.insuranceNo}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="身份照"
                      content={
                        dataList.ueOrderAppointSiteDO.pid === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderAppointSiteDO.pid}>
                            图片下载
                          </a>
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="保险单图片"
                      content={
                        dataList.ueOrderAppointSiteDO.insurancePhoto ===
                        null ? (
                          ""
                        ) : (
                          <a
                            href={dataList.ueOrderAppointSiteDO.insurancePhoto}
                          >
                            图片下载
                          </a>
                        )
                      }
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("4")}>
                {expand4 ? "收起" : "展开"}
                <Icon type={expand4 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderEngineerDO && (
          <div>
            <p style={pStyle}>转派/改派服务师傅信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderEngineerDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderEngineerDO.createBy}
                />
              </Col>
            </Row>
            {expand5 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="指派次数"
                      content={dataList.ueOrderEngineerDO.appointTimes}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商识别码"
                      content={dataList.ueOrderEngineerDO.siteCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商名称"
                      content={dataList.ueOrderEngineerDO.siteName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务师傅识别码"
                      content={dataList.ueOrderEngineerDO.engineerCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务师傅名称"
                      content={dataList.ueOrderEngineerDO.engineerName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="联系方式"
                      content={dataList.ueOrderEngineerDO.engineerMobile}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="身份照"
                      content={
                        dataList.ueOrderEngineerDO.pid === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderEngineerDO.pid}>图片下载</a>
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务师傅图片"
                      content={
                        dataList.ueOrderEngineerDO.engineerPhoto === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderEngineerDO.engineerPhoto}>
                            图片下载
                          </a>
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="保险单"
                      content={dataList.ueOrderEngineerDO.insuranceNo}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="保险单图片"
                      content={
                        dataList.ueOrderEngineerDO.insurancePhoto === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderEngineerDO.insurancePhoto}>
                            图片下载
                          </a>
                        )
                      }
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("5")}>
                {expand5 ? "收起" : "展开"}
                <Icon type={expand5 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderBookOnDoorDO && (
          <div>
            <p style={pStyle}>预约/改约信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderBookOnDoorDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderBookOnDoorDO.createBy}
                />
              </Col>
            </Row>
            {expand6 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约次数"
                      content={dataList.ueOrderBookOnDoorDO.bookTimes}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约操作时间"
                      content={dataList.ueOrderBookOnDoorDO.bookOperateDate}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约上门时间"
                      content={dataList.ueOrderBookOnDoorDO.bookDate}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约备注"
                      content={dataList.ueOrderBookOnDoorDO.remark}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("6")}>
                {expand6 ? "收起" : "展开"}
                <Icon type={expand6 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderProcessDO && (
          <div>
            <p style={pStyle}>服务过程反馈信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderProcessDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderProcessDO.createBy}
                />
              </Col>
            </Row>
            {expand7 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务反馈类型"
                      content={
                        dataList.ueOrderProcessDO.processType === 1
                          ? "服务商确认接单"
                          : dataList.ueOrderProcessDO.processType === 2
                          ? "服务师傅确认上门"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="预约备注"
                      content={dataList.ueOrderProcessDO.remark}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("7")}>
                {expand7 ? "收起" : "展开"}
                <Icon type={expand7 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderFinishDO && (
          <div>
            <p style={pStyle}>服务完工信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderFinishDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="操作人"
                  content={dataList.ueOrderFinishDO.createBy}
                />
              </Col>
            </Row>
            {expand8 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工类型"
                      content={
                        dataList.ueOrderFinishDO.dealResult === 1
                          ? "安装完成"
                          : dataList.ueOrderFinishDO.dealResult === 2
                          ? "维修完成"
                          : dataList.ueOrderFinishDO.dealResult === 3
                          ? "鉴定"
                          : dataList.ueOrderFinishDO.dealResult === 4
                          ? "拆机"
                          : dataList.ueOrderFinishDO.dealResult === 5
                          ? "咨询解释"
                          : dataList.ueOrderFinishDO.dealResult === 6
                          ? "取消"
                          : dataList.ueOrderFinishDO.dealResult === 9
                          ? "其他"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工备注"
                      content={dataList.ueOrderFinishDO.dealRemark}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="故障现象"
                      content={dataList.ueOrderFinishDO.failureName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="故障原因"
                      content={dataList.ueOrderFinishDO.failureReason}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="维修措施"
                      content={dataList.ueOrderFinishDO.fixMethod}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="条码1"
                      content={dataList.ueOrderFinishDO.barcode1}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="条码2"
                      content={dataList.ueOrderFinishDO.Barcode2}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工图片1"
                      content={
                        dataList.ueOrderFinishDO.pic1 === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderFinishDO.pic1}>完工图片</a>
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工图片2"
                      content={
                        dataList.ueOrderFinishDO.pic2 === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderFinishDO.pic2}>完工图片</a>
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工图片3"
                      content={
                        dataList.ueOrderFinishDO.pic3 === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderFinishDO.pic3}>完工图片</a>
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="完工图片4"
                      content={
                        dataList.ueOrderFinishDO.pic4 === null ? (
                          ""
                        ) : (
                          <a href={dataList.ueOrderFinishDO.pic4}>完工图片</a>
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="核销码"
                      content={dataList.ueOrderFinishDO.settleCode}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("8")}>
                {expand8 ? "收起" : "展开"}
                <Icon type={expand8 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        {dataList.ueOrderAssessDO && (
          <div>
            <p style={pStyle}>工单评价上传信息详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务工单号"
                  content={dataList.ueOrderAssessDO.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="评价来源"
                  content={dataList.ueOrderAssessDO.source}
                />
              </Col>
            </Row>
            {expand9 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="整体评价"
                      content={
                        dataList.ueOrderAssessDO.level === 0
                          ? "非常不满意"
                          : dataList.ueOrderAssessDO.level === 1
                          ? "不满意"
                          : dataList.ueOrderAssessDO.level === 2
                          ? "一般"
                          : dataList.ueOrderAssessDO.level === 3
                          ? "满意"
                          : dataList.ueOrderAssessDO.level === 4
                          ? "非常满意"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="评价项目"
                      content={dataList.ueOrderAssessDO.assessItem}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="评价项目结果"
                      content={dataList.ueOrderAssessDO.assessValue}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="操作人"
                      content={dataList.ueOrderAssessDO.createBy}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={() => this.toggle("9")}>
                {expand9 ? "收起" : "展开"}
                <Icon type={expand9 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}
          {dataList.ueOrderArriveDO && (
              <div>
                  <p style={pStyle}>物流到货信息详情</p>
                  <Table
                      dataSource={dataList.ueOrderArriveDO}
                      columns={columns2}
                      bordered
                      size="middle"
                      pagination={false}
                  />
              </div>
          )}
        {dataList.ueOrderCloseDO && (
          <div>
            <p style={pStyle}>工单关闭信息详情</p>
            <Table
              dataSource={dataList.ueOrderCloseDO}
              columns={columns1}
              bordered
              size="middle"
              pagination={false}
            />
          </div>
        )}
      </div>
    );
  }
}

export default DrawerContent;
