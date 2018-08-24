import { ParamHolder } from "../data/ParamHolder";
import * as $ from 'jquery';
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getWithDefault = function (content, defaults) {
        return content ? content : defaults;
    };
    Utils.getParam = function (key, defaults) {
        if (this.getWithDefault(key, "") === "")
            return defaults;
        var matchArray = window.location.search.match(new RegExp('(\\?|\&)' + key + '=([^\&]+)'));
        return matchArray ? matchArray[2] : defaults;
    };
    Utils.parseServer = function (dataSets, infoSets, stNumber) {
        var me = this;
        var originalNode = dataSets.nodes.get();
        var originalEdge = dataSets.edges.get();
        var nodesVo = [];
        var edgesVo = [];
        $.each(originalNode, function (index, element) {
            var parentNodeId = '';
            $.each(originalEdge, function (index, edgeElement) {
                if (edgeElement.to === element.id) {
                    parentNodeId = edgeElement.from;
                    return false;
                }
            });
            var nodeInfo = infoSets.nodes.get(element.id);
            nodesVo.push({
                id: element.id,
                devName: me.getWithDefault(nodeInfo.devName, ""),
                ip: me.getWithDefault(nodeInfo.devIp, ""),
                devTypeId: nodeInfo.devType,
                lat: '',
                lng: '',
                isStationDev: me.getWithDefault(nodeInfo.isStationDev, 0),
                parentNodeId: me.getWithDefault(parentNodeId, ""),
                pduComNumber: me.getWithDefault(nodeInfo.pduNumber, -1),
                topoViewConfig: JSON.stringify({
                    label: me.getWithDefault(element.label, "")
                }),
                mark: me.getWithDefault(nodeInfo.mark, '')
            });
        });
        $.each(originalEdge, function (index, element) {
            var edgeInfo = infoSets.edges.get(element.id);
            edgesVo.push({
                id: element.id,
                edgeName: me.getWithDefault(element.edgeName, ""),
                fromId: me.getWithDefault(element.from, ""),
                toId: me.getWithDefault(element.to, ""),
                direction: me.getWithDefault(edgeInfo.arrowsNumber, 1),
                topoViewConfig: JSON.stringify({
                    widthNumber: me.getWithDefault(edgeInfo.widthNumber, 1),
                    colorNumber: me.getWithDefault(edgeInfo.colorNumber, 1),
                    dashNumber: me.getWithDefault(edgeInfo.dashNumber, 1),
                    arrowsNumber: me.getWithDefault(edgeInfo.arrowsNumber, 1),
                }),
                mark: me.getWithDefault(edgeInfo.mark, "")
            });
        });
        // paramHolder.topoInfo.stNumber = $("#test_stNumber").val();
        return {
            stNumber: stNumber,
            nodes: nodesVo,
            edges: edgesVo
        };
    };
    Utils.parseFromServer = function (respData, infoSets, dataSets) {
        $.each(respData.nodes, function (index, node) {
            var nodeConfig = JSON.parse(node.topoViewConfig);
            dataSets.nodes.add({
                id: node.id,
                label: nodeConfig.label,
                group: ParamHolder.cache.nodeIdIndex[node.devTypeId].name
            });
            infoSets.nodes.add({
                id: node.id,
                devName: node.devName,
                devIp: node.ip,
                devType: node.devTypeId,
                lat: node.lat,
                lng: node.lng,
                isStationDev: node.isStationDev,
                pduNumber: node.pduComNumber,
                label: nodeConfig.label,
                mark: nodeConfig.mark
            });
        });
        $.each(respData.edges, function (index, edge) {
            var edgeConfig = JSON.parse(edge.topoViewConfig);
            dataSets.edges.add({
                id: edge.id,
                to: edge.toId,
                from: edge.fromId,
                label: edgeConfig.label,
                dashes: ParamHolder.cache.edgeIdIndex.dashes[edgeConfig.dashNumber],
                width: ParamHolder.cache.edgeIdIndex.widths[edgeConfig.widthNumber],
                color: ParamHolder.cache.edgeIdIndex.colors[edgeConfig.colorNumber],
                arrow: ParamHolder.cache.edgeIdIndex.arrows[edgeConfig.arrowsNumber]
            });
            infoSets.edges.add({
                id: edge.id,
                widthNumber: edgeConfig.widthNumber,
                colorNumber: edgeConfig.colorNumber,
                dashNumber: edgeConfig.dashNumber,
                arrowsNumber: edge.direction,
                mark: edge.mark,
                edgeName: edge.edgeName
            });
        });
    };
    return Utils;
}());
export { Utils };
//# sourceMappingURL=Utils.js.map