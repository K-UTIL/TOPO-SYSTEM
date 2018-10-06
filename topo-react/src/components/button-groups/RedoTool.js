import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from "antd/lib/index";
import {MyIcon} from "../../api/ApiConstant";
import {Button} from "antd";

class RedoTool extends Component {

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
                <Button><MyIcon type={"icon-icon-test"}/></Button>
                <Button><MyIcon type={"icon-icon-test1"}/></Button>
            </div>
        );
    }
}

RedoTool.propTypes = {};

export default RedoTool;
