import { Config } from "./Config";
import { ApiManager } from "./ApiManager";
import * as vis from "vis";
import * as $ from 'jquery';
// export var window: any;//dom window对象
var Tools = /** @class */ (function () {
    function Tools() {
    }
    return Tools;
}());
export { Tools };
/**
 *
 */
var Cache = /** @class */ (function () {
    function Cache() {
        //用于初始化vis的group
        this.nodeGroups = {};
        //将其基于index索引
        this.nodeIdIndex = {};
        this.edgeIdIndex = {
            colors: {},
            widths: {},
            dashes: {},
            arrows: {}
        };
        this.isInit = false;
    }
    Cache.prototype.init = function () {
        var me = this;
        $.getJSON(Config.serverHost + ApiManager.getConfig(), {}, function (resp) {
            me.originalNodeData = resp.nodesType;
            $.each(resp.nodesType, function (index, clazz) {
                $.each(clazz.subDev, function (index, element) {
                    me.nodeGroups[element.name] = {
                        shape: 'image',
                        shapeProperties: {
                            useImageSize: true
                        },
                        image: {
                            unselected: element.iconUrl
                        },
                        physics: false
                    };
                    me.nodeIdIndex[element.id] = element;
                });
            });
            me.originalEdgeData = resp.lineTypes;
            $.each(resp.lineTypes.colors, function (index, element) {
                me.edgeIdIndex.colors[element.id] = element.properties;
            });
            $.each(resp.lineTypes.widths, function (index, element) {
                me.edgeIdIndex.widths[element.id] = element.properties;
            });
            $.each(resp.lineTypes.dashes, function (index, element) {
                me.edgeIdIndex.dashes[element.id] = element.properties;
            });
            $.each(resp.lineTypes.arrows, function (index, element) {
                me.edgeIdIndex.arrows[element.id] = element.properties;
            });
            me.isInit = true;
        });
    };
    return Cache;
}());
export { Cache };
var ParamHolder = /** @class */ (function () {
    function ParamHolder() {
    }
    ParamHolder.data = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };
    ParamHolder.info = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };
    ParamHolder.cache = new Cache();
    // static extend: VisExtend;
    ParamHolder.stNumber = '';
    return ParamHolder;
}());
export { ParamHolder };
//# sourceMappingURL=ParamHolder.js.map