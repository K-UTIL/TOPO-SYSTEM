import {ParamHolder} from "../data/ParamHolder";
import {VisExtend} from "../extend/VisExtend";
import * as $ from  'jquery';


export class LeftNodeToolManager {
    private static leftNodeTool: LeftNodeTool;



    static init(){
        this.leftNodeTool = new LeftNodeTool($("#topo-left-tools .layui-collapse"),$("#topo-viewer"),ParamHolder.network);
        this.leftNodeTool.eventInit();
    }

}


class LeftNodeTool {
    private $container: any;
    private $visContainer: any;
    private network: any;


    constructor($container: any, $visContainer: any, network: any) {
        let me = this;
        me.$container = $container;
        me.$visContainer = $visContainer;
        me.network = network;

        me.$container.append(me.getLayuiHtml());
    }

    public getLayuiHtml() {
        var me = this;
        var html = '';
        $.each(ParamHolder.cache.originalNodeData, function (index, clazz) {
            html += me.fmtClassHtml(clazz);
        })
        return html;
    }

    private fmtClassHtml(classElement: any) {
        var nodeHtml = "";

        function fmtNodeHtml(element: any) {
            return `<div node-id="${element.id }" node-name="${element.name }" class="dev-node noselect" style="background-image: url('${ element.iconUrl }') ;" draggable="true" ><span>${element.name}</span></div>`;
        }

        $.each(classElement.subDev, function (index, element) {
            nodeHtml += fmtNodeHtml(element);
        });
        var classHtml = ` <div class="layui-colla-item">
             <h2 class="layui-colla-title">${classElement.className}</h2>
               <div class="layui-colla-content layui-show"><div class="flex-box">${nodeHtml}</div></div>
             </div>`;
        return classHtml;
    }

    public eventInit() {
        //拖入编辑框中鼠标样式呈现复制
        var me = this;
        me.$visContainer[0].addEventListener('dragover', function (e: any) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        });

        $.each(me.$container.find(".dev-node"), function (index, element) {
            //拖动时图标的样式
            element.addEventListener('dragstart', function (e: any) {
                e.dataTransfer.effectAllowed = "all";
                //拖动时使鼠标在图片中心demo(IE下无效)
                var image = new Image();
                var scale = me.network.getScale();
                console.log(scale)
                // console.log($(this)[0].style)
                // @ts-ignore
                image.src = $(this)[0].style.backgroundImage.match(/url\(\"(.+)\"\)/)[1];
                image.width = image.width * scale;
                image.height = image.height * scale;
                // image.style.height = image.height + 'px';
                // image.style.width = image.width + 'px';
                console.log(image);
                // var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
                // @ts-ignore
                var canvas = document.createElement("canvas");
                canvas.height = image.height * 2;
                canvas.width = image.width * 2;

                var ctx :any = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, image.width, image.height);
                var newImage = new Image();
                newImage.src = canvas.toDataURL();
                //加载新的图片 并移除
                $("#preload").append(newImage);
                setTimeout(function () {
                    $("#preload")[0].removeChild(newImage);
                }, 0);
                // console.log(newImage);
                e.dataTransfer.setData("text/plain", "Text to drag");
                e.dataTransfer.setData("text/uri-list", "Text to drag");
                e.dataTransfer.setDragImage(newImage, image.width / 2, image.height / 2);
            });

            //拖动结束，转换坐标，置入topo图内
            element.addEventListener('dragend', function (e: any) {
                var boundingClientRect = $("#topo-viewer")[0].getBoundingClientRect();
                //判断点是否在框内
                if (!(e.x >= boundingClientRect.left && e.x <= boundingClientRect.right &&
                    e.y >= boundingClientRect.top && e.y <= boundingClientRect.bottom)) {
                    return;
                }
                // @ts-ignore
                var $this = $(this);
                var viewPosition = me.network.getViewPosition();
                var scale = me.network.getScale();
                var x0 = (boundingClientRect.left + boundingClientRect.right) / 2;
                var y0 = (boundingClientRect.top + boundingClientRect.bottom) / 2;

                var x = e.x - x0;
                var y = e.y - y0;
                x = viewPosition.x + x / scale;
                y = viewPosition.y + y / scale;
                //先捕捉当前点位元素
                var linkNodeId = me.network.getNodeAt({
                    x: e.x - boundingClientRect.left,
                    y: e.y - boundingClientRect.top
                });

                // TODO: 2018/8/13 hover 的颜色处理
                var addId = ParamHolder.data.nodes.add({
                    group: $this.attr('node-name'),
                    devType: $this.attr('node-id'),
                    firstDraw: true,
                    x: x,
                    y: y
                });

                // console.log(linkNodeId)
                if (linkNodeId === undefined || linkNodeId === addId[0]) {
                    me.network.redraw();
                    return;
                }
                // console.log(addId);
                var edgeId = ParamHolder.data.edges.add({
                    from: linkNodeId,
                    to: addId[0],
                    arrows: ParamHolder.cache.edgeIdIndex.arrows[/*paramHolder.mark.lines.defaultArrow*/ 1],
                    dashes: ParamHolder.cache.edgeIdIndex.dashes[/*paramHolder.mark.lines.defaultDash*/ 1],
                    color: ParamHolder.cache.edgeIdIndex.colors[/*paramHolder.mark.lines.defaultColor*/ 1],
                    width: ParamHolder.cache.edgeIdIndex.colors[/*paramHolder.mark.lines.defaultColor*/ 1],
                    label: '测试'
                });
                ParamHolder.network.redraw();
                // FIXME: 2018/8/21 test
                VisExtend.createImageOnEdgeCenter({
                    edgeId: edgeId[0],
                    iconSrc: '../image/display/alarm.png'
                })
                VisExtend.createImageOnNodeCenter({
                    nodeId: addId[0],
                    iconSrc: '../image/display/alarm.png'
                })
            })

        });
    }

}