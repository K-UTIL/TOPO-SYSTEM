import {VisExtend} from "../extend/VisExtend";
import {Config} from "./Config";
import {ApiManager} from "./ApiManager";
import * as vis from "vis";
import * as $ from  'jquery';

// export var window: any;//dom window对象

export class Tools {

}

interface Data {
    //vis dataset
    nodes: any;
    edges: any;
}


/**
 *
 */
export class Cache {
    //用于初始化vis的group
    nodeGroups: any = {};
    //将其基于index索引
    nodeIdIndex: any = {};

    edgeIdIndex: any = {
        colors:{},
        widths:{},
        dashes:{},
        arrows:{}
    };

    originalNodeData:any;
    originalEdgeData:any;

    isInit: boolean = false;

    public init() {
        var me = this;
        $.getJSON(Config.serverHost + ApiManager.getConfig(), {}, function (resp) {
            me.originalNodeData = resp.nodesType;
            $.each(resp.nodesType, function (index, clazz:any) {
                $.each(clazz.subDev, function (index, element:any) {
                    me.nodeGroups[element.name] = {
                        shape: 'image',
                        shapeProperties: {
                            useImageSize: true
                        },
                        image: {
                            unselected: element.iconUrl
                        },
                        physics: false
                    }

                    me.nodeIdIndex[element.id] = element;
                })
            });

            me.originalEdgeData = resp.lineTypes;
            $.each(resp.lineTypes.colors, function (index, element:any) {
                me.edgeIdIndex.colors[element.id] = element.properties;
            });
            $.each(resp.lineTypes.widths, function (index, element:any) {
                me.edgeIdIndex.widths[element.id] = element.properties;
            });
            $.each(resp.lineTypes.dashes, function (index, element:any) {
                me.edgeIdIndex.dashes[element.id] = element.properties;
            });

            $.each(resp.lineTypes.arrows, function (index, element:any) {
                me.edgeIdIndex.arrows[element.id] = element.properties;
            });
            me.isInit = true;
        })

    }
}


export class ParamHolder {
    static tools: Tools;
    //vis network对象
    static network: any ;
    static data: Data = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };
    static info: Data = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };
    static cache: Cache = new Cache();

    // static extend: VisExtend;
    static stNumber: string = '';
}