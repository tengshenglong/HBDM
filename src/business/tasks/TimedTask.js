import React, { Component } from "react";
import { Divider, message, Popconfirm, Table } from "antd";
import ConditionSelector from "../../tool/component/shared/conditionSelector";
import style from "./style.module.less";
import { loginStatus } from "../../tool/common/loginStatus";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import Config from "../../tool/common/Config";
import ModalContent from "./element/ModalContent";

class TimedTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: {
        spinning: false,
        size: "large"
      },
      flag: false,
      visible: false,
      dataRecord: "",
      title: "",
      modalTitle: "",
      dataList: [],
      classPath: "",
      description: "",
      jobClassName: "",
      addOrUpdate: 0
    };
  }

  componentWillMount() {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    this.getTasks();
  }

  getTasks = () => {
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
    const { classPath, description } = this.state;
    let url = `${Config.RETAIL_SCHEDULE}job/queryjob?jobClassName=${classPath}
    &jobDescription=${description}`;
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

  resetCondition = () => {
    this.setState(
      {
        currentPage: 1,
        classPath: "",
        description: ""
      },
      () => this.getTasks()
    );
  };

  toShow = record => () => {
    if (record) {
      this.setState({
        title: "修改定时任务",
        addOrUpdate: 1
      });
    } else {
      this.setState({
        title: "新增定时任务",
        addOrUpdate: 0
      });
    }
    let recorder = record ? record : "";
    this.setState({
      flag: true,
      dataRecord: recorder
    });
  };

  onExecute = record => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let params = new FormData();
    params.append("jobClassName", record.jobClassName);
    params.append("jobGroupName", record.triggerGroup);

    let url = `${Config.RETAIL_SCHEDULE}job/resumejob`;

    this.$axios
      .post(url, params)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.getTasks();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  onPause = record => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let params = new FormData();
    params.append("jobClassName", record.jobClassName);
    params.append("jobGroupName", record.triggerGroup);

    let url = `${Config.RETAIL_SCHEDULE}job/pausejob`;

    this.$axios
      .post(url, params)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.getTasks();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  handleDelete = record => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }
    let params = new FormData();
    params.append("jobClassName", record.jobClassName);
    params.append("jobGroupName", record.triggerGroup);

    let url = `${Config.RETAIL_SCHEDULE}job/deletejob`;

    this.$axios
      .post(url, params)
      .then(res => {
        if (res.flag) {
          message.success(res.message);
          this.getTasks();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };
  cancel = () => {
    this.setState({
      flag: false
    });
  };

  cancelModal = () => {
    this.setState({
      visible: false
    });
  };

  handleInputChange = e => {
    let id = e.target.id;
    if (id === "classPath") {
      this.setState({
        classPath: e.target.value
      });
    } else if (id === "description") {
      this.setState({
        description: e.target.value
      });
    }
  };

  renderContent = () => {
    return (
      <FormContent
        handleCancel={this.cancel}
        handleSubmit={this.submit}
        content={this.state.dataRecord}
      />
    );
  };

  renderModalContent = () => {
    return <ModalContent jobClassName={this.state.jobClassName} />;
  };

  submit = values => {
    //判断登陆状态
    if (loginStatus() === false) {
      return;
    }

    let params = new FormData();
    params.append("jobDescription", values.jobDescription);
    params.append("jobClassName", values.jobClassName);
    params.append("cronExpression", values.cronExpression);
    params.append("jobGroupName", values.jobGroupName);

    let url = `${Config.RETAIL_SCHEDULE}job/addjob`;
    if (this.state.addOrUpdate === 1) {
      url = `${Config.RETAIL_SCHEDULE}job/reschedulejob`;
    }

    this.$axios
      .post(url, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.getTasks();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  showProcessModal = record => {
    this.setState({
      jobClassName: record.jobClassName,
      visible: true,
      modalTitle: `类名：${record.jobClassName}  (描述：${
        record.description
      })---执行状态`
    });
  };

  render() {
    const columns = [
      {
        title: "类路径",
        dataIndex: "jobClassName",
        align: "center",
        key: "jobClassName",
        render: (data, record) => (
          <span title={data}>
            <a href="# " onClick={() => this.showProcessModal(record)}>
              {data}
            </a>
          </span>
        )
      },
      {
        title: "分组名称",
        dataIndex: "triggerGroup",
        align: "center",
        key: "triggerGroup",
        render: data => <span title={data}>{data}</span>
      },
      {
        title: "描述信息",
        align: "center",
        dataIndex: "description",
        key: "description",
        render: data => <span title={data}>{data}</span>
      },
      {
        title: "状态",
        dataIndex: "triggerState",
        align: "center",
        key: "triggerState",
        render: data => <span title={data}>{data}</span>
      },
      {
        title: "CRON表达式",
        dataIndex: "timeZoneId",
        align: "center",
        key: "timeZoneId",
        render: data => <span title={data}>{data}</span>
      },
      {
        title: "创建日期",
        dataIndex: "createTime",
        align: "center",
        key: "createTime",
        render: data =>
          data ? (
            <span title={this.$moment(data).format("YYYY-MM-DD")}>
              {this.$moment(data).format("YYYY-MM-DD")}
            </span>
          ) : (
            ""
          )
      },
      {
        title: "上一次执行时间",
        dataIndex: "prevFireTime",
        align: "center",
        key: "prevFireTime",
        render: data =>
          data ? (
            <span
              title={
                data === -1
                  ? "暂无"
                  : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")
              }
            >
              {data === -1
                ? "暂无"
                : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          ) : (
            ""
          )
      },
      {
        title: "下一次执行时间",
        dataIndex: "nextFireTime",
        align: "center",
        key: "nextFireTime",
        render: (data, record) => (
          <span
            title={
              record.triggerState === "异常" ||
              record.triggerState === "暂停执行" ||
              record.triggerState === "完成(可能异常中断)"
                ? "暂无"
                : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")
            }
          >
            {record.triggerState === "异常" ||
            record.triggerState === "暂停执行" ||
            record.triggerState === "完成(可能异常中断)"
              ? "暂无"
              : this.$moment(data).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        )
      },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
        width: 200,
        render: (text, record) => {
          return (
            <span>
              <Popconfirm
                title="是否执行?"
                onConfirm={() => this.onExecute(record)}
              >
                <a href=" #">执行</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否暂停?"
                onConfirm={() => this.onPause(record)}
              >
                <a href=" #">暂停</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href=" #" onClick={this.toShow(record)}>
                修改
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除?"
                onConfirm={() => this.handleDelete(record)}
              >
                <a href=" #">删除</a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];

    const conditionConfig = [
      {
        label: "类路径",
        type: "input",
        value: "classPath",
        options: null,
        style: { width: 300 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "classPath",
          value: this.state.classPath,
          onChange: this.handleInputChange
        }
      },
      {
        label: "描述",
        type: "input",
        value: "description",
        options: null,
        style: { width: 300 },
        componentOptions: {
          placeholder: "请输入",
          style: { width: 200 },
          id: "description",
          value: this.state.description,
          onChange: this.handleInputChange
        }
      }
    ];

    return (
      <div>
        <ConditionSelector
          conditions={conditionConfig}
          onSubmit={this.getTasks}
          reset={this.resetCondition}
          isCustom
          customName="添加定时任务"
          customBtnClick={this.toShow()}
        />
        <section className={style["table-wrapper"]}>
          <CustomModal
            title={this.state.title}
            flag={this.state.flag}
            handleContent={this.renderContent()}
            hide={this.cancel}
          />
          <CustomModal
            title={this.state.modalTitle}
            flag={this.state.visible}
            handleContent={this.renderModalContent()}
            hide={this.cancelModal}
            customWidth={1000}
          />
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
            // scroll={{ y: 400 }}
          />
        </section>
      </div>
    );
  }
}

export default TimedTask;
