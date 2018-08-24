// @ts-ignore
import layui from './custom-dep/layui/layui.all.js';
// @ts-ignore
// window.layui = layui;
export var element;
export var layer;
console.debug(window);
// @ts-ignore
console.debug(window.layui);
// @ts-ignore
window.layui.use(['element', 'layer'], function () {
    // @ts-ignore
    element = window.layui.element;
    // @ts-ignore
    layer = window.layui.layer;
});
import * as $ from 'jquery';
var require7 = require('./custom-dep/layui/css/modules/layer/default/layer.css');
var require8 = require('./custom-dep/layui/css/modules/laydate/default/laydate.css');
var require9 = require('./custom-dep/layui/css/modules/code.css');
var require5 = require('./css/topo-main.css');
var require2 = require('./css/displayControl.css');
var require1 = require('./custom-dep/scant/scant.css');
var require3 = require('./css/icon.css');
var require4 = require('./css/layui-plus.css');
var require6 = require('./css/vis-extend.css');
// import  './custom-dep/scant/scant.css';
// import './css/displayControl.css';
// import './css/icon.css';
// import './css/layui-plus.css';
// import './css/topo-main.css';
// import './css/vis-extend.css';
console.debug(require5);
console.debug(require1);
console.debug(require2);
console.debug(require3);
console.debug(require4);
console.debug(require6);
console.debug(require7);
console.debug(require8);
console.debug(require9);
// @ts-ignore
// window.$ = require('./custom-dep/jquery/jquery-3.3.1.min.js')
// @ts-ignore
// @ts-ignore
// window.layui = require('./custom-dep/layui/layui.all.js')
// @ts-ignore
console.debug($, layui);
// var element = document.createElement('div');
// element
// import * as $ from 'jquery/dist/jquery.slim';
// import  * as $ from"jquery";
import { LeftNodeToolManager } from "./ts/middle/LeftNodeTool";
import * as vis from 'vis';
// import {ParamHolder} from "./ts/data/ParamHolder";
// import {SaveAndExportManager} from "./ts/top/SaveAndExport";
// import {VisExtend} from "./ts/extend/VisExtend";
// import {Utils} from "./ts/util/Utils";
// import {RightWinManager} from "./ts/middle/RightWin";
// import {TopToolManager} from "./ts/top/TopVisTool";
import { ParamHolder } from "./ts/data/ParamHolder";
import { SaveAndExportManager } from "./ts/top/SaveAndExport";
import { VisExtend } from "./ts/extend/VisExtend";
import { Utils } from "./ts/util/Utils";
import { RightWinManager } from "./ts/middle/RightWin";
import { TopToolManager } from "./ts/top/TopVisTool";
// import './module/topo-design'
// import './module/vis-extend'
// import './module/data/nodesType'
$(function () {
    init();
    function init() {
        console.log(vis);
        dataInit();
        call();
    }
    function dataInit() {
        ParamHolder.cache.init();
    }
    /**
     * 等待数据加载完成
     */
    function call() {
        setTimeout(function () {
            if (ParamHolder.cache.isInit == true) {
                next();
            }
            else {
                call();
            }
        }, 200);
    }
    function next() {
        topoInit();
        topoDataListener();
        systemInit();
    }
    // TODO: 2018/8/24 单独拉出去
    function topoInit() {
        var option = {
            manipulation: {
                // enabled: false,
                enabled: false,
                initiallyActive: false,
                addNode: false,
                addEdge: function (param, callBack) {
                    if (param.to === param.from) {
                        // layer.confirm('自连接，请确认！', function (index) {
                        //                         //     ParamHolder.data.edges.remove(existId);
                        //                         //     callBack(param);
                        //                         //     ParamHolder.network.addEdgeMode();
                        //                         //     layer.close(index);
                        //                         // });
                        layer.msg('禁止自连接');
                        return;
                    }
                    var isExist = false;
                    var existId = '';
                    $.each(ParamHolder.data.edges.get(), function (index, element) {
                        if ((element.to === param.to && element.from === param.from)
                            || (element.to === param.from && element.from === param.to)) {
                            isExist = true;
                            existId = element.id;
                        }
                    });
                    isExist && layer.confirm('两节点已存在连接线，是否要删除之前的连接线（包括连接线信息）', function (index) {
                        callBack(param);
                        ParamHolder.data.edges.remove(existId);
                        ParamHolder.network.addEdgeMode();
                        layer.close(index);
                    });
                },
                // editNode: true,
                editEdge: true,
                deleteNode: true,
                deleteEdge: true,
                controlNodeStyle: {
                // all node options are valid.
                }
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    nodeSpacing: 200,
                    sortMethod: 'directed'
                }
            },
            interaction: {
                hover: true,
                navigationButtons: false,
                selectConnectedEdges: false,
                multiselect: true
            },
            groups: ParamHolder.cache.nodeGroups
        };
        ParamHolder.network = new vis.Network($("#topo-viewer")[0], ParamHolder.data, option);
    }
    function topoDataListener() {
        ParamHolder.data.nodes.on('add', function (event, properties, senderId) {
            console.log(event);
            console.log(properties);
            console.log(senderId);
            $.each(properties.items, function (index, id) {
                ParamHolder.info.nodes.add({
                    id: id,
                    devType: ParamHolder.data.nodes.get(id).devType
                });
                //打开编辑窗口
                RightWinManager.showNodeEditView(id);
            });
        });
        ParamHolder.data.nodes.on('remove', function (event, properties, senderId) {
            ParamHolder.info.nodes.remove(properties.items);
            //自动删除开放的连接线
            $.each(ParamHolder.data.edges.get(), function (index, element) {
                if (properties.items.indexOf(element.from) !== -1 || properties.items.indexOf(element.to) !== -1) {
                    ParamHolder.data.edges.remove(element);
                }
            });
            if (properties.items.indexOf(RightWinManager.nodeEdit.currentId)) {
                RightWinManager.hideEdgeEditView();
            }
            if (properties.items.indexOf(RightWinManager.nodeInfo.currentId)) {
                RightWinManager.hideNodeInfoView();
            }
        });
        ParamHolder.data.edges.on('add', function (event, properties, senderId) {
            $.each(properties.items, function (index, id) {
                ParamHolder.info.edges.add({
                    id: id
                });
            });
        });
        ParamHolder.data.edges.on('remove', function (event, properties, senderId) {
            ParamHolder.info.edges.remove(properties.items);
            if (properties.items.indexOf(RightWinManager.edgeEdit.currentId)) {
                RightWinManager.hideEdgeEditView();
            }
        });
        ParamHolder.info.nodes.on('update', function (event, properties, senderId) {
            //更新topo图上的表现形式
            $.each(properties.items, function (index, id) {
                var nodeData = ParamHolder.info.nodes.get(id);
                var group = ParamHolder.cache.nodeIdIndex[nodeData.devType];
                group && ParamHolder.data.nodes.update({
                    id: id,
                    group: group.name,
                    label: nodeData.label
                });
            });
        });
        ParamHolder.info.edges.on('update', function (event, properties, senderId) {
            //TODO 更新topo图上的连接线形式
            $.each(properties.items, function (index, id) {
                var edgeData = ParamHolder.info.edges.get(id);
                var widthId = edgeData.widthId;
                var colorId = edgeData.colorId;
                var dashId = edgeData.dashId;
                var arrowsId = edgeData.arrowsId;
                ParamHolder.data.edges.update({
                    label: edgeData.label
                });
            });
        });
    }
    function systemInit() {
        ParamHolder.stNumber = Utils.getParam("stNumber", '');
        LeftNodeToolManager.init();
        RightWinManager.init();
        SaveAndExportManager.init();
        TopToolManager.init();
        VisExtend.init();
    }
});
//# sourceMappingURL=index.js.map