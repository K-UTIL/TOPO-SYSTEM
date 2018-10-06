import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MyIcon} from "../../api/ApiConstant";
import {Button, Slider} from "antd";

class ViewTool extends Component {
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
               <Button><MyIcon type={"icon-dapingfangying"}/></Button>
               <Button><MyIcon type={"icon-quanping2"}/></Button>
                <div className="icon-wrapper">
               <MyIcon type={"icon-jian"}/>
                    <Slider {...this.props} onChange={this.handleChange}  />
               <MyIcon type={"icon-jian"}/>
                </div>
               <Button><MyIcon type={"icon-quanping2"}/></Button>

            </div>
        );
    }
}

ViewTool.propTypes = {};

export default ViewTool;

