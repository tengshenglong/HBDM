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

class DrawerContentIsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand1: true,
      expand2: false,
      expand3: false,
      expand4: false,
      expand5: false,
      expand6: false,
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

    let url = `${Config.UEHCC_SERVICE}isvOrder/isvOrderAll?orderNo=${
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
      expand6
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
      dataList
    } = this.state;

    const columns = [
      {
        title: "数据插入时间",
        dataIndex: "insertAt",
        align: "center",
        key: "insertAt",
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
        title: "服务单号",
        dataIndex: "orderNo",
        align: "center",
        key: "orderNo"
      },
      {
        title: "服务单项目",
        dataIndex: "serviceTypeIdName",
        align: "center",
        key: "serviceTypeIdName"
      },
      {
        title: "服务项目名称",
        dataIndex: "serviceTypeName",
        align: "center",
        key: "serviceTypeName"
      },
      {
        title: "插入时间",
        dataIndex: "insertAt",
        align: "center",
        key: "insertAt",
        render: text =>
            text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        align: "center",
        key: "updateAt",
        render: text =>
            text ? this.$moment(text).format("YYYY-MM-DD HH:mm:ss") : ""
      }
    ];

    return (
      <div>
        {dataList.isvOrderDo && (
          <div>
            <p style={pStyle}>服务单详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务单号"
                  content={dataList.isvOrderDo.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                    title="订单号"
                    content={dataList.isvOrderDo.orderId}
                />
              </Col>
            </Row>
            {expand1 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务项目附加信息"
                      content={dataList.isvOrderDo.orderServiceRemark}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="商品京东编号"
                      content={dataList.isvOrderDo.jdWareId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="商品名称"
                        content={dataList.isvOrderDo.productName}
                    />
                  </Col>
                <Col span={12}>
                  <DescriptionItem
                      title="商品厂家编号"
                      content={dataList.isvOrderDo.factoryWareId}
                  />
                </Col>
              </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="保修类型"
                        content={
                          dataList.isvOrderDo.orderType === 1
                              ? "厂家安装"
                              : dataList.isvOrderDo.inOrOut === 2
                              ? "厂家售后服务"
                              : dataList.isvOrderDo.inOrOut === 3
                                  ? "厂家系统对接"
                                  : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="售后申请单号"
                        content={dataList.isvOrderDo.serviceOrderId}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="上传路径"
                        content={dataList.isvOrderDo.imageUploadPath}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="下载路径"
                        content={dataList.isvOrderDo.imageDownloadPath}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="生成时间"
                        content={
                          dataList.isvOrderDo.createOrderTime
                              ? this.$moment(dataList.isvOrderDo.createOrderTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                              )
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="售后服务上门时间"
                        content={
                          dataList.isvOrderDo.serviceDate
                              ? this.$moment(dataList.isvOrderDo.serviceDate).format(
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
                        title="用户期望送货时间"
                        content={
                          dataList.isvOrderDo.codDate
                              ? this.$moment(dataList.isvOrderDo.codDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                              )
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="上门时间段"
                        content={dataList.isvOrderDo.expectAtHomePeriod}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="用户期望安装时间"
                        content={
                          dataList.isvOrderDo.daJiaDianInstallDate
                              ? this.$moment(dataList.isvOrderDo.daJiaDianInstallDate).format(
                              "YYYY-MM-DD HH:mm:ss"
                              )
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="状态信息"
                        content={dataList.isvOrderDo.orderStatusMsg}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="插入时间"
                        content={
                          dataList.isvOrderDo.insertAt
                              ? this.$moment(dataList.isvOrderDo.insertAt).format(
                              "YYYY-MM-DD HH:mm:ss"
                              )
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="更新时间"
                        content={
                          dataList.isvOrderDo.updateAt
                              ? this.$moment(dataList.isvOrderDo.updateAt).format(
                              "YYYY-MM-DD HH:mm:ss"
                              )
                              : ""
                        }
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

        <p style={pStyle}>服务单流程</p>
        <Table
          dataSource={dataList.isvOrderHistoryDos}
          columns={columns}
          bordered
          size="middle"
          pagination={false}
          scroll={{ y: 240 }}
          style={{ marginBottom: 16 }}
        />

        {dataList.isvOrderDeliveryDo && (
          <div>
            <p style={pStyle}>物流妥投详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务单号"
                  content={dataList.isvOrderDeliveryDo.orderNo}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="状态信息"
                  content={
                    dataList.isvOrderDeliveryDo.status === 0
                      ? "获取物流妥投时间"
                      : dataList.isvOrderDeliveryDo.status === 1
                      ? "已回传JD,更新成功"
                      : ""
                  }
                />
              </Col>
            </Row>
            {expand2 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="妥投时间"
                      content={
                        dataList.isvOrderDeliveryDo.deliveryTime
                          ? this.$moment(
                              dataList.isvOrderDeliveryDo.deliveryTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="插入时间"
                        content={
                          dataList.isvOrderDeliveryDo.insertAt
                              ? this.$moment(
                              dataList.isvOrderDeliveryDo.insertAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="更新时间"
                        content={
                          dataList.isvOrderDeliveryDo.updateAt
                              ? this.$moment(
                              dataList.isvOrderDeliveryDo.updateAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
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

        {dataList.isvOrderDistributeDo && (
          <div>
            <p style={pStyle}>分配网点详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务单号"
                  content={dataList.isvOrderDistributeDo.orderno}
                />
              </Col>
                <Col span={12}>
                  <DescriptionItem
                      title="分配网点时间"
                      content={
                        dataList.isvOrderDistributeDo.distributeTime
                            ? this.$moment(
                            dataList.isvOrderDistributeDo.distributeTime
                            ).format("YYYY-MM-DD HH:mm:ss")
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
                      title="网点名"
                      content={dataList.isvOrderDistributeDo.distributeOutletsName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="网点电话"
                        content={dataList.isvOrderDistributeDo.distributeOutletsPhone}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="插入时间"
                        content={
                          dataList.isvOrderDistributeDo.insertAt
                              ? this.$moment(
                              dataList.isvOrderDistributeDo.insertAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="更新时间"
                        content={
                          dataList.isvOrderDistributeDo.updateAt
                              ? this.$moment(
                              dataList.isvOrderDistributeDo.updateAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
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

        {dataList.isvOrderAssignDo && (
          <div>
            <p style={pStyle}>预约/派工详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务单号"
                  content={dataList.isvOrderAssignDo.orderno}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                    title="派工时间"
                    content={
                      dataList.isvOrderAssignDo.assignTime
                          ? this.$moment(
                          dataList.isvOrderAssignDo.assignTime
                          ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                    }
                />
              </Col>
            </Row>
            {expand4 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="上门时间"
                        content={
                          dataList.isvOrderAssignDo.atHomeTime
                              ? this.$moment(
                              dataList.isvOrderAssignDo.atHomeTime
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="工程师名"
                        content={dataList.isvOrderAssignDo.assignerName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="工程师电话"
                      content={dataList.isvOrderAssignDo.assignerTel}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="插入时间"
                        content={
                          dataList.isvOrderAssignDo.insertAt
                              ? this.$moment(
                              dataList.isvOrderAssignDo.insertAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="更新时间"
                        content={
                          dataList.isvOrderAssignDo.updateAt
                              ? this.$moment(
                              dataList.isvOrderAssignDo.updateAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
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

        {dataList.isvOrderAssignDoa && (
          <div>
            <p style={pStyle}>另约/改派详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                    title="服务单号"
                    content={dataList.isvOrderAssignDoa.orderno}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                    title="回传信息"
                    content={
                      dataList.isvOrderAssignDoa.messageType === 1
                          ? "另约"
                          : dataList.isvOrderAssignDoa.messageType === 2
                          ? "改派"
                          : ""
                    }
                />
              </Col>
            </Row>
            {expand5 && (
                <div>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                          title="派工时间"
                          content={
                            dataList.isvOrderAssignDoa.assignTime
                                ? this.$moment(
                                dataList.isvOrderAssignDoa.assignTime
                                ).format("YYYY-MM-DD HH:mm:ss")
                                : ""
                          }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                          title="上门时间"
                          content={
                            dataList.isvOrderAssignDoa.atHomeTime
                                ? this.$moment(
                                dataList.isvOrderAssignDoa.atHomeTime
                                ).format("YYYY-MM-DD HH:mm:ss")
                                : ""
                          }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                          title="工程师名"
                          content={dataList.isvOrderAssignDoa.assignerName}
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                          title="工程师电话"
                          content={dataList.isvOrderAssignDoa.assignerTel}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                          title="插入时间"
                          content={
                            dataList.isvOrderAssignDoa.insertAt
                                ? this.$moment(
                                dataList.isvOrderAssignDoa.insertAt
                                ).format("YYYY-MM-DD HH:mm:ss")
                                : ""
                          }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                          title="更新时间"
                          content={
                            dataList.isvOrderAssignDoa.updateAt
                                ? this.$moment(
                                dataList.isvOrderAssignDoa.updateAt
                                ).format("YYYY-MM-DD HH:mm:ss")
                                : ""
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

        {dataList.isvOrderEndDo && (
          <div>
            <p style={pStyle}>上门完成详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务单号"
                  content={dataList.isvOrderEndDo.orderno}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="反馈结果"
                  content={
                    dataList.isvOrderEndDo.serviceEndState === 0
                        ? "上门完成"
                        : dataList.isvOrderEndDo.serviceEndState === 1
                        ? "取消"
                        : dataList.isvOrderEndDo.serviceEndState === 2
                        ? "上门(鉴定)完成"
                        : ""
                  }
                />
              </Col>
            </Row>
            {expand6 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="二级反馈结果描述"
                      content={dataList.isvOrderEndDo.serviceEndStateLevelTowDescribe}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="完成/取消时间"
                        content={
                          dataList.isvOrderEndDo.serviceEndTime
                              ? this.$moment(
                              dataList.isvOrderEndDo.serviceEndTime
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="备注"
                      content={dataList.isvOrderEndDo.cancelRemark}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                        title="插入时间"
                        content={
                          dataList.isvOrderEndDo.insertAt
                              ? this.$moment(
                              dataList.isvOrderEndDo.insertAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                        title="更新时间"
                        content={
                          dataList.isvOrderEndDo.updateAt
                              ? this.$moment(
                              dataList.isvOrderEndDo.updateAt
                              ).format("YYYY-MM-DD HH:mm:ss")
                              : ""
                        }
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
        {dataList.isvOrderServiceDos && (
            <div>
              <p style={pStyle}>服务项目名称信息</p>
              <Table
                  dataSource={dataList.isvOrderServiceDos}
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

export default DrawerContentIsv;
