var paramHolder = {
    server: {
        url: '',
        api: {}
    },
    topoInfo: {//topo属性
        stNumber: '',
        mode: 'edit',// edit,display
    },
    mark: {
        groups: {},//用于vis配置的group
        lines: {
            colors: {},
            widths: {},
            dashes: {},
            arrows: {},
            defaultColor: 1,
            defaultWidth: 1,
            defaultDash: 1,
            defaultArrow: 1,
        },//存储线条的配置索引
        nodeIdIndex: {},//id索引的配置信息
    },
    network: {},
    extend: {},
    data: {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    },
    info: {//节点的相关信息 id与data中的相关联
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    },
    stack: {//记录动作 完成撤销重做操作

    },
    subParamHolder: {
        nodeInfo: {
            currentId: ''
        },
        nodeEdit: {
            currentId: ''
        },
        lineEdit: {
            currentId: ''
        },
        toolMode: 0,// {0:无状态,1:线条添加,2:文本工具,3:多选工具}
    }
};

var ToolMode = {
    noStatus: 0,
    LineMode: 1,
    TextMode: 2,
    choiceMode: 3
};


var classHolder = {
    bindSystemControlEvent: {},
    bindTopoControlEvent: {},
    bindTopoDrawEvent: {},
    bindDataEvent: {}
};
$(function () {


    var layer, element;
    init();


    function init() {
        systemConfigInit();
        dataInit();
        topoVisInit();
        stationTopoInit();//避开event
        eventInit();
    }

    function getParam(key, defaults) {
        if (getWithDefault(key, "") === "") return defaults;
        var matchArray = window.location.search.match(new RegExp('(\\?|\&)' + key + '=([^\&]+)'));
        return matchArray ? matchArray[2] : defaults;
    }


    function systemConfigInit() {
        paramHolder.server = window.serverInfo;
        paramHolder.server.api = window.api;

        paramHolder.topoInfo.stNumber = getParam('stNumber', '');
        paramHolder.topoInfo.mode = getParam('mode', 'edit');
    }

    function dataInit() {
        loadNodeTypes();
        loadLineTypes();
    }

    function loadNodeTypes() {
        window.nodesType &&
        $.each(window.nodesType, function (index, element) {
            $('#topo-left-tools > .layui-collapse').append(fmtClassHtml(element));
        })

        layui.use(['element', 'layer'], function () {
            element = layui.element;
            layer = layui.layer;
            //…
        });
    }

    function fmtClassHtml(classElement) {
        var nodeHtml = "";
        $.each(classElement.subDev, function (index, element) {
            nodeHtml += fmtNodeHtml(element);
            loadNodeGroups(element);
        });
        var classHtml = '  <div class="layui-colla-item">\n' +
            '    <h2 class="layui-colla-title">' + classElement.className + '</h2>\n' +
            '    <div class="layui-colla-content layui-show"><div class="flex-box">' + nodeHtml + '</div></div>\n' +
            '  </div>';
        return classHtml;
    }

    function fmtNodeHtml(element) {
        return '<div node-id="' + element.id + '" node-name="' + element.name + '" class="dev-node noselect" style="background-image: url(\'' + element.iconUrl + '\') ;" draggable="true" ><span>' + element.name + '</span></div>';
    }

    //初始化节点组
    function loadNodeGroups(element) {
        paramHolder.mark.groups[element.name] = {
            shape: 'image',
            shapeProperties: {
                useImageSize: true
            },
            image: {
                unselected: element.iconUrl
            },
            physics: false
        };

        // var index = $('#edit-node-info-type option:last').attr('value')?
        //     $('#edit-node-info-type option:last').attr('value') - 1 + 2 : 1;
        var index = element.id;
        $('#edit-node-info-type').append('<option value="' +
            (index)
            + '">' + element.name + '</option>')

        paramHolder.mark.nodeIdIndex[element.id] = element;
    }

    function loadLineTypes() {
        $.each(window.lineTypes.colors, function (index, element) {
            paramHolder.mark.lines.colors[element.id] = element.properties;
        });
        $.each(window.lineTypes.widths, function (index, element) {
            paramHolder.mark.lines.widths[element.id] = element.properties;
        });
        $.each(window.lineTypes.dashes, function (index, element) {
            paramHolder.mark.lines.dashes[element.id] = element.properties;
        });

        $.each(window.lineTypes.arrows, function (index, element) {
            paramHolder.mark.lines.arrows[element.id] = element.properties;
        });

        loadLineSelection();
    }

    function loadLineSelection() {
        $.each(paramHolder.mark.lines.widths, function (index, element) {
            $("#edit-line-info-width").append('<option value="' + index + '" style="background: url(\' ' + element.backgroundImage + '\') repeat-x "></option>')
        });
        $.each(paramHolder.mark.lines.colors, function (index, element) {
            $("#edit-line-info-color").append('<option value="' + index + '" style="background: url(\' ' + element.backgroundImage + '\') repeat-x "></option>')
        });
        $.each(paramHolder.mark.lines.dashes, function (index, element) {
            $("#edit-line-info-type").append('<option value="' + index + '" style="background: url(\' ' + element.backgroundImage + '\') repeat-x "></option>')
        });
        $.each(paramHolder.mark.lines.arrows, function (index, element) {
            $("#edit-line-info-type").append('<option value="' + index + '">' + element.name + '</option>');
        });


    }

    function topoVisInit() {
        var option = {
            manipulation: {
                // enabled: false,
                enabled: false,
                initiallyActive: false,
                addNode: false,
                addEdge: function (param, callBack) {
                    if (param.to === param.from) {
                        // layer.confirm('自连接，请确认！', function (index) {
                        //                         //     paramHolder.data.edges.remove(existId);
                        //                         //     callBack(param);
                        //                         //     paramHolder.network.addEdgeMode();
                        //                         //     layer.close(index);
                        //                         // });
                        layer.msg('禁止自连接');
                        return;
                    }
                    var isExist = false;
                    var existId = '';
                    $.each(paramHolder.data.edges.get(), function (index, element) {
                        if ((element.to === param.to && element.from === param.from)
                            || (element.to === param.from && element.from === param.to)) {
                            isExist = true;
                            existId = element.id;
                        }
                    });

                    isExist && layer.confirm('两节点已存在连接线，是否要删除之前的连接线（包括连接线信息）', function (index) {
                        callBack(param);
                        paramHolder.data.edges.remove(existId);
                        paramHolder.network.addEdgeMode();
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
            groups: paramHolder.mark.groups
        }
        paramHolder.network = new vis.Network($("#topo-viewer")[0], paramHolder.data, option);

        paramHolder.extend = window.scooper.VisExtend.EdgeIcon(
            paramHolder.network, $("#topo-viewer"), paramHolder.data.edges, paramHolder.data.nodes
        );
        paramHolder.extend.setOption({
            event: {
                click: function (position, obj) {
                    console.log(position);
                    console.log(obj);
                },
                hover: function (position, obj) {
                    console.log(position);
                    console.log(obj);
                }
            }
        });
    }

    /**
     * 台站topo初始化
     */
    function stationTopoInit() {

        $.ajax({
            type: "GET",
            url: paramHolder.server.url + paramHolder.server.api.getTopoByStNumber(paramHolder.topoInfo.stNumber),
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8'
        }).done(function (resp) {
            if (resp.code === 0) {
                $.each(resp.data.nodes, function (index, node) {
                    var nodeConfig = JSON.parse(node.topoViewConfig);
                    paramHolder.data.nodes.add({
                        id: node.id,
                        label: nodeConfig.label,
                        group: paramHolder.mark.nodeIdIndex[node.devTypeId].name
                    })
                    paramHolder.info.nodes.add({
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
                    })
                })

                $.each(resp.data.edges, function (index, edge) {
                    var edgeConfig = JSON.parse(edge.topoViewConfig);

                    paramHolder.data.edges.add({
                        id: edge.id,
                        to: edge.toId,
                        from: edge.fromId,
                        label: edgeConfig.label,
                        dashes: paramHolder.mark.lines.dashes[edgeConfig.dashNumber],
                        width: paramHolder.mark.lines.widths[edgeConfig.widthNumber],
                        color: paramHolder.mark.lines.colors[edgeConfig.colorNumber],
                        arrow: paramHolder.mark.lines.arrows[edgeConfig.arrowsNumber]
                    });

                    paramHolder.info.edges.add({
                        id: edge.id,
                        widthNumber: edgeConfig.widthNumber,
                        colorNumber: edgeConfig.colorNumber,
                        dashNumber: edgeConfig.dashNumber,
                        arrowsNumber: edge.direction,
                        mark: edge.mark,
                        edgeName: edge.edgeName
                    })

                })

            }
        });
    }

    function eventInit() {
        classHolder.bindSystemControlEvent = bindSystemControlEvent();
        classHolder.bindTopoControlEvent = bindTopoControlEvent();

        classHolder.bindTopoDrawEvent = bindTopoDrawEvent();
        classHolder.bindDataEvent = bindDataEvent();
    }

    /**
     * 绑定topo相关的控制（移动、缩放、全屏、复位）
     */
    function bindTopoControlEvent() {

    }

    /**
     * 绑定系统相关控制（保存、导出、撤销、复位）
     */
    function bindSystemControlEvent() {
        $("#topo-save").on('click', function (e) {
            layer.confirm('确认保存？', {icon: 3, title: '提示'}, function (index) {
                var originalNode = paramHolder.data.nodes.get();
                var originalEdge = paramHolder.data.edges.get();
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
                    var nodeInfo = paramHolder.info.nodes.get(element.id);
                    nodesVo.push({
                        id: element.id,
                        devName: getWithDefault(nodeInfo.devName, ""),
                        ip: getWithDefault(nodeInfo.devIp, ""),
                        devTypeId: nodeInfo.devType,
                        lat: '',
                        lng: '',
                        isStationDev: getWithDefault(nodeInfo.isStationDev, 0),
                        parentNodeId: getWithDefault(parentNodeId, ""),
                        pduComNumber: getWithDefault(nodeInfo.pduNumber, -1),
                        topoViewConfig: JSON.stringify({
                            label: getWithDefault(element.label, "")
                        }),
                        mark: getWithDefault(nodeInfo.mark, '')
                    });
                });

                $.each(originalEdge, function (index, element) {
                    var edgeInfo = paramHolder.info.edges.get(element.id);

                    edgesVo.push({
                        id: element.id,
                        edgeName: getWithDefault(element.edgeName, ""),
                        fromId: getWithDefault(element.from, ""),
                        toId: getWithDefault(element.to, ""),
                        direction: getWithDefault(edgeInfo.arrowsNumber, 1),
                        topoViewConfig: JSON.stringify({
                            widthNumber: getWithDefault(edgeInfo.widthNumber, 1),
                            colorNumber: getWithDefault(edgeInfo.colorNumber, 1),
                            dashNumber: getWithDefault(edgeInfo.dashNumber, 1),
                            arrowsNumber: getWithDefault(edgeInfo.arrowsNumber, 1),
                        }),
                        mark: getWithDefault(edgeInfo.mark, "")
                    });

                });

                paramHolder.topoInfo.stNumber = $("#test_stNumber").val();
                $.ajax({
                    type: "POST",
                    url: paramHolder.server.url + paramHolder.server.api.addTopo,
                    data: JSON.stringify({
                        stNumber: paramHolder.topoInfo.stNumber,
                        nodes: nodesVo,
                        edges: edgesVo
                    }),
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8'
                }).done(function (resp) {
                    if (resp.code === 0) {
                        layer.alert("保存成功！")
                    }
                });

                layer.close(index);
            });
        })

        $('#topo-export').on('click', function (e) {
            // TODO: 2018/8/17 导出 html/png/Gephi/DOT

        })
    }

    /**
     * 绑定topo绘制事件（拖拉拽、线、文本）
     * // TODO: 2018/8/15 形状的点击事件
     */
    function bindTopoDrawEvent() {
        nodeDrawControl();
        lineDrawControl();
        choiceBtnControl();
        textToolControl();
        topoDeleteControl();

        function nodeDrawControl() {
            //拖入编辑框中鼠标样式呈现复制
            $("#topo-viewer")[0].addEventListener('dragover', function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
            });

            $.each($("#topo-left-tools .layui-collapse .dev-node"), function (index, element) {
                //拖动时图标的样式
                element.addEventListener('dragstart', function (e) {
                    e.dataTransfer.effectAllowed = "all";
                    //拖动时使鼠标在图片中心demo(IE下无效)
                    var image = new Image();
                    var scale = paramHolder.network.getScale();
                    console.log(scale)
                    // console.log($(this)[0].style)
                    image.src = $(this)[0].style.backgroundImage.match(/url\(\"(.+)\"\)/)[1];
                    image.width = image.width * scale;
                    image.height = image.height * scale;
                    // image.style.height = image.height + 'px';
                    // image.style.width = image.width + 'px';
                    console.log(image);
                    // var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
                    var canvas = document.createElement("canvas");
                    canvas.height = image.height * 2;
                    canvas.width = image.width * 2;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    var newImage = new Image();
                    newImage.src = canvas.toDataURL();
                    //加载新的图片 并移除
                    $("#preload")[0].append(newImage);
                    setTimeout(function () {
                        $("#preload")[0].removeChild(newImage);
                    }, 0);
                    // console.log(newImage);
                    e.dataTransfer.setData("text/plain", "Text to drag");
                    e.dataTransfer.setData("text/uri-list", "Text to drag");
                    e.dataTransfer.setDragImage(newImage, image.width / 2, image.height / 2);
                });

                //拖动结束，转换坐标，置入topo图内
                element.addEventListener('dragend', function (e) {
                    var boundingClientRect = $("#topo-viewer")[0].getBoundingClientRect();
                    //判断点是否在框内
                    if (!(e.x >= boundingClientRect.left && e.x <= boundingClientRect.right &&
                        e.y >= boundingClientRect.top && e.y <= boundingClientRect.bottom)) {
                        return;
                    }
                    var $this = $(this);
                    var viewPosition = paramHolder.network.getViewPosition();
                    var scale = paramHolder.network.getScale();
                    var x0 = (boundingClientRect.left + boundingClientRect.right) / 2;
                    var y0 = (boundingClientRect.top + boundingClientRect.bottom) / 2;

                    var x = e.x - x0;
                    var y = e.y - y0;
                    x = viewPosition.x + x / scale;
                    y = viewPosition.y + y / scale;
                    //先捕捉当前点位元素
                    var linkNodeId = paramHolder.network.getNodeAt({
                        x: e.x - boundingClientRect.left,
                        y: e.y - boundingClientRect.top
                    });

                    // TODO: 2018/8/13 hover 的颜色处理
                    var addId = paramHolder.data.nodes.add({
                        group: $this.attr('node-name'),
                        devType: $this.attr('node-id'),
                        firstDraw: true,
                        x: x,
                        y: y
                    });

                    console.log(linkNodeId)
                    if (linkNodeId === undefined || linkNodeId === addId[0]) {
                        paramHolder.network.redraw();
                        return;
                    }
                    console.log(addId);
                    var edgeId = paramHolder.data.edges.add({
                        from: linkNodeId,
                        to: addId[0],
                        arrows: paramHolder.mark.lines.arrows[paramHolder.mark.lines.defaultArrow],
                        dashes: paramHolder.mark.lines.dashes[paramHolder.mark.lines.defaultDash],
                        color: paramHolder.mark.lines.colors[paramHolder.mark.lines.defaultColor],
                        width: paramHolder.mark.lines.colors[paramHolder.mark.lines.defaultColor],
                        label: '测试'
                    });
                    paramHolder.network.redraw();
                    // FIXME: 2018/8/21 test
                    paramHolder.extend.createImageOnEdgeCenter({
                        edgeId: edgeId[0],
                        iconSrc: '../image/display/alarm.png'
                    })
                    paramHolder.extend.createImageOnNodeCenter({
                        nodeId: addId[0],
                        iconSrc: '../image/display/alarm.png'
                    })
                })

            });
        }

        /**
         * @class
         * @type {Choice}
         */
        var ChoiceControl = function () {
            function Choice(netWork, $dom) {//传入vis对象,jq对象
                this.netWork = netWork;
                this.$dom = $dom;
            }

            Choice.prototype = Object.create(null);
            Choice.prototype.constructor = Choice;
            Choice.prototype.set = function () {
                this.netWork.setOptions({
                    interaction: {
                        multiselect: true
                    }
                });
                this.$dom.addClass('selected');
            };
            Choice.prototype.release = function () {
                this.netWork.setOptions({
                    interaction: {
                        multiselect: false
                    }
                });
                this.$dom.removeClass('selected');
            };

            return Choice;
        }();
        /**
         * @class
         * @type {Line}
         */
        var LineControl = function () {
            function Line(netWork, $dom) {
                this.network = netWork;
                this.$dom = $dom;
            }

            Line.prototype = Object.create(null);
            Line.prototype.constructor = Line;
            Line.prototype.set = function () {
                this.network.addEdgeMode();
                this.$dom.addClass('selected');
            }

            Line.prototype.release = function () {
                this.network.disableEditMode();
                this.$dom.removeClass('selected');
            }
            return Line;
        }();
        /**
         * @class
         * @type {Text}
         */
        var TextControl = function () {
            function Text(network, $dom) {
                this.network = network;
                this.$dom = $dom;
            }

            Text.prototype = Object.create(null);
            Text.prototype.constructor = Text;
            Text.prototype.set = function () {
                // TODO: 2018/8/17 文字工具的实现
                this.$dom.addClass('selected');
            }
            Text.prototype.release = function () {
                this.$dom.removeClass('selected');
            };
            return Text;
        }();
        //线条绘制工具控制
        // TODO: 2018/8/16 css控制
        var lineControl = new LineControl(paramHolder.network, $("#tool-line"));
        var textControl = new TextControl(paramHolder.network, $("#tool-text"));
        var choiceControl = new ChoiceControl(paramHolder.network, $("#tool-choice"));

        function lineDrawControl() {

            $("#tool-line").on('click', function (e) {
                if (paramHolder.subParamHolder.toolMode === 1) {
                    lineControl.release();
                    paramHolder.subParamHolder.toolMode = 0;
                } else {
                    //释放其他工具
                    choiceControl.release();
                    textControl.release();
                    lineControl.set();
                    paramHolder.subParamHolder.toolMode = 1;
                }
            })
        }

        //选择工具（释放其他工具）
        function choiceBtnControl() {
            //释放其他工具
            $("#tool-choice").on('click', function (e) {
                if (paramHolder.subParamHolder.toolMode === 3) {
                    choiceControl.release();
                    paramHolder.subParamHolder.toolMode = 0;
                } else {
                    textControl.release();
                    lineControl.release();
                    choiceControl.set();
                    paramHolder.subParamHolder.toolMode = 3;
                }
            })
        }

        //文本节点工具（默认展示名字，可修改显示内容）
        function textToolControl() {
            $("#tool-text").on("click", function (e) {
                if (paramHolder.subParamHolder.toolMode === 2) {
                    textControl.release();
                    paramHolder.subParamHolder.toolMode = 0;
                } else {
                    //释放其他工具
                    choiceControl.release();
                    lineControl.release();
                    textControl.set();
                    paramHolder.subParamHolder.toolMode = 2;
                }
            })
        }

        //删除选中
        function topoDeleteControl() {
            $("#tool-delete").on('click', function (e) {
                var selection = paramHolder.network.getSelection();
                if (selection.nodes.length === 0 && selection.edges.length === 0) {
                    return;
                }
                layer.confirm('确认删除选中的节点/线？', {icon: 3, title: '提示'}, function (index) {
                    paramHolder.network.deleteSelected();
                    layer.close(index);
                });
            })
        }


    }

    function getWithDefault(variable, defaultVar) {
        return variable ? variable : defaultVar;
    }

    /**
     * 绑定数据相关的事件（编辑线属性、节点属性）
     */
    function bindDataEvent() {
        viewControl();
        infoViewEvent();
        editViewEvent();
        lineEditEvent();
        dataUpdateListener();

        //窗口展示
        function showNodeInfoView(id) {
            id && (
                fillNodeInfoWithId(id),
                    paramHolder.network.selectNodes([id]),
                    paramHolder.subParamHolder.nodeInfo.currentId = id
            );
            $('#edit-line-info').addClass('hide');
            $('#edit-node-info').addClass('hide');
            $('#node-info').removeClass('hide');
        }

        function hideNodeInfoView() {
            $('#edit-node-info').addClass('hide');
        }

        function showNodeEditView(id) {
            id && (
                fillEditNodeInfoWithId(id),
                    paramHolder.network.selectNodes([id]),
                    paramHolder.subParamHolder.nodeEdit.currentId = id
            );
            $('#edit-line-info').addClass('hide');
            $('#edit-node-info').removeClass('hide');
            $('#node-info').addClass('hide');

            $("#edit-node-info-name")[0].focus();
        }

        function hideNodeEditView() {
            $('#edit-line-info').addClass('hide');
        }

        function showLineEditView(id) {
            id && (
                paramHolder.network.selectEdges([id]),
                    paramHolder.network.selectEdges([id]),
                    paramHolder.subParamHolder.lineEdit.currentId = id
            );
            $('#edit-line-info').removeClass('hide');
            $('#edit-node-info').addClass('hide');
            $('#node-info').addClass('hide');
        }

        function hideLineEditView() {
            $('#node-info').addClass('hide');
        }

        function hideAllView() {
            hideLineEditView();
            hideNodeEditView();
            hideNodeInfoView();
        }

        function showEditNodeLabelLayer(id) {
            var node = paramHolder.info.nodes.get(id);
            layer.prompt({
                formType: 2,
                value: node.label,
                title: '修改标题',
                area: ['100px', '200px'] //自定义文本域宽高
            }, function (value, index, elem) {
                paramHolder.info.nodes.update({
                    id: node.id,
                    label: value
                });
                layer.close(index);
            });
        }

        function showEditEdgeLabelLayer(id) {
            var node = paramHolder.info.edges.get(id);
            layer.prompt({
                formType: 2,
                value: node.label,
                title: '修改标题',
                area: ['100px', '200px'] //自定义文本域宽高
            }, function (value, index, elem) {
                paramHolder.info.edges.update({
                    id: node.id,
                    label: value
                });
                layer.close(index);
            });
        }

        function viewControl() {
            paramHolder.network.on('click', function (param) {
                if (param.nodes.length !== 0) {//点击了节点
                    showNodeInfoView(param.nodes[0]);
                    if (paramHolder.subParamHolder.toolMode === ToolMode.TextMode) {//文本编辑模式
                        showEditNodeLabelLayer(param.nodes[0]);
                    }

                } else if (param.edges.length !== 0) {//点击了边线
                    showLineEditView(param.edges[0]);
                    if (paramHolder.subParamHolder.toolMode === ToolMode.TextMode) {//文本编辑模式
                        showEditEdgeLabelLayer(param.edges[0]);
                    }
                } else {//点击空白处
                    hideAllView();
                }
            });
        }

        function fillNodeInfoWithId(id) {
            var nodeInfo = paramHolder.info.nodes.get(id);
            var devName = getWithDefault(nodeInfo.devName, '');
            var devIp = getWithDefault(nodeInfo.devIp, '');
            var devType = getWithDefault(nodeInfo.devType, 1);
            var isStationDev = getWithDefault(nodeInfo.isStationDev, 1);
            var pduNumber = getWithDefault(nodeInfo.pduNumber, -1);
            var mark = getWithDefault(nodeInfo.mark, '');

            $("#node-info p:eq(0) span").text(devName)
            $("#node-info p:eq(1) span").text(devIp)
            $("#node-info p:eq(2) span").text(paramHolder.mark.nodeIdIndex[devType].name)
            $("#node-info p:eq(3) span").text(isStationDev == 1 ? '是' : '否');
            $("#node-info p:eq(4) span").text(pduNumber == -1 ? '无' : pduNumber);
            $("#node-info p:eq(5) span").text(mark);
            // $("#node-info p:eq(4) span").text()
        }

        //各窗口按钮事件
        //显示窗口
        function infoViewEvent() {
            $("#node-info-edit").on('click', function (e) {
                showNodeEditView(paramHolder.subParamHolder.nodeInfo.currentId);
            });
        }

        function fillEditNodeInfoWithId(id) {
            var nodeInfo = paramHolder.info.nodes.get(id);
            var devName = getWithDefault(nodeInfo.devName, '');
            var devIp = getWithDefault(nodeInfo.devIp, '');
            var devType = getWithDefault(nodeInfo.devType, 1);
            var isStationDev = getWithDefault(nodeInfo.isStationDev, 1);
            var pduNumber = getWithDefault(nodeInfo.pduNumber, -1);
            var mark = getWithDefault(nodeInfo.mark, '');

            $("#edit-node-info-name").val(devName);
            $("#edit-node-info-ip").val(devIp);
            $("#edit-node-info-type ").val(devType);
            $("#edit-node-info-is-station-dev").val(isStationDev);
            $("#edit-node-info-pdu-number").val(pduNumber);
            $("#edit-node-info-mark").val(mark);
        }

        //节点编辑窗口
        function editViewEvent() {
            $('#edit-node-info-save').on('click', function (e) {
                // var param = paramHolder.info.nodes.get(paramHolder.subParamHolder.nodeEdit.currentId);
                if (paramHolder.data.nodes.get(paramHolder.subParamHolder.nodeEdit.currentId) === null) {
                    hideAllView();
                    return;
                }
                var param = {
                    id: paramHolder.subParamHolder.nodeEdit.currentId,
                    devName: $("#edit-node-info-name").val(),
                    devIp: $("#edit-node-info-ip").val(),
                    devType: $("#edit-node-info-type").val(),
                    isStationDev: $("#edit-node-info-is-station-dev").val(),
                    pduNumber: $("#edit-node-info-pdu-number").val(),
                    mark: $("#edit-node-info-mark").val()
                }
                paramHolder.info.nodes.update(param);
                if (paramHolder.data.nodes.get(paramHolder.subParamHolder.nodeEdit.currentId).firstDraw) {
                    paramHolder.data.nodes.update({
                        id: paramHolder.subParamHolder.nodeEdit.currentId,
                        firstDraw: false
                    })

                    paramHolder.info.nodes.update({
                        id: paramHolder.subParamHolder.nodeEdit.currentId,
                        label: $("#edit-node-info-name").val()
                    });

                }
                showNodeInfoView(paramHolder.subParamHolder.nodeEdit.currentId)
            });
        }

        //线条编辑窗口
        function lineEditEvent() {
            $("#edit-line-info-arrows").change(function (e) {
                //方向
                var arrows = e.target.value();
                var id = paramHolder.subParamHolder.lineEdit.currentId


            })
        }

        //数据本地同步
        function dataUpdateListener() {
            paramHolder.data.nodes.on('add', function (event, properties, senderId) {
                console.log(event);
                console.log(properties);
                console.log(senderId);
                $.each(properties.items, function (index, id) {
                    paramHolder.info.nodes.add({
                        id: id,
                        devType: paramHolder.data.nodes.get(id).devType
                    })
                    //打开编辑窗口
                    classHolder.bindDataEvent.showNodeEditView(id);
                });
            });

            paramHolder.data.nodes.on('remove', function (event, properties, senderId) {
                paramHolder.info.nodes.remove(properties.items);
                //自动删除开放的连接线
                $.each(paramHolder.data.edges.get(), function (index, element) {
                    if (properties.items.indexOf(element.from) !== -1 || properties.items.indexOf(element.to) !== -1) {
                        paramHolder.data.edges.remove(element);
                    }
                });
                if (properties.items.indexOf(paramHolder.subParamHolder.nodeEdit.currentId)) {
                    hideNodeEditView();
                    paramHolder.subParamHolder.nodeEdit.currentId = '';
                }
                if (properties.items.indexOf(paramHolder.subParamHolder.nodeInfo.currentId)) {
                    hideNodeInfoView();
                    paramHolder.subParamHolder.nodeInfo.currentId = '';
                }
            });

            paramHolder.data.edges.on('add', function (event, properties, senderId) {
                $.each(properties.items, function (index, id) {
                    paramHolder.info.edges.add({
                        id: id
                    })
                });
            });

            paramHolder.data.edges.on('remove', function (event, properties, senderId) {
                paramHolder.info.edges.remove(properties.items);
                if (properties.items.indexOf(paramHolder.subParamHolder.lineEdit.currentId)) {
                    hideLineEditView();
                    paramHolder.subParamHolder.lineEdit.currentId = '';
                }
            });


            paramHolder.info.nodes.on('update', function (event, properties, senderId) {
                //更新topo图上的表现形式
                $.each(properties.items, function (index, id) {
                    var nodeData = paramHolder.info.nodes.get(id);
                    var group = paramHolder.mark.nodeIdIndex[nodeData.devType];

                    group && paramHolder.data.nodes.update({
                        id: id,
                        group: group.name,
                        label: nodeData.label
                    })
                });
            })

            paramHolder.info.edges.on('update', function (event, properties, senderId) {
                //TODO 更新topo图上的连接线形式
                $.each(properties.items, function (index, id) {
                    var edgeData = paramHolder.info.edges.get(id);
                    var widthId = edgeData.widthId;
                    var colorId = edgeData.colorId;
                    var dashId = edgeData.dashId;
                    var arrowsId = edgeData.arrowsId;

                    paramHolder.data.edges.update({

                        label: edgeData.label
                    });

                });
            })
        }


        //暴露控制
        return {
            showNodeInfoView: showNodeInfoView,
            showNodeEditView: showNodeEditView,
            showLineEditView: showLineEditView,
            hideAllView: hideAllView
        }
    }

});