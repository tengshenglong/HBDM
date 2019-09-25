import React, { Component } from "react";
import { Table, message, Row, Col, Divider, Icon, Button } from "antd";
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
      loading: {
        spinning: false,
        size: "large"
      },
      expand1: true,
      expand2: true,
      expand3: true,
      expand4: true,
      firstList: {},
      secondList: {},
      dataList: {},
      flag: false
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

    this.setState({
      loading: {
        spinning: true,
        size: "large"
      }
    });
    let url = `${Config.CUSTOMER_SERVICE}hccRejects/showDetail?hbdmRowId=${
      this.props.orderNo
    }`;
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
          if (res.dataList !== null) {
            if (res.dataList.length === 2) {
              this.setState({
                firstList: res.dataList[0],
                secondList: res.dataList[1],
                dataList: res.dataList[0],
                flag: true
              });
            } else {
              this.setState({
                firstList: {},
                secondList: {},
                dataList: res.dataList[0],
                flag: false
              });
            }
          }
        } else {
          message.error(res.message);
          this.setState({
            firstList: {},
            secondList: {},
            dataList: {},
            flag: false
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

  toggle = flag => {
    const { expand1, expand2, expand3, expand4 } = this.state;
    if (flag === "1") {
      this.setState({ expand1: !expand1 });
    } else if (flag === "2") {
      this.setState({ expand2: !expand2 });
    } else if (flag === "3") {
      this.setState({ expand3: !expand3 });
    } else if (flag === "4") {
      this.setState({ expand4: !expand4 });
    }
  };

  handleChange = flag => {
    if (flag === "first") {
      const { firstList } = this.state;
      this.setState({
        dataList: firstList
      });
    } else if (flag === "second") {
      const { secondList } = this.state;
      this.setState({
        dataList: secondList
      });
    }
  };

  render() {
    const {
      expand1,
      expand2,
      expand3,
      expand4,
      dataList,
      flag,
      firstList,
      secondList
    } = this.state;
    const columns = [
      {
        title: "描述信息",
        // dataIndex: "hrSkus",
        align: "center",
        key: "hrSkus"
      }
    ];
    return (
      <div>
        {flag && (
          <div style={{ marginBottom: 16 }}>
            <Button onClick={() => this.handleChange("first")} type="primary">
              {firstList.hrSku}(
              {firstList.nyType === 0
                ? "单机"
                : firstList.nyType === 1
                ? "内机"
                : firstList.nyType === 2
                ? "外机"
                : ""}
              )
            </Button>
            <Button
              onClick={() => this.handleChange("second")}
              type="primary"
              style={{ marginLeft: 16 }}
            >
              {secondList.hrSku}(
              {secondList.nyType === 0
                ? "单机"
                : secondList.nyType === 1
                ? "内机"
                : secondList.nyType === 2
                ? "外机"
                : ""}
              )
            </Button>
          </div>
        )}

        {/*<p style={{ ...pStyle, marginBottom: 24 }}>详细信息</p>*/}
        <div>
          <p style={pStyle}>详细信息</p>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="套/单机单号"
                content={dataList.hbdmRowId}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem title="请求单号" content={dataList.reqNum} />
            </Col>
          </Row>
          {expand1 && (
            <div>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="备件条码"
                    content={dataList.partsCodes}
                  />{" "}
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="备件库"
                    content={dataList.sparesStorage}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="入库时间"
                    content={
                      dataList.entryStorageDate
                        ? this.$moment(dataList.entryStorageDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="签收时间"
                    content={
                      dataList.signDate
                        ? this.$moment(dataList.signDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : "拒收"
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="申请时间"
                    content={
                      dataList.applicationDate
                        ? this.$moment(dataList.applicationDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="京东订单号"
                    content={dataList.jdOrderNum}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="是否套机"
                    content={
                      dataList.specification === 0
                        ? "非套机"
                        : dataList.specification === 1
                        ? "套机"
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="套机物料号"
                    content={dataList.tjHrSku}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="SKU编号" content={dataList.jdSku} />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="单机物料号"
                    content={dataList.hrSku}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="京东商场编号"
                    content={dataList.jdMarketCode}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="商品名称"
                    content={dataList.goodName}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="机编"
                    content={dataList.machineCodes}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="内外机辨别"
                    content={
                      dataList.nyType === 0
                        ? "单机"
                        : dataList.nyType === 1
                        ? "内机"
                        : dataList.nyType === 2
                        ? "外机"
                        : ""
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="保修状态"
                    content={
                      dataList.bxStatus === 0
                        ? "未过保修"
                        : dataList.bxStatus === 1
                        ? "已过保修"
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="故障描述"
                    content={dataList.errorMsg}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="反应情况"
                    content={dataList.situation}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="传递HCC日期"
                    content={
                      dataList.hccReqDate
                        ? this.$moment(dataList.hccReqDate).format(
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
                    title="HBDM数据导入日期"
                    content={
                      dataList.createDate
                        ? this.$moment(dataList.createDate).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="HCC失败错误信息"
                    content={dataList.hccRepMsg}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="关单状态"
                    content={
                      dataList.gdStatus === 0
                        ? "正常"
                        : dataList.gdStatus === 1
                        ? "关单"
                        : ""
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="状态"
                    content={
                      dataList.detailStatus === 1
                        ? "导入未处理"
                        : dataList.detailStatus === 2
                        ? "请求HCC成功"
                        : dataList.detailStatus === 3
                        ? "请求HCC失败"
                        : dataList.detailStatus === 4
                        ? "接收HCC鉴定信息"
                        : dataList.detailStatus === 5
                        ? "接收HCC换箱结果"
                        : dataList.detailStatus === 6
                        ? "接收HCC负提单信息"
                        : dataList.detailStatus === 7
                        ? "接收物流入库信息"
                        : dataList.detailStatus === 8
                        ? "关单"
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

        {dataList.resultJdNull && (
          <div>
            <p style={pStyle}>鉴定结果</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="请求单号"
                  content={dataList.hccJdResultView.reqNum}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="现场审核结果"
                  content={
                    dataList.hccJdResultView.xcExamine === 0
                      ? "无机器"
                      : dataList.hccJdResultView.xcExamine === 1
                      ? "同位损"
                      : dataList.hccJdResultView.xcExamine === 2
                      ? "复原归还"
                      : dataList.hccJdResultView.xcExamine === 3
                      ? "退机"
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
                      title="产业审核结果"
                      content={
                        dataList.hccJdResultView.cyExamine === 0
                          ? "无机器"
                          : dataList.hccJdResultView.cyExamine === 1
                          ? "同位损"
                          : dataList.hccJdResultView.cyExamine === 2
                          ? "复原归还"
                          : dataList.hccJdResultView.cyExamine === 3
                          ? "退机"
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="现场鉴定时间"
                      content={
                        dataList.hccJdResultView.xcExTime
                          ? this.$moment(
                              dataList.hccJdResultView.xcExTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="产业审核原因"
                      content={dataList.hccJdResultView.cyExamineCause}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="产业审核时间"
                      content={
                        dataList.hccJdResultView.cyExTime
                          ? this.$moment(
                              dataList.hccJdResultView.cyExTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="HCC响应日期"
                      content={
                        dataList.hccJdResultView.hccRepDate
                          ? this.$moment(
                              dataList.hccJdResultView.hccRepDate
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="图片下载"
                      content={dataList.hccJdResultView.pictures.map(
                        (it, index) => (
                          <a href={it} style={{ marginRight: 8 }}>
                            图片{++index}
                          </a>
                        )
                      )}
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

        {dataList.resultHxNull && (
          <div>
            <p style={pStyle}>换箱结果</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="请求单号"
                  content={dataList.hccHxResultView.reqNum}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="还原结果"
                  content={
                    dataList.hccHxResultView.hxResult === 0
                      ? "还原成功"
                      : dataList.hccHxResultView.hxResult === 1
                      ? "还原失败"
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
                      title="维修结果确认时间"
                      content={
                        dataList.hccHxResultView.wxAffirmTime
                          ? this.$moment(
                              dataList.hccHxResultView.wxAffirmTime
                            ).format("YYYY-MM-DD HH:mm:ss")
                          : ""
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="HCC响应日期"
                      content={
                        dataList.hccHxResultView.hccRepDate
                          ? this.$moment(
                              dataList.hccHxResultView.hccRepDate
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

        {dataList.hccPdFtd && (
          <div>
            <p style={pStyle}>负提单信息</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="退货单号"
                  content={dataList.hccPdFtd.returnNumber}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="38单号"
                  content={dataList.hccPdFtd.bstkde38}
                />
              </Col>
            </Row>
            {expand4 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="80单号"
                      content={dataList.hccPdFtd.vbeln1}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="入库时间"
                      content={
                        dataList.hccPdFtd.cpuDate
                          ? this.$moment(dataList.hccPdFtd.cpuDate).format(
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
                      title="产品大类编码"
                      content={dataList.hccPdFtd.productNo}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="产品大类名称"
                      content={dataList.hccPdFtd.productName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="机器编码"
                      content={dataList.hccPdFtd.customerProductNo}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="产品型号编码"
                      content={dataList.hccPdFtd.prodtypeNo}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="产品型号名称"
                      content={dataList.hccPdFtd.prodtypeName}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="数量"
                      content={dataList.hccPdFtd.tarcetQty}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="退货价"
                      content={dataList.hccPdFtd.retuenPrice}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="库位编码"
                      content={dataList.hccPdFtd.stockNo}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="网点编码"
                      content={dataList.hccPdFtd.serviceNetCode}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="网点名称"
                      content={dataList.hccPdFtd.serviceNetName}
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

        <p style={pStyle}>记录日志</p>
        <Table
          dataSource={dataList.pdSteps}
          columns={columns}
          // rowKey="createdAt"
          bordered
          size="middle"
          pagination={false}
        />
      </div>
    );
  }
}

export default DrawerContent;
