import React, { Component } from "react";
import style from "./style.module.less";
import CustomModal from "../../tool/component/shared/modal";
import FormContent from "./element/FormContent";
import { message, Tree, Row, Col, Button, Icon } from "antd";
import Config from "../../tool/common/Config";
import { loginStatus } from "../../tool/common/loginStatus";

const { TreeNode } = Tree;

export default class MenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: {},
      flag: false,
      dataRecord: "",
      title: "",
      treeData: [],
      dataList: [],
      expandedKeys: [],
      autoExpandParent: true,
      projectList: [], //模块列表
      checkedKeys: [],
      selectedKeys: [],
      showItem: ""
    };
  }

  componentWillMount() {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }
    this.findAllResource();
    this.findAllProject();

  }
  /*
  查找所有模块
  */
  findAllProject = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}project/findAllProject`)
      .then(res => {
        if (res.flag) {
          this.setState({
            projectList: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  //查询所有菜单
  findAllResource = () => {
    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}resource/findAllResource`)
      .then(res => {
        if (res.flag) {
          const treeData = [];
          res.dataList.map(num => {
            if (num.parentId === 1) {
              let a = {
                title: num.name,
                key: num.id,
                children: []
              };
              res.dataList.map(data => {
                if (data.parentId === num.id) {
                  a.children.push({
                    title: data.name,
                    key: data.id
                  });
                }
                return "";
              });
              treeData.push(a);
            }
            return "";
          });
          this.setState({
            treeData: treeData,
            dataList: res.dataList
          });
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  toShow = () => {
    let { checkedKeys, dataList } = this.state;
    if (checkedKeys.length > 0) {
      if (
        checkedKeys.length === 1 &&
        dataList.filter(it => it.id === parseInt(checkedKeys[0]))[0]
          .parentId === 1
      ) {
        this.setState({
          title: "添加二级菜单",
          showItem: "2",
          flag: true,
          dataRecord: ""
        });
      }
    } else {
      this.setState({
        title: "添加一级菜单",
        showItem: "1",
        flag: true,
        dataRecord: ""
      });
    }
  };

  handleDelete = () => {
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    let { checkedKeys } = this.state;
    if (checkedKeys.length !== 1) {
      message.error("请选择一条记录");
      return;
    }

    this.$axios
      .get(`${Config.AUTHORITY_SERVICE}resource/delResourceById?resourceId=${checkedKeys[0]}`)
      .then(res => {
        if (res.flag) {
          this.setState({
            checkedKeys: []
          });
          message.success(res.message);
          this.findAllResource();
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
      checkedKeys: [],
      selectedKeys: [],
      flag: false
    });
  };

  submit = values => {
    console.log(values);
    //判断登陆状态
    if(loginStatus()===false){
      return;
    }

    const { checkedKeys, showItem, dataRecord } = this.state;
    let params = new FormData();
    let url = "";
    let parentId;

    if (dataRecord) {
      //修改
      if (dataRecord.parentId === 1) {
        url = "";
      } else {
        url = values.url;
      }
      parentId = dataRecord.parentId;
      params.append("resourceId", dataRecord.id);
    } else {
      //新增
      if (showItem === "1") {
        parentId = 1;
        url = "";
      } else {
        parentId = checkedKeys[0];
        url = values.url;
      }
    }

    params.append("resourceName", values.name);
    params.append("parentId", parentId);
    params.append("url", url);
    params.append("location", values.location);
    params.append("project", values.project);

    this.$axios
      .post(`${Config.AUTHORITY_SERVICE}resource/addOrUpdateResource`, params)
      .then(res => {
        if (res.flag) {
          this.cancel();
          message.success(res.message);
          this.findAllResource();
        } else {
          message.error(res.message);
        }
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  renderContent = () => {
    return (
      <FormContent
        handleCancel={this.cancel}
        handleSubmit={this.submit}
        content={this.state.dataRecord}
        projectList={this.state.projectList}
        showItem={this.state.showItem}
      />
    );
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys: checkedKeys.checked });
  };

  onSelect = selectedKeys => {
    let record = this.state.dataList.filter(
      it => it.id === parseInt(selectedKeys[0])
    )[0];

    if (record.parentId === 1) {
      this.setState({
        title: "修改一级菜单",
        showItem: "1"
      });
    } else {
      this.setState({
        title: "修改二级菜单",
        showItem: "2"
      });
    }
    this.setState({
      selectedKeys: selectedKeys,
      flag: true,
      dataRecord: record
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const {
      treeData,
      title,
      flag,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys
    } = this.state;

    return (
      <div>
        <section className={style["table-wrapper"]}>
          <Row type="flex" justify="end">
            {/*<Col xxl={2} xl={2} lg={8} md={10}>*/}
              {/*<Button type="primary" onClick={this.toShow}>*/}
                {/*<Icon type="plus" />*/}
                {/*新增*/}
              {/*</Button>*/}
            {/*</Col>*/}
            <Col xxl={2} xl={2} lg={8} md={10}>
              <Button type="primary" onClick={this.toShow}>
                <Icon type="plus" />
                新增
              </Button>
            </Col>

            <Col xxl={2} xl={2} lg={8} md={10}>
              <Button type="primary" onClick={this.handleDelete}>
                <Icon type="delete" />
                删除
              </Button>
            </Col>
          </Row>

          <CustomModal
            title={title}
            flag={flag}
            handleContent={this.renderContent()}
            hide={this.cancel}
          />
          <div style={{ marginLeft: "10%" }}>
            <Tree
              checkable
              checkStrictly
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={selectedKeys}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </div>
        </section>
      </div>
    );
  }
}
