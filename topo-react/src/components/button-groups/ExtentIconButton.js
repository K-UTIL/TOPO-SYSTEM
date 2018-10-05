import {Button} from "antd";
import {Icon} from "antd/lib/index";
import React, {Component} from 'react';
import {ApiConstant} from "../../api/ApiConstant";

export default class ExtentIconButton extends Component{

    constructor(props) {
        super(props);

    }

    render() {
        const MyIcon =ApiConstant.MyIcon;

        return (
            <Button className={"customBtn extent-bg top"} ghost onClick={this.props.onClick}>
                <MyIcon type={this.props.type}/>
                {this.props.text}
            </Button>
        );
    }
}

