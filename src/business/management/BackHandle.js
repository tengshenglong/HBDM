import React, {Component} from 'react';
import style from "./style.module.less";
import {Button,Col,message,Input,Alert} from 'antd';
import { loginStatus } from "../../tool/common/loginStatus";
import Config from "../../tool/common/Config";

class BackHandle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            data: [],
            dateFormat: 'YYYY-MM-DD',
            message:"",
            addable: false,
            loading: {
                spinning: false,
                size: 'large'
            },
            partsCodes:""
        };
    }

    //获取查询条件数据
    receiveData = (data) => {
        this.setState(data)
    };

    componentWillMount() {
        if (loginStatus() === false) {
            return;
        }
    }

    //输入框帮函数
    conditionChange= (e) =>{
        // let value=encodeURI(e.target.value);
        let value = e.target.value;
        if (e.target.name === "partsCodes") {
            // this.setState({
            //     fileName: value
            // });
            this.receiveData({partsCodes: value});
        }
    };

    setPartsCodes = () => {

        //判断登陆状态
        if(loginStatus()===false){
            return;
        }

        let partsCodes = this.state.partsCodes;
        if (partsCodes.trim() == ""||partsCodes.trim() == null) {
            message.error("请输入数据！");
            return;
        }
        // partsCodes = partsCodes.replace("，",",");
        partsCodes = partsCodes.replace(/，/ig,',');
        let newpartsCodes = partsCodes.split(",")
        console.log(newpartsCodes)
        this.$axios
            .get(`${Config.CUSTOMER_SERVICE}hccRejects/afreshHccReqNum?partsCodes=${newpartsCodes}`) //${Config.ajaxUrl}
            .then(res => {
                if (res.flag) {
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            })
            .catch(error => {
                Promise.reject(error);
            });
    };

    toTautologyHccJd = () => {

        //判断登陆状态
        if(loginStatus()===false){
            return;
        }

        this.$axios
            .get(`${Config.CUSTOMER_SERVICE}hccRejects/toTautologyHccJd`)
            .then(res => {
                if (res.flag) {
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            })
            .catch(error => {
                Promise.reject(error);
            });
    };
    toHccJd = () => {

        //判断登陆状态
        if(loginStatus()===false){
            return;
        }


        this.$axios
            .get(`${Config.CUSTOMER_SERVICE}hccRejects/toHccJd`)
            .then(res => {
                if (res.flag) {
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            })
            .catch(error => {
                Promise.reject(error);
            });
    };

    render() {

        return <div className={style["table-wrapper"]}>
            <span style={{
                marginLeft: '40%', lineHeight: '1.4rem',
                fontSize: '1.2rem',
                color: '#272727',
                marginTop: '50px',
                paddingBottom: '20px'
            }}>不良品</span>
            <br/>
            <div style={{marginTop: '20px',
                borderTop: '3px solid #F0F2F5', paddingTop: '10px', paddingBottom: '30px'}}>
                <Col xl={10}>
                    <span className='tagRight'>备件码：</span>
                    <Input placeholder="请输入" className='commonWidth' id="partsCodes" name="partsCodes" style={{width:370}}
                           type="text"
                           onChange={this.conditionChange.bind(this)}/>
                    <span style={{color:'red'}}>*</span>
                </Col>
                <Col xl={3}>
                    <Button type="primary" onClick={this.setPartsCodes.bind(this)}>重新生成请求单号</Button>
                </Col>
                <Col xl={10} style={{marginLeft: '20px',width:'400px'}}>
                    <Alert message="根据备件条码重新生成请求单号，并重新请求HCC处理" type="info"/>
                </Col>
            </div>
            <br/>
            <div style={{paddingBottom: '30px'}}>
                <Col xl={2} className='commonMarginTop'>
                    <Button type="primary" onClick={this.toTautologyHccJd.bind(this)}>手动执行</Button>
                </Col>
                <Col xl={6} className='commonMarginTop'>
                    <Alert message="重新发送HCC鉴定失败数据" type="info"/>
                </Col>
            </div>
            <br/>
            <div style={{paddingBottom: '30px'}}>
                <Col xl={2} className='commonMarginTop'>
                    <Button type="primary" onClick={this.toHccJd.bind(this)}>手动执行</Button>
                </Col>
                <Col xl={6} className='commonMarginTop'>
                    <Alert message="手动执行发送HCC鉴定(未请求鉴定数据)" type="info"/>
                </Col>
            </div>
        </div>;
    }
}

BackHandle.propTypes = {};

export default BackHandle;
