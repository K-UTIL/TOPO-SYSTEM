import React, {Component} from 'react';
import {Button,Icon} from 'antd';
import '../style/css/components/TopoDesigner.css'
import '../style/css/components/customButtons.css'
import DrawTool from "../components/button-groups/DrawTool";
import RedoTool from "../components/button-groups/RedoTool";
import ViewTool from "../components/button-groups/ViewTool";


class TopoDesigner extends Component {


    render() {
        const MyIcon  = Icon.createFromIconfontCN({
            scriptUrl:"//at.alicdn.com/t/font_861547_3hjt3l4hid6.js"
        })

        return (<div>

            <DrawTool/>
            <RedoTool/>
            <ViewTool/>
        </div>)
    }
}

export default TopoDesigner;