import {ParamHolder} from "../data/ParamHolder";
import {layer} from "../../index";
import * as $ from  'jquery';


enum ToolMode {
    NO_STATUS = 0,
    LINE_MODE,
    TEXT_MODE,
    CHOICE_MODE
}

export class TopToolManager {
    static choiceTool: ChoiceTool;
    static textTool: TextTool;
    static lineTool: LineTool;
    static deleteTool: DeleteTool;

    private static toolMode: ToolMode = ToolMode.NO_STATUS;

    static init() {
        this.choiceTool = new ChoiceTool($("#tool-choice"), ParamHolder.network);
        this.textTool = new TextTool($("#tool-text"), ParamHolder.network);
        this.lineTool = new LineTool($("#tool-line"), ParamHolder.network);
        this.deleteTool = new DeleteTool($("#tool-delete"), ParamHolder.network);
        this.initEvent();
    }

    private static initEvent() {
        const me = this;
        this.choiceTool.$container.on('click', function (e: any) {
            if (me.toolMode == ToolMode.CHOICE_MODE) {
                me.choiceTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            } else {
                me.textTool.release();
                me.lineTool.release();
                me.choiceTool.select();
                me.toolMode = ToolMode.CHOICE_MODE;
            }
        })

        this.textTool.$container.on('click', function (e: any) {
            if (me.toolMode == ToolMode.TEXT_MODE) {
                me.textTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            } else {
                me.choiceTool.release();
                me.lineTool.release();
                me.textTool.select();
                me.toolMode = ToolMode.TEXT_MODE;
            }
        })

        this.lineTool.$container.on('click', function (e: any) {
            if (me.toolMode == ToolMode.LINE_MODE) {
                me.lineTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            } else {
                me.textTool.release();
                me.choiceTool.release();
                me.lineTool.select();
                me.toolMode = ToolMode.LINE_MODE;
            }
        })

        this.deleteTool.$container.on('click', function (e: any) {
            me.deleteTool.press();
        })
    }


}


interface TopVisTool {
    select(): void;

    release(): void;
}

class ChoiceTool implements TopVisTool {
    private _$container: any;//jquery对象
    private network: any;//Vis.network


    get $container(): any {
        return this._$container;
    }

    constructor($container: any, network: any) {
        this._$container = $container;
        this.network = network;
    }

    public release() {
        this.network.setOptions({
            interaction: {
                multiselect: false
            }
        });
        this.$container.removeClass('selected');
    }

    public select() {
        this.network.setOptions({
            interaction: {
                multiselect: true
            }
        });
        this.$container.addClass('selected');
    }

}

class TextTool implements TopVisTool {
    private _$container: any;//jquery对象
    private network: any;//Vis.network
    private nodeDataset: any;
    private edgeDataset: any;
    private selectFlag: boolean;

    get $container(): any {
        return this._$container;
    }

    constructor($container: any, network: any) {
        this._$container = $container;
        this.network = network;
        this.nodeDataset = network.edgesHandler.body.data.nodes;
        this.edgeDataset = network.edgesHandler.body.data.edges;
        this.selectFlag = false;
        this.initEvent();
    }

    public release() {
        this.selectFlag = false;
        this.$container.removeClass('selected');

    }

    public select() {
        this.selectFlag = true;
        this.$container.addClass('selected');
    }

    private initEvent() {
        var me = this;
        this.network.on('click', function (param: any) {
            if (me.selectFlag) {//文本编辑模式
                if (param.nodes.length !== 0) {//点击了节点
                    me.showEditNodeLabelLayer(param.nodes[0]);
                } else if (param.edges.length !== 0) {//点击了边线
                    me.showEditEdgeLabelLayer(param.edges[0]);
                } else {//点击空白处
                }
            }
        })
    }

    showEditNodeLabelLayer(id: string) {
        var node = this.nodeDataset.get(id);
        layer.prompt({
            formType: 2,
            value: node.label,
            title: '修改标题',
            area: ['200px', '100px'] //自定义文本域宽高
        }, function (value: any, index: any, elem: any) {
            ParamHolder.info.nodes.update({
                id: node.id,
                label: value
            });
            layer.close(index);
        });
    }

    showEditEdgeLabelLayer(id: string) {
        var node = this.edgeDataset.get(id);
        layer.prompt({
            formType: 2,
            value: node.label,
            title: '修改标题',
            area: ['200px', '100px'] //自定义文本域宽高
        }, function (value: any, index: any, elem: any) {
            ParamHolder.info.edges.update({
                id: node.id,
                label: value
            });
            layer.close(index);
        });
    }
}

class LineTool implements TopVisTool {
    private _$container: any;//jquery对象
    private network: any;//Vis.network


    get $container(): any {
        return this._$container;
    }

    constructor($container: any, network: any) {
        this._$container = $container;
        this.network = network;
    }

    public release() {
        this.network.disableEditMode();
        this.$container.removeClass('selected');
    }

    public select() {
        this.network.addEdgeMode();
        this.$container.addClass('selected');
    }
}

export class DeleteTool {
    private _$container: any;//jquery对象
    private network: any;//Vis.network


    get $container(): any {
        return this._$container;
    }

    constructor($container: any, network: any) {
        this._$container = $container;
        this.network = network;
    }

    public press() {
        var me = this;
        var selection = me.network.getSelection();
        if (selection.nodes.length === 0 && selection.edges.length === 0) {
            return;
        }
        layer.confirm('确认删除选中的节点/线？', {icon: 3, title: '提示'}, function (index:any) {
            me.network.deleteSelected();
            layer.close(index);
        });
    }
}