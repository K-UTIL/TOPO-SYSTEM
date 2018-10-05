import React, {Component} from 'react';
import ExtentIconButton from "./ExtentIconButton";

// TODO: 2018/10/5 luoji
export default class DrawTool  extends Component{


    render() {
        return(<div>
            <ExtentIconButton type={"icon-mousepointer1"} text={"选择工具"}/>
            <ExtentIconButton type={"icon-text-a-o"} text={"文本"}/>
            <ExtentIconButton type={"icon-ic_lines-copy"} text={"连接线"}/>
            <ExtentIconButton type={"icon-delete"} text={"删除选中"}/>
        </div>);
    }
}


