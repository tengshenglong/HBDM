import React, { Component } from "react";
import { message, Table, DatePicker } from "antd";
import { loginStatus } from "../../../tool/common/loginStatus";
import Config from "../../../tool/common/Config";

class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      dataList: [],
      timeMillis: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    this.getInfos();
  }

  getInfos = () => {
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
    const { timeMillis } = this.state;
    let url = `${Config.RETAIL_SCHEDULE}job/findByJobProcess?jobClassName=${
      this.props.jobClassName
    }
    &timemillis=${timeMillis}`;
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
            dataList: res.dataList
          });
        } else {
          message.error(res.message);
          this.setState({
            dataList: []
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

  onDateProcess = (date, dateString) => {
    if (dateString.length > 0) {
      let startTime = dateString.replace(new RegExp("-", "gm"), "/");
      let mills = new Date(startTime).getTime();
      this.setState(
        {
          timeMillis: mills
        },
        function() {
          this.getInfos();
        }
      );
    } else {
      this.setState(
        {
          timeMillis: ""
        },
        function() {
          this.getInfos();
        }
      );
    }
  };

  render() {
    const columns = [
      {
        title: "开始时间",
        dataIndex: "startDate",
        align: "center",
        key: "startDate",
        render: data =>
          data ? (
            <span title={this.$moment(data).format("YYYY-MM-DD HH:mm:ss")}>
              {this.$moment(data).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          ) : (
            ""
          )
      },
      {
        title: "结束时间",
        dataIndex: "endDate",
        align: "center",
        key: "endDate",
        render: data =>
          data ? (
            <span
              title={
                data === 0
                  ? "暂无"
                  : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")
              }
            >
              {data === 0
                ? "暂无"
                : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          ) : (
            ""
          )
      },
      {
        title: "运行状况",
        dataIndex: "state",
        align: "center",
        key: "state",
        render: data => <span title={data}>{data}</span>
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: "16px" }}>
          <DatePicker onChange={this.onDateProcess} />
        </div>

        <Table
          dataSource={this.state.dataList}
          loading={this.state.loading}
          columns={columns}
          bordered
          // pagination={{
          //   pageSize: this.state.pageSize,
          //   current: this.state.currentPage,
          //   total: this.state.total,
          //   hideOnSinglePage: true,
          //   showSizeChanger: true,
          //   onShowSizeChange: this.sizeChange,
          //   showTotal: this.showTotalNum,
          //   onChange: this.pageChange
          // }}
        />
      </div>
    );
  }
}

export default ModalContent;
