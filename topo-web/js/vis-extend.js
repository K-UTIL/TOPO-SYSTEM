/**
 * <p>基于vis Api，增加canvas拓展</p>
 * <ul>
 *     <li>edge与node中点处自定义图片的插入</li>
 *     <li>与该图标的各类交互式响应</li>
 * </ul>
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'vis'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery', 'vis'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.scooper = root.scooper || {};

        root.scooper.VisExtend = factory(root.jQuery);
    }
}(this, function ($, dataSet) {


    /**
     * 拓展构造函数
     * @param network vis构造对象
     * @param $container vis构造容器
     * @param edgeDateSet visNode存储容器
     * @param nodeDataSet visEdge存储容器
     * @constructor
     */
    function Entity(network, $container, edgeDateSet, nodeDataSet) {
        this.network = network;
        this.$container = $container;
        this.edgeDateSet = edgeDateSet;
        this.nodeDataSet = nodeDataSet;

        this.option = {
            basic: {
                network: network,
                $container: $container,
                edgeDateSet: edgeDateSet,
                nodeDataSet: nodeDataSet
            },
            edgeIcon: {
                opacity: {
                    selected: 1,
                    unselected: 0.4
                }
            },
            nodeIcon: {
                opacity:{
                    selected: 1,
                    unselected: 0.4
                }
            },
            event: {}
        };

        this.paramHolder = {
            edgeIcon: [
                //new CanvasEdgeImage(...)
            ],
            nodeIcon :[

            ]
        };

        this.canvas = $container.find('canvas')[0].getContext('2d');

        this.initEvent();
    }

    /**
     * 设置属性
     * {
     *     basic:{},
     *     edgeIcon:{
     *         opacity:{
     *             selected: 1,
     *             unselected: 0.4
     *         }
     *     },
     *     nodeIcon:{
     *         opacity:{
     *             selected: 1,
     *             unselected: 0.4
     *         }
     *     },
     *     event:{
     *         click:
     *     }
     * }
     * @param option
     */
    Entity.prototype.setOption = function (option) {
        $.extend(this.option, option);
    }

    Entity.prototype.initEvent = function () {
        var that = this;

        that.option.basic.network.on('afterDrawing', function (canvas) {
            // console.info('redraw!');
            $.each(that.paramHolder.edgeIcon, function (index, obj) {
                // var edge = this.edgeDateSet.get(element.edgeId);
                var position = obj.getPosition();

                // obj.element.image.style.opacity = obj.element.opacity;
                canvas.globalAlpha = obj.opacity;
                canvas.beginPath();
                canvas.drawImage(obj.getImage(), position.x, position.y)
                canvas.closePath();
            });

            $.each(that.paramHolder.nodeIcon, function (index, obj) {
                // var edge = this.edgeDateSet.get(element.edgeId);
                var position = obj.getPosition();

                // obj.element.image.style.opacity = obj.element.opacity;
                canvas.globalAlpha = obj.opacity;
                canvas.beginPath();
                canvas.drawImage(obj.getImage(), position.x, position.y)
                canvas.closePath();
            });

        });

        var count = 0;
        that.option.basic.$container.find('canvas')[0].addEventListener('mousemove', function (e) {
            count++;
            //三倍节流
            if ((count = count % 3) === 0) {
                var domX = e.layerX;
                var domY = e.layerY;

                var canvasPosition = that.option.basic.network.DOMtoCanvas({
                    x: domX,
                    y: domY
                });
                // console.log(canvasPosition)
                // console.log({
                //     x:domX,
                //     y:domY
                // })
                var isChanged = false;
                $.each(that.paramHolder.edgeIcon, function (index, element) {
                    if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                        // console.log(element);
                        if (element.opacity !== that.option.edgeIcon.opacity.selected) {
                            element.opacity = that.option.edgeIcon.opacity.selected;
                            isChanged = true;
                        }
                    } else {
                        if (element.opacity !== that.option.edgeIcon.opacity.unselected) {
                            element.opacity = that.option.edgeIcon.opacity.unselected;
                            isChanged = true;
                        }
                    }
                });

                $.each(that.paramHolder.nodeIcon, function (index, element) {
                    if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                        // console.log(element);
                        if (element.opacity !== that.option.nodeIcon.opacity.selected) {
                            element.opacity = that.option.nodeIcon.opacity.selected;
                            isChanged = true;
                        }
                    } else {
                        if (element.opacity !== that.option.nodeIcon.opacity.unselected) {
                            element.opacity = that.option.nodeIcon.opacity.unselected;
                            isChanged = true;
                        }
                    }
                });

                isChanged && (that.option.basic.network.redraw(),
                    (that.option.event.hover && (that.option.event.hover({
                        x: domX,
                        y: domY
                    }, that.getImageAtDom({
                        x: domX,
                        y: domY
                    }))))
                );
                // console.log(e);
            }
        })

        that.option.basic.$container.find('canvas')[0].addEventListener('click', function (e) {
            var domX = e.layerX;
            var domY = e.layerY;

            var images = that.getImageAtDom({
                x: domX,
                y: domY
            });

            that.option.event.click && that.option.event.click({x: domX, y: domY}, images);
        });

        that.option.basic.edgeDateSet.on('remove',function (event,param) {
            var deleteArray = [];
            $.each(that.paramHolder.edgeIcon,function (index, element) {
                if(param.items.indexOf(element.edgeId) !== -1){
                    deleteArray.push(element);
                }
            });

            $.each(deleteArray,function (index, element) {
                that.paramHolder.edgeIcon.splice(that.paramHolder.edgeIcon.indexOf(element),1);
            })
        });

        that.option.basic.nodeDataSet.on('remove',function (event,param) {
            var deleteArray = [];
            $.each(that.paramHolder.nodeIcon,function (index, element) {
                if(param.items.indexOf(element.nodeId) !== -1){
                    deleteArray.push(element);
                }
            });

            $.each(deleteArray,function (index, element) {
                that.paramHolder.nodeIcon.splice(that.paramHolder.nodeIcon.indexOf(element),1);
            })
        })
    }

    /**
     * 在线之间创建一个图标
     * @param obj :{
     *     edgeId:xxx,
     *     iconSrc:''
     * }
     */
    Entity.prototype.createImageOnEdgeCenter = function (obj) {
        this.paramHolder.edgeIcon.push(
            new CanvasEdgeImage(obj.edgeId, obj.iconSrc, this.option.basic.network)
        )

        this.option.basic.network.redraw();
    }
    /**
     * 在节点之中创建一个图标
     * @param obj : {
     *     nodeId:xxx,
     *     iconSrc:''
     * }
     */
    Entity.prototype.createImageOnNodeCenter = function(obj){
        this.paramHolder.nodeIcon.push(
            new CanvasNodeImage(obj.nodeId,obj.iconSrc,this.option.basic.network)
        );

        this.option.basic.network.redraw();
    }
    /**
     * 以dom坐标系，获取当前点位下的 CanvasEdgeImage
     * @param obj :{
     *     x: domX,
     *     y: domY
     * }
     */
    Entity.prototype.getImageAtDom = function (obj) {
        var that = this;
        var canvasPosition = that.option.basic.network.DOMtoCanvas(obj);
        var canvasImage = [];
        $.each(that.paramHolder.edgeIcon, function (index, element) {
            if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                canvasImage.push(Image);
            }
        });

        $.each(that.paramHolder.nodeIcon, function (index, element) {
            if (element.isContains(canvasPosition.x, canvasPosition.y)) {
                canvasImage.push(Image);
            }
        });

        return canvasImage;
    }


    /**
     *
     * @param edgeId
     * @param imageSrc
     * @param network
     * @constructor
     */
    function CanvasEdgeImage(edgeId, imageSrc, network) {
        this.type = 'edge';
        this.edgeId = edgeId;
        this.imageSrc = imageSrc;
        this.network = network;
        this.init();
    }

    CanvasEdgeImage.prototype.init = function () {
        this.image = new Image();
        this.image.src = this.imageSrc;
    }

    CanvasEdgeImage.prototype.isContains = function (canvasX, canvasY) {
        var that = this;
        var lt = that.position;
        var rb = {
            x: that.position.x + that.image.width,
            y: that.position.y + that.image.height
        }
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    }

    CanvasEdgeImage.prototype.getPosition = function () {
        var connectedNodes = this.network.getConnectedNodes(this.edgeId);
        var positions = this.network.getPositions(connectedNodes);
        var x = (positions[connectedNodes[0]].x + positions[connectedNodes[1]].x) / 2 - this.image.width / 2;
        var y = (positions[connectedNodes[0]].y + positions[connectedNodes[1]].y) / 2 - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        }
        return this.position;
    }

    CanvasEdgeImage.prototype.getImage = function () {
        return this.image;
    }

    /**
     * 节点图片信息
     * @param nodeId
     * @param imageSrc
     * @param network
     * @constructor
     */
    function CanvasNodeImage(nodeId, imageSrc, network) {
        this.type = 'node';
        this.nodeId = nodeId;
        this.imageSrc = imageSrc;
        this.network = network;
        this.init();
    }

    CanvasNodeImage.prototype.init = function () {
        this.image = new Image();
        this.image.src = this.imageSrc;
    }

    CanvasNodeImage.prototype.isContains = function (canvasX, canvasY) {
        var that = this;
        var lt = that.position;
        var rb = {
            x: that.position.x + that.image.width,
            y: that.position.y + that.image.height
        }
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    }

    CanvasNodeImage.prototype.getPosition = function () {
        // var connectedNodes = this.network.getConnectedNodes(this.edgeId);
        var positions = this.network.getPositions(this.nodeId);
        var x = (positions[this.nodeId].x) - this.image.width / 2;
        var y = (positions[this.nodeId].y) - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        }
        return this.position;
    }

    CanvasNodeImage.prototype.getImage = function () {
        return this.image;
    }


    return {
        EdgeIcon: function (network, $container, edgeDateSet, nodeDataSet) {
            return new Entity(network, $container, edgeDateSet, nodeDataSet)
        }
    }

}));