import {EdgeIcon, Icon, NodeIcon} from "./Icon";
import {ParamHolder} from "../data/ParamHolder";
import * as $ from  'jquery';


export class VisExtend {
    private static entity: Entity;

    static init() {
        this.entity = new Entity($("#topo-viewer"), ParamHolder.network);
    }

    static setOption(option: any) {
        this.entity.setOption(option);
    }

    static createImageOnEdgeCenter(obj: { edgeId: string, iconSrc: string }) {
        this.entity.createImageOnEdgeCenter(obj);
    }

    static createImageOnNodeCenter(obj: { nodeId: string, iconSrc: string }) {
        this.entity.createImageOnNodeCenter(obj);
    }


}

class Entity {
    private edgeIcons: EdgeIcon[] = [];
    private nodeIcons: NodeIcon[] = [];
    private option: any = {
        edgeIcon: {
            opacity: {
                selected: 1,
                unselected: 0.4
            }
        },
        nodeIcon: {
            opacity: {
                selected: 1,
                unselected: 0.4
            }
        },
        event: {}
    };


    constructor($container: any, network: any) {
        $.extend(this.option, {
            basic: {
                network: network,
                $container: $container,
                edgeDateSet: network.edgesHandler.body.data.edges,
                nodeDataSet: network.edgesHandler.body.data.nodes
            },
        });

        this.initEvent();
    }

    /**
     * <p>绘制图标、hover、click事件</p>
     */
    initEvent(){
        var me = this;

        me.option.basic.network.on('afterDrawing', function (canvas:any) {
            // console.info('redraw!');
            $.each(me.edgeIcons, function (index, obj) {
                // var edge = this.edgeDateSet.get(element.edgeId);
                var position = obj.getCanvasPosition();

                // obj.element.image.style.opacity = obj.element.opacity;
                canvas.globalAlpha = obj.opacity;
                canvas.beginPath();
                canvas.drawImage(obj.getImage(), position.x, position.y)
                canvas.closePath();
            });

            $.each(me.nodeIcons, function (index, obj) {
                // var edge = this.edgeDateSet.get(element.edgeId);
                var position = obj.getCanvasPosition();

                // obj.element.image.style.opacity = obj.element.opacity;
                canvas.globalAlpha = obj.opacity;
                canvas.beginPath();
                canvas.drawImage(obj.getImage(), position.x, position.y)
                canvas.closePath();
            });

        });

        var count = 0;
        //hover事件
        me.option.basic.$container.find('canvas')[0].addEventListener('mousemove', function (e:any) {
            count++;
            //三倍节流
            if ((count = count % 3) === 0) {
                var domX = e.layerX;
                var domY = e.layerY;

                var canvasPosition = me.option.basic.network.DOMtoCanvas({
                    x: domX,
                    y: domY
                });
                // console.log(canvasPosition)
                // console.log({
                //     x:domX,
                //     y:domY
                // })
                var isChanged = false;
                $.each(me.edgeIcons, function (index, element) {
                    if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                        // console.log(element);
                        if (element.opacity !== me.option.edgeIcon.opacity.selected) {
                            element.opacity = me.option.edgeIcon.opacity.selected;
                            isChanged = true;
                        }
                    } else {
                        if (element.opacity !== me.option.edgeIcon.opacity.unselected) {
                            element.opacity = me.option.edgeIcon.opacity.unselected;
                            isChanged = true;
                        }
                    }
                });

                $.each(me.nodeIcons, function (index, element) {
                    if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                        // console.log(element);
                        if (element.opacity !== me.option.nodeIcon.opacity.selected) {
                            element.opacity = me.option.nodeIcon.opacity.selected;
                            isChanged = true;
                        }
                    } else {
                        if (element.opacity !== me.option.nodeIcon.opacity.unselected) {
                            element.opacity = me.option.nodeIcon.opacity.unselected;
                            isChanged = true;
                        }
                    }
                });
                //数据有变就需要重新绘制
                isChanged && (me.option.basic.network.redraw(),
                        (me.option.event.hover && (me.option.event.hover({
                            x: domX,
                            y: domY
                        }, me.getImageAtDom({
                            x: domX,
                            y: domY
                        }))))
                );
                // console.log(e);
            }
        })

        me.option.basic.$container.find('canvas')[0].addEventListener('click', function (e:any) {
            var domX = e.layerX;
            var domY = e.layerY;

            var images = me.getImageAtDom({
                x: domX,
                y: domY
            });

            me.option.event.click && me.option.event.click({x: domX, y: domY}, images);
        });

        //保持数据与外部network同步
        me.option.basic.edgeDateSet.on('remove',function (event:any,param:any) {
            var deleteArray:EdgeIcon[] = [];
            $.each(me.edgeIcons,function (index, element) {
                if(param.items.indexOf(element.edgeId) !== -1){
                    deleteArray.push(element);
                }
            });

            $.each(deleteArray,function (index, element) {
                me.edgeIcons.splice(me.edgeIcons.indexOf(element),1);
            })
        });

        me.option.basic.nodeDataSet.on('remove',function (event:any,param:any) {
            var deleteArray:NodeIcon[] = [];
            $.each(me.nodeIcons,function (index, element) {
                if(param.items.indexOf(element.nodeId) !== -1){
                    deleteArray.push(element);
                }
            });

            $.each(deleteArray,function (index, element) {
                me.nodeIcons.splice(me.nodeIcons.indexOf(element),1);
            })
        })
    }

    setOption(option: any) {
        $.extend(this.option, option);
    }

    createImageOnEdgeCenter(obj: { edgeId: string, iconSrc: string }) {
       this.edgeIcons.push(
            new EdgeIcon(obj.edgeId, obj.iconSrc, this.option.basic.network,this.option.edgeIcon.opacity.unselected)
        )

        this.option.basic.network.redraw();
    }

    createImageOnNodeCenter(obj: { nodeId: string, iconSrc: string }) {
        this.nodeIcons.push(
            new NodeIcon(obj.nodeId,obj.iconSrc,this.option.basic.network,this.option.nodeIcon.opacity.unselected)
        );

        this.option.basic.network.redraw();
    }

    getImageAtDom(obj:{x:number,y:number}) :Icon[]{
        var me = this;
        var canvasPosition = me.option.basic.network.DOMtoCanvas(obj);
        var canvasImage:Icon[] = [];
        $.each(me.edgeIcons, function (index, element) {
            if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                canvasImage.push(element);
            }
        });

        $.each(me.nodeIcons, function (index, element) {
            if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                canvasImage.push(element);
            }
        });

        return canvasImage;
    }

}

