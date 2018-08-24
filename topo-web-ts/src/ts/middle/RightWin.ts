import {ParamHolder} from "../data/ParamHolder";
import {Utils} from "../util/Utils";
import * as $ from 'jquery';

export class RightWinManager {
    static nodeInfo: NodeInfo;
    static nodeEdit: NodeEdit;
    static edgeEdit: EdgeEdit;

    public static init() {
        const me = this;
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
            const currentId = me.nodeEdit.currentId;
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
            }
            ParamHolder.info.nodes.update(param);
            if (ParamHolder.data.nodes.get(currentId).firstDraw) {
                ParamHolder.data.nodes.update({
                    id: currentId,
                    firstDraw: false
                })

                ParamHolder.info.nodes.update({
                    id: currentId,
                    label: $("#edit-node-info-name").val()
                });

            }
            me.showNodeInfoView(currentId)
        });
        // TODO: 2018/8/22 线条编辑事件

        this.initEvent();
    }

    private static initEvent() {
        var me = this;
        ParamHolder.network.on('click', function (param: any) {
            if (param.nodes.length !== 0) {//点击了节点
                me.showNodeInfoView(param.nodes[0]);
            } else if (param.edges.length !== 0) {//点击了边线
                me.showEdgeEditView(param.edges[0]);
            } else {//点击空白处
                me.hideAllView();
            }
        });
    }

    public static showNodeInfoView(id?: string) {
        this.nodeEdit.hide();
        this.edgeEdit.hide();
        this.nodeInfo.show(id);
    }

    public static hideNodeInfoView() {
        this.nodeInfo.hide();
    }

    public static showNodeEditView(id?: string) {
        this.nodeInfo.hide();
        this.edgeEdit.hide();
        this.nodeEdit.show(id);
    }

    public static hideNodeEditView() {
        this.nodeEdit.hide();
    }

    public static showEdgeEditView(id?: string) {
        this.nodeInfo.hide();
        this.nodeEdit.hide()
        this.edgeEdit.show(id);
    }

    public static hideEdgeEditView() {
        this.edgeEdit.hide();
    }

    public static hideAllView() {
        this.nodeInfo.hide();
        this.nodeEdit.hide();
        this.edgeEdit.hide();
    }
}


interface RightWin {


    show(id?: string): void;

    hide(): void;
}

class NodeInfo implements RightWin {
    private _currentId: string = '';

    private nodeDataSet: any;

    private static $container = $("#node-info");


    constructor(nodeDataSet: any) {
        this.nodeDataSet = nodeDataSet;
    }

    get currentId(): string {
        return this._currentId;
    }

    set currentId(value: string) {
        this._currentId = value;
    }

    public hide() {
        NodeInfo.$container.addClass('hide');
    }

    public show(id?: string) {
        if (id) {
            this.fillNodeInfoWithId(id);
            this.currentId = id;
        }
        NodeInfo.$container.removeClass('hide');
    }

    fillNodeInfoWithId(id: string) {
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
    }
}

class NodeEdit implements RightWin {
    private _currentId: string = '';

    private nodeDataSet: any;

    private static $container = $("#edit-node-info");


    constructor(nodeDataSet: any) {
        this.nodeDataSet = nodeDataSet;
        this.init();
    }

    get currentId(): string {
        return this._currentId;
    }

    set currentId(value: string) {
        this._currentId = value;
    }

    init() {
        $.each(ParamHolder.cache.nodeIdIndex, function (index, element) {
            NodeEdit.$container.find('#edit-node-info-type').append(`<option value="${index.toString()}">${element.name}</option>`)
        });
    }

    hide() {
        NodeEdit.$container.addClass('hide');
    }

    show(id?: string) {
        if (id) {
            this.currentId = id;
            this.fillEditNodeInfoWithId(id);
        }
        NodeEdit.$container.removeClass('hide');
    }

    fillEditNodeInfoWithId(id: string) {
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
    }
}

class EdgeEdit implements RightWin {
    private _currentId: string = '';

    private edgeDataSet: any;

    private static $container = $("#edit-line-info");


    constructor(edgeDataSet: any) {
        this.edgeDataSet = edgeDataSet;
        this.init();
    }

    get currentId(): string {
        return this._currentId;
    }

    set currentId(value: string) {
        this._currentId = value;
    }

    init() {

        $.each(ParamHolder.cache.edgeIdIndex.widths, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-width").append(`<option value="${index.toString()}" style="background: url('${element.backgroundImage}') repeat-x ">${element.name}(${element.width})</option>`)
        });
        $.each(ParamHolder.cache.edgeIdIndex.colors, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-color").append(`<option value="${index.toString()}" style="background: url('${element.backgroundImage}') repeat-x ">${element.name}(${element.color}) </option>`)
        });
        $.each(ParamHolder.cache.edgeIdIndex.dashes, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-type").append(`<option value="${index.toString()}" style="background: url('${element.backgroundImage}') repeat-x ">${element.name}(${element.dash.toString()})</option>`)
        });
        $.each(ParamHolder.cache.edgeIdIndex.arrows, function (index, element) {
            EdgeEdit.$container.find("#edit-line-info-arrows").append(`<option value="${index.toString()}">${element.name }(${element.arrow})</option>`);
        });
    }

    hide() {
        EdgeEdit.$container.addClass('hide');
        this.currentId = "";
    }

    show(id?: string) {
        if (id) {
            this.currentId = id;
            // TODO: 2018/8/22 线条数据的刷新
        }
        EdgeEdit.$container.removeClass('hide');
    }


}