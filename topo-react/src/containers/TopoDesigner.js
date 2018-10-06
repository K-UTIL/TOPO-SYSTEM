import React, {Component} from 'react';
import {Button,Icon} from 'antd';
import '../style/css/components/TopoDesigner.css'
import '../style/css/components/customButtons.css'
import DrawTool from "../components/button-groups/DrawTool";
import RedoTool from "../components/button-groups/RedoTool";
import ViewTool from "../components/button-groups/ViewTool";
import SystemTool from "../components/button-groups/SystemTool";


class TopoDesigner extends Component {


    render() {

        return (<div>

            <DrawTool/>
            <RedoTool/>
            <ViewTool/>
            <SystemTool/>
        </div>)
    }
}

export default TopoDesigner;