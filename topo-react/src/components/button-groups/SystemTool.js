import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from "antd";
import {MyIcon} from "../../api/ApiConstant";

class SystemTool extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <Button type="primary" size={"large"}><MyIcon type={"icon-save"}/> 保存</Button>
                <Button type="primary" size={"large"}><MyIcon type={"icon-export"}/> 导出</Button>
            </div>
        );
    }
}

SystemTool.propTypes = {};

export default SystemTool;

