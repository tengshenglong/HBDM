import React, { Component } from "react";
import { Table, Divider, Tag, Form, Drawer, Alert } from "antd";
import SearchBar from "./SearchBar";
import DrawerContent from "./DrawerContent";

const SearchForm = Form.create()(SearchBar);

class TableDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      openKeys: [],
      visible: false
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
    let time = this.$moment(this.state.time).format("YYYY-MM-DD HH:mm:ss");
    console.log(time);
    // this.allList();
  }

  allList = () => {
    let param = new FormData();
    param.append("username", escape("19001492"));
    param.append("pwd", escape("1Q2w3e4r").replace(/\+/g, "%2B"));
    param.append("password", "admin");

    // this.$axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    this.$axios
      .post(`login`, param)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        Promise.reject(error);
      });
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const columns = [
      {
        title: "Name",
        align: "center",
        dataIndex: "name",
        key: "name",
        render: text => (
          <a href=" # " onClick={this.showDrawer}>
            {text}
          </a>
        )
      },
      {
        title: "Age",
        align: "center",
        dataIndex: "age",
        key: "age"
      },
      {
        title: "Address",
        align: "center",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Tags",
        align: "center",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Action",
        align: "center",
        key: "action",
        render: (text, record) => (
          <span>
            <a href=" # ">修改</a>
            <Divider type="vertical" />
            <a href=" # ">删除</a>
          </span>
        )
      }
    ];

    const data = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"]
      },
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"]
      },
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"]
      }
    ];

    return (
      <div style={{ background: "#fff", padding: "8px" }}>
        <SearchForm />
        <div style={{ marginTop: "20px" }}>
          <Alert message="此列表用于展示产品信息！" type="info" />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          style={{ marginTop: "12px" }}
        />
        <Drawer
          width="40%"
          // title="详细信息"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <DrawerContent />
        </Drawer>
      </div>
    );
  }
}

export default TableDemo;
