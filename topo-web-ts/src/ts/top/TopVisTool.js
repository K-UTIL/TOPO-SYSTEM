import { ParamHolder } from "../data/ParamHolder";
import { layer } from "../../index";
import * as $ from 'jquery';
var ToolMode;
(function (ToolMode) {
    ToolMode[ToolMode["NO_STATUS"] = 0] = "NO_STATUS";
    ToolMode[ToolMode["LINE_MODE"] = 1] = "LINE_MODE";
    ToolMode[ToolMode["TEXT_MODE"] = 2] = "TEXT_MODE";
    ToolMode[ToolMode["CHOICE_MODE"] = 3] = "CHOICE_MODE";
})(ToolMode || (ToolMode = {}));
var TopToolManager = /** @class */ (function () {
    function TopToolManager() {
    }
    TopToolManager.init = function () {
        this.choiceTool = new ChoiceTool($("#tool-choice"), ParamHolder.network);
        this.textTool = new TextTool($("#tool-text"), ParamHolder.network);
        this.lineTool = new LineTool($("#tool-line"), ParamHolder.network);
        this.deleteTool = new DeleteTool($("#tool-delete"), ParamHolder.network);
        this.initEvent();
    };
    TopToolManager.initEvent = function () {
        var me = this;
        this.choiceTool.$container.on('click', function (e) {
            if (me.toolMode == ToolMode.CHOICE_MODE) {
                me.choiceTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            }
            else {
                me.textTool.release();
                me.lineTool.release();
                me.choiceTool.select();
                me.toolMode = ToolMode.CHOICE_MODE;
            }
        });
        this.textTool.$container.on('click', function (e) {
            if (me.toolMode == ToolMode.TEXT_MODE) {
                me.textTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            }
            else {
                me.choiceTool.release();
                me.lineTool.release();
                me.textTool.select();
                me.toolMode = ToolMode.TEXT_MODE;
            }
        });
        this.lineTool.$container.on('click', function (e) {
            if (me.toolMode == ToolMode.LINE_MODE) {
                me.lineTool.release();
                me.toolMode = ToolMode.NO_STATUS;
            }
            else {
                me.textTool.release();
                me.choiceTool.release();
                me.lineTool.select();
                me.toolMode = ToolMode.LINE_MODE;
            }
        });
        this.deleteTool.$container.on('click', function (e) {
            me.deleteTool.press();
        });
    };
    TopToolManager.toolMode = ToolMode.NO_STATUS;
    return TopToolManager;
}());
export { TopToolManager };
var ChoiceTool = /** @class */ (function () {
    function ChoiceTool($container, network) {
        this._$container = $container;
        this.network = network;
    }
    Object.defineProperty(ChoiceTool.prototype, "$container", {
        get: function () {
            return this._$container;
        },
        enumerable: true,
        configurable: true
    });
    ChoiceTool.prototype.release = function () {
        this.network.setOptions({
            interaction: {
                multiselect: false
            }
        });
        this.$container.removeClass('selected');
    };
    ChoiceTool.prototype.select = function () {
        this.network.setOptions({
            interaction: {
                multiselect: true
            }
        });
        this.$container.addClass('selected');
    };
    return ChoiceTool;
}());
var TextTool = /** @class */ (function () {
    function TextTool($container, network) {
        this._$container = $container;
        this.network = network;
        this.nodeDataset = network.edgesHandler.body.data.nodes;
        this.edgeDataset = network.edgesHandler.body.data.edges;
        this.selectFlag = false;
        this.initEvent();
    }
    Object.defineProperty(TextTool.prototype, "$container", {
        get: function () {
            return this._$container;
        },
        enumerable: true,
        configurable: true
    });
    TextTool.prototype.release = function () {
        this.selectFlag = false;
        this.$container.removeClass('selected');
    };
    TextTool.prototype.select = function () {
        this.selectFlag = true;
        this.$container.addClass('selected');
    };
    TextTool.prototype.initEvent = function () {
        var me = this;
        this.network.on('click', function (param) {
            if (me.selectFlag) { //文本编辑模式
                if (param.nodes.length !== 0) { //点击了节点
                    me.showEditNodeLabelLayer(param.nodes[0]);
                }
                else if (param.edges.length !== 0) { //点击了边线
                    me.showEditEdgeLabelLayer(param.edges[0]);
                }
                else { //点击空白处
                }
            }
        });
    };
    TextTool.prototype.showEditNodeLabelLayer = function (id) {
        var node = this.nodeDataset.get(id);
        layer.prompt({
            formType: 2,
            value: node.label,
            title: '修改标题',
            area: ['200px', '100px'] //自定义文本域宽高
        }, function (value, index, elem) {
            ParamHolder.info.nodes.update({
                id: node.id,
                label: value
            });
            layer.close(index);
        });
    };
    TextTool.prototype.showEditEdgeLabelLayer = function (id) {
        var node = this.edgeDataset.get(id);
        layer.prompt({
            formType: 2,
            value: node.label,
            title: '修改标题',
            area: ['200px', '100px'] //自定义文本域宽高
        }, function (value, index, elem) {
            ParamHolder.info.edges.update({
                id: node.id,
                label: value
            });
            layer.close(index);
        });
    };
    return TextTool;
}());
var LineTool = /** @class */ (function () {
    function LineTool($container, network) {
        this._$container = $container;
        this.network = network;
    }
    Object.defineProperty(LineTool.prototype, "$container", {
        get: function () {
            return this._$container;
        },
        enumerable: true,
        configurable: true
    });
    LineTool.prototype.release = function () {
        this.network.disableEditMode();
        this.$container.removeClass('selected');
    };
    LineTool.prototype.select = function () {
        this.network.addEdgeMode();
        this.$container.addClass('selected');
    };
    return LineTool;
}());
var DeleteTool = /** @class */ (function () {
    function DeleteTool($container, network) {
        this._$container = $container;
        this.network = network;
    }
    Object.defineProperty(DeleteTool.prototype, "$container", {
        get: function () {
            return this._$container;
        },
        enumerable: true,
        configurable: true
    });
    DeleteTool.prototype.press = function () {
        var me = this;
        var selection = me.network.getSelection();
        if (selection.nodes.length === 0 && selection.edges.length === 0) {
            return;
        }
        layer.confirm('确认删除选中的节点/线？', { icon: 3, title: '提示' }, function (index) {
            me.network.deleteSelected();
            layer.close(index);
        });
    };
    return DeleteTool;
}());
export { DeleteTool };
//# sourceMappingURL=TopVisTool.js.map