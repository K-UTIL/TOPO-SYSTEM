var paramHolder = {
    mark: {
        groups: {},//用于vis配置的group
        idIndex:{}//id索引的配置信息
    },
    network: {},
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
        lineEdit: {}
    }
};
$(function () {


    var layer, element;
    init();


    function init() {
        dataInit();
        topoVisInit();
        eventInit();
    }

    function dataInit() {
        loadNodeTypes();
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

        paramHolder.mark.idIndex[element.id] = element;
    }


    function topoVisInit() {
        var option = {
            manipulation: {
                // enabled: false,
                enabled: true,
                initiallyActive: false,
                addNode: false,
                addEdge: true,
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
                selectConnectedEdges:false
            },
            groups: paramHolder.mark.groups
        }
        paramHolder.network = new vis.Network($("#topo-viewer")[0], paramHolder.data, option);

    }


    function eventInit() {
        bindSystemControlEvent();
        bindTopoControlEvent();

        bindTopoDrawEvent();
        bindDataEvent();
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

    }

    /**
     * 绑定topo绘制事件（拖拉拽、线、文本）
     * // TODO: 2018/8/15 形状的点击事件
     */
    function bindTopoDrawEvent() {
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

                var boundingClientRect = $("#topo-viewer")[0].getBoundingClientRect();
                var linkNodeId = paramHolder.network.getNodeAt({
                    x: e.x - boundingClientRect.left,
                    y: e.y - boundingClientRect.top
                });

                // TODO: 2018/8/13 hover 的颜色处理
                var addId = paramHolder.data.nodes.add({
                    group: $this.attr('node-name'),
                    devType: $this.attr('node-id')
                });

                if (linkNodeId === undefined) {
                    paramHolder.network.redraw()
                    return;
                }
                console.log(addId)
                paramHolder.data.edges.add({
                    from: linkNodeId,
                    to: addId[0]
                });
                paramHolder.network.redraw()
            })


        });


    }

    function getWithDefault(variable, defaultVar) {
        return variable ? variable : defaultVar;
    }

    /**
     * 绑定数据相关的事件（编辑线属性、节点属性）
     */
    function bindDataEvent() {
        //窗口展示
        function showNodeInfoView(id) {
            id && fillNodeInfoWithId(id);
            $('#edit-line-info').css('display', 'none');
            $('#edit-node-info').css('display', 'none');
            $('#node-info').css('display', 'block');
        }

        function showNodeEditView(id) {
            id && fillEditNodeInfoWithId(id);
            $('#edit-line-info').css('display', 'none');
            $('#edit-node-info').css('display', 'block');
            $('#node-info').css('display', 'none');
        }

        function showLineEditView(id) {
            $('#edit-line-info').css('display', 'block');
            $('#edit-node-info').css('display', 'none');
            $('#node-info').css('display', 'none');
        }

        function hideAllView() {
            $('#edit-line-info').css('display', 'none');
            $('#edit-node-info').css('display', 'none');
            $('#node-info').css('display', 'none');
        }

        paramHolder.network.on('selectNode', function (param) {
            showNodeInfoView();
            fillNodeInfoWithId(param.nodes[0])
            paramHolder.subParamHolder.nodeInfo.currentId = param.nodes[0];
        });

        paramHolder.network.on('deselectNode', function (param) {
            hideAllView();
            paramHolder.subParamHolder.nodeInfo.currentId = '';
        });

        paramHolder.network.on('selectEdge', function (param) {
            showLineEditView();
        });

        paramHolder.network.on('deselectEdge', function (param) {
            hideAllView();
        });

        function fillNodeInfoWithId(id){
            var nodeInfo = paramHolder.info.nodes.get(id);
            var devName = getWithDefault(nodeInfo.devName, '');
            var devIp = getWithDefault(nodeInfo.devIp, '');
            var devType = getWithDefault(nodeInfo.devType, 1);
            var isStationDev = getWithDefault(nodeInfo.isStationDev, 1);

            $("#node-info p:eq(0) span").text(devName)
            $("#node-info p:eq(1) span").text(devIp)
            $("#node-info p:eq(2) span").text(paramHolder.mark.idIndex[devType].name)
            $("#node-info p:eq(3) span").text(isStationDev == 1?'是':'否' );
            // $("#node-info p:eq(4) span").text()
        }

        //各窗口按钮事件
        $("#node-info-edit").on('click', function (e) {
            showNodeEditView(paramHolder.subParamHolder.nodeInfo.currentId);
        });

        function fillEditNodeInfoWithId(id) {
            var nodeInfo = paramHolder.info.nodes.get(id);
            var devName = getWithDefault(nodeInfo.devName, '');
            var devIp = getWithDefault(nodeInfo.devIp, '');
            var devType = getWithDefault(nodeInfo.devType, 1);
            var isStationDev = getWithDefault(nodeInfo.isStationDev, 1);

            $("#edit-node-info-name").val(devName);
            $("#edit-node-info-ip").val(devIp);
            $("#edit-node-info-type ").val(devType);
            $("#edit-node-info-is-station-dev").val(isStationDev);
            paramHolder.subParamHolder.nodeEdit.currentId = id;
        }

        $('#edit-node-info-save').on('click', function (e) {
            // var param = paramHolder.info.nodes.get(paramHolder.subParamHolder.nodeEdit.currentId);
            var param = {
                id: paramHolder.subParamHolder.nodeEdit.currentId,
                devName: $("#edit-node-info-name").val(),
                devIp: $("#edit-node-info-ip").val(),
                devType: $("#edit-node-info-type").val(),
                isStationDev: $("#edit-node-info-is-station-dev").val()
            }
            paramHolder.info.nodes.update(param);
            showNodeInfoView(paramHolder.subParamHolder.nodeEdit.currentId)
        });


        //数据本地同步
        paramHolder.data.nodes.on('add', function (event, properties, senderId) {
            console.log(event);
            console.log(properties);
            console.log(senderId);
            $.each(properties.items, function (index, id) {
                paramHolder.info.nodes.add({
                    id: id,
                    devType: paramHolder.data.nodes.get(id).devType
                })
            });
        });

        paramHolder.data.nodes.on('remove', function (event, properties, senderId) {
            paramHolder.info.nodes.remove(properties.items);
            //自动删除开放的连接线
            $.each(paramHolder.data.edges.get(),function (index, element) {
                if(properties.items.indexOf( element.from)!== -1 || properties.items.indexOf( element.to)!==-1 ){
                    paramHolder.data.edges.remove(element);
                }
            });
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
        });


        paramHolder.info.nodes.on('update', function (event, properties, senderId) {
            //更新topo图上的表现形式
            $.each(properties.items, function (index, id) {
                var nodeData = paramHolder.info.nodes.get(id);
                var group = paramHolder.mark.idIndex[nodeData.devType];

                paramHolder.data.nodes.update({
                    id: id,
                    group: group.name
                })
            });
        })
    }

});