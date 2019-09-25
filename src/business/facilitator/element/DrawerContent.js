import React, { Component } from "react";
import { Col, Divider, Icon, message, Row, Table } from "antd";
import { loginStatus } from "../../../tool/common/loginStatus";
import Config from "../../../tool/common/Config";

const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 8
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
      dataList: {}
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    this.getOrderDetails();
    console.log(this.state.dataList);
  }

  getOrderDetails = () => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let url = `${Config.UEHCC_SERVICE}ueOrder/selectSiteAll?id=${
      this.props.siteId
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

  toggle = () => {
    const { expand1 } = this.state;
    this.setState({ expand1: !expand1 });
  };

  render() {
    const { expand1, dataList } = this.state;

    const columns1 = [
      {
        title: "师傅名称",
        dataIndex: "engineerName",
        align: "center",
        width: 150,
        key: "engineerName"
      },
      {
        title: "师傅联系方式",
        dataIndex: "engineerMobile",
        align: "center",
        width: 120,
        key: "engineerMobile"
      },
      {
        title: "师傅识别码",
        dataIndex: "engineerCode",
        align: "center",
        key: "engineerCode"
      }
    ];
    const columns2 = [
      {
        title: "省",
        dataIndex: "province",
        align: "center",
        width: 100,
        key: "province"
      },
      {
        title: "市",
        dataIndex: "city",
        align: "center",
        width: 100,
        key: "city"
      },
      {
        title: "区县",
        dataIndex: "county",
        align: "center",
        width: 100,
        key: "county"
      },
      {
        title: "镇街",
        dataIndex: "town",
        align: "center",
        key: "town"
      }
    ];
    const columns3 = [
      {
        title: "一级产品分类",
        dataIndex: "firstLevelCat",
        align: "center",
        width: 120,
        key: "firstLevelCat"
      },
      {
        title: "二级产品分类",
        dataIndex: "secondLevelCat",
        align: "center",
        width: 120,
        key: "secondLevelCat"
      },
      {
        title: "三级产品分类",
        dataIndex: "thirdLevelCat",
        align: "center",
        width: 120,
        key: "thirdLevelCat"
      },
      {
        title: "服务能力（台/天）",
        dataIndex: "serviceQty",
        align: "center",
        key: "serviceQty"
      }
    ];

    return (
      <div>
        {dataList.UeHccSiteDO && (
          <div>
            <p style={pStyle}>服务商详情</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="服务商识别码"
                  content={dataList.UeHccSiteDO[0].siteCode}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="服务商名称"
                  content={dataList.UeHccSiteDO[0].siteName}
                />
              </Col>
            </Row>
            {expand1 && (
              <div>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商联系人"
                      content={dataList.UeHccSiteDO[0].contactMan}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="服务商联系方式"
                      content={dataList.UeHccSiteDO[0].siteMobile}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="省"
                      content={dataList.UeHccSiteDO[0].province}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="市"
                      content={dataList.UeHccSiteDO[0].city}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="区(县)"
                      content={dataList.UeHccSiteDO[0].county}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="镇街"
                      content={dataList.UeHccSiteDO[0].town}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="详细地址"
                      content={dataList.UeHccSiteDO[0].address}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <Divider>
              <a href=" #" onClick={this.toggle}>
                {expand1 ? "收起" : "展开"}
                <Icon type={expand1 ? "up" : "down"} />
              </a>
            </Divider>
          </div>
        )}

        <p style={pStyle}>服务师傅</p>
        <Table
          dataSource={dataList.UeHccSiteEngineerDO}
          columns={columns1}
          bordered
          pagination={false}
          size="middle"
          style={{ marginBottom: 16 }}
          scroll={{ y: 400 }}
        />

        <p style={pStyle}>服务区域</p>
        <Table
          dataSource={dataList.UeHccSiteAreaDO}
          columns={columns2}
          bordered
          pagination={false}
          size="middle"
          style={{ marginBottom: 16 }}
          scroll={{ y: 400 }}
        />
        <p style={pStyle}>服务品类及能力</p>
        <Table
          dataSource={dataList.UeHccSiteServiceCatDO}
          columns={columns3}
          bordered
          pagination={false}
          size="middle"
          style={{ marginBottom: 16 }}
          scroll={{ y: 400 }}
        />
      </div>
    );
  }
}

export default DrawerContent;
