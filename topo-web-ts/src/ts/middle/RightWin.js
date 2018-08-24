import { ParamHolder } from "../data/ParamHolder";
import { Utils } from "../util/Utils";
import * as $ from 'jquery';
var RightWinManager = /** @class */ (function () {
    function RightWinManager() {
    }
    RightWinManager.init = function () {
        var me = this;
        me.nodeInfo = new NodeInfo(ParamHolder.info.nodes);
        me.nodeEdit = new NodeEdit(ParamHolder.info.nodes);
        me.edgeEdit = new EdgeEdit(ParamHolder.info.edges);
        //几个事件
        //查看转编辑
        $("#node-info-edit").on('click', function (e) {
            me.showNodeEditView(me.nodeInfo.currentId);
        });
        //编辑确认
        $('#edit-node-info-save').on('click', function (e) {
            // var param = ParamHolder.info.nodes.get(ParamHolder.subParamHolder.nodeEdit.currentId);
            var currentId = me.nodeEdit.currentId;
            if (ParamHolder.data.nodes.get(currentId) === null) {
                me.hideAllView();
                return;
            }
            var param = {
                id: currentId,
                devName: $("#edit-node-info-name").val(),
                devIp: $("#edit-node-info-ip").val(),
                devType: $("#edit-node-info-type").val(),
                isStationDev: $("#edit-node-info-is-station-dev").val(),
                pduNumber: $("#edit-node-info-pdu-number").val(),
                mark: $("#edit-node-info-mark").val()
            };
            ParamHolder.info.nodes.update(param);
            if (ParamHolder.data.nodes.get(currentId).firstDraw) {
                ParamHolder.data.nodes.update({
                    id: currentId,
                    firstDraw: false
                });
                ParamHolder.info.nodes.update({
                    id: currentId,
                    label: $("#edit-node-info-name").val()
                });
            }
            me.showNodeInfoView(currentId);
        });
        // TODO: 2018/8/22 线条编辑事件
        this.initEvent();
    };
    RightWinManager.initEvent = function () {
        var me = this;
        ParamHolder.network.on('click', function (param) {
            if (param.nodes.length !== 0) { //点击了节点
                me.showNodeInfoView(param.nodes[0]);
            }
            else if (param.edges.length !== 0) { //点击了边线
                me.showEdgeEditView(param.edges[0]);
            }
            else { //点击空白处
                me.hideAllView();
            }
        });
    };
    RightWinManager.showNodeInfoView = function (id) {
        this.nodeEdit.hide();
        this.edgeEdit.hide();
        this.nodeInfo.show(id);
    };
    RightWinManager.hideNodeInfoView = function () {
        this.nodeInfo.hide();
    };
    RightWinManager.showNodeEditView = function (id) {
        this.nodeInfo.hide();
        this.edgeEdit.hide();
        this.nodeEdit.show(id);
    };
    RightWinManager.hideNodeEditView = function () {
        this.nodeEdit.hide();
    };
    RightWinManager.showEdgeEditView = function (id) {
        this.nodeInfo.hide();
        this.nodeEdit.hide();
        this.edgeEdit.show(id);
    };
    RightWinManager.hideEdgeEditView = function () {
        this.edgeEdit.hide();
    };
    RightWinManager.hideAllView = function () {
        this.nodeInfo.hide();
        this.nodeEdit.hide();
        this.edgeEdit.hide();
    };
    return RightWinManager;
}());
export { RightWinManager };
var NodeInfo = /** @class */ (function () {
    function NodeInfo(nodeDataSet) {
        this._currentId = '';
        this.nodeDataSet = nodeDataSet;
    }
    Object.defineProperty(NodeInfo.prototype, "currentId", {
        get: function () {
            return this._currentId;
        },
        set: function (value) {
            this._currentId = value;
        },
        enumerable: true,
        configurable: true
    });
    NodeInfo.prototype.hide = function () {
        NodeInfo.$container.addClass('hide');
    };
    NodeInfo.prototype.show = function (id) {
        if (id) {
            this.fillNodeInfoWithId(id);
            this.currentId = id;
        }
        NodeInfo.$container.removeClass('hide');
    };
    NodeInfo.prototype.fillNodeInfoWithId = function (id) {
        var nodeInfo = this.nodeDataSet.get(id);
        var devName = Utils.getWithDefault(nodeInfo.devName, '');
        var devIp = Utils.getWithDefault(nodeInfo.devIp, '');
        var devType = Utils.getWithDefault(nodeInfo.devType, 1);
        var isStationDev = Utils.getWithDefault(nodeInfo.isStationDev, 1);
        var pduNumber = Utils.getWithDefault(nodeInfo.pduNumber, -1);
        var mark = Utils.getWithDefault(nodeInfo.mark, '');
        $("#node-info p:eq(0) span").text(devName);
        $("#node-info p:eq(1) span").text(devIp);
        $("#node-info p:eq(2) span").text(ParamHolder.cache.nodeIdIndex[devType].name);
        $("#node-info p:eq(3) span").text(isStationDev == 1 ? '是' : '否');
        $("#node-info p:eq(4) span").text(pduNumber == -1 ? '无' : pduNumber);
        $("#node-info p:eq(5) span").text(mark);
    };
    NodeInfo.$container = $("#node-info");
    return NodeInfo;
}());
var NodeEdit = /** @class */ (function () {
    function NodeEdit(nodeDataSet) {
        this._currentId = '';
        this.nodeDataSet = nodeDataSet;
        this.init();
    }
    Object.defineProperty(NodeEdit.prototype, "currentId", {
        get: function () {
            return this._currentId;
        },
        set: function (value) {
            this._currentId = value;
        },
        enumerable: true,
        configurable: true
    });
    NodeEdit.prototype.init = function () {
        $.each(ParamHolder.cache.nodeIdIndex, function (index, element) {
            NodeEdit.$container.find('#edit-node-info-type').append("<option value=\"" + index.toString() + "\">" + element.name + "</option>");
        });
    };
    NodeEdit.prototype.hide = function () {
        NodeEdit.$container.addClass('hide');
    };
    NodeEdit.prototype.show = function (id) {
        if (id) {
            this.currentId = id;
            this.fillEditNodeInfoWithId(id);
        }
        NodeEdit.$container.removeClass('hide');
    };
    NodeEdit.prototype.fillEditNodeInfoWithId = function (id) {
        var nodeInfo = this.nodeDataSet.get(id);
        var devName = Utils.getWithDefault(nodeInfo.devName, '');
        var devIp = Utils.getWithDefault(nodeInfo.devIp, '');
        var devType = Utils.getWithDefault(nodeInfo.devType, 1);
        var isStationDev = Utils.getWithDefault(nodeInfo.isStationDev, 1);
        var pduNumber = Utils.getWithDefault(nodeInfo.pduNumber, -1);
        var mark = Utils.getWithDefault(nodeInfo.mark, '');
        $("#edit-node-info-name").val(devName);
        $("#edit-node-info-ip").val(devIp);
        $("#edit-node-info-type ").val(devType);
        $("#edit-node-info-is-station-dev").val(isStationDev);
        $("#edit-node-info-pdu-number").val(pduNumber);
        $("#edit-node-info-mark").val(mark);
    };
    NodeEdit.$container = $("#edit-node-info");
    return NodeEdit;
}());
var EdgeEdit = /** @class */ (function () {
    function EdgeEdit(edgeDataSet) {
        this._currentId = '';
        this.edgeDataSet = edgeDataSet;
        this.init();
    }
    Object.defineProperty(EdgeEdit.prototype, "currentId", {
        get: function () {
            return this._currentId;
        },
        set: function (value) {
            this._currentId = value;
        },
        enumerable: true,
        configurable: true
    });
    EdgeEdit.prototype.init = function () {
        $.each(ParamHolder.cache.edgeIdIndex.widths, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-width").append("<option value=\"" + index.toString() + "\" style=\"background: url('" + element.backgroundImage + "') repeat-x \">" + element.name + "(" + element.width + ")</option>");
        });
        $.each(ParamHolder.cache.edgeIdIndex.colors, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-color").append("<option value=\"" + index.toString() + "\" style=\"background: url('" + element.backgroundImage + "') repeat-x \">" + element.name + "(" + element.color + ") </option>");
        });
        $.each(ParamHolder.cache.edgeIdIndex.dashes, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-type").append("<option value=\"" + index.toString() + "\" style=\"background: url('" + element.backgroundImage + "') repeat-x \">" + element.name + "(" + element.dash.toString() + ")</option>");
        });
        $.each(ParamHolder.cache.edgeIdIndex.arrows, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-arrows").append("<option value=\"" + index.toString() + "\">" + element.name + "(" + element.arrow + ")</option>");
        });
    };
    EdgeEdit.prototype.hide = function () {
        EdgeEdit.$container.addClass('hide');
        this.currentId = "";
    };
    EdgeEdit.prototype.show = function (id) {
        if (id) {
            this.currentId = id;
            // TODO: 2018/8/22 线条数据的刷新
        }
        EdgeEdit.$container.removeClass('hide');
    };
    EdgeEdit.$container = $("#edit-line-info");
    return EdgeEdit;
}());
//# sourceMappingURL=RightWin.js.map