package cn.showclear.toposystem.impl.topo;

import cn.showclear.toposystem.pojo.jo.topo.TopoNodeTree;
import cn.showclear.toposystem.pojo.po.TopoEdgeEntity;
import cn.showclear.toposystem.pojo.po.TopoNodeEntity;
import cn.showclear.toposystem.pojo.vo.topo.TopoConfigVo;
import cn.showclear.toposystem.repository.topo.TopoEdgeMapper;
import cn.showclear.toposystem.repository.topo.TopoNodeMapper;
import cn.showclear.toposystem.service.topo.TopoNodeService;
import com.google.common.base.Function;
import com.google.common.base.Objects;
import com.google.common.base.Predicate;
import com.google.common.collect.FluentIterable;
import org.apache.commons.lang3.StringUtils;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
public class TopoNodeServiceImpl /*extends ServiceImpl<TopoNodeMapper,TopoNode>*/ implements TopoNodeService {
    //    @Autowired
    private TopoNodeMapper topoNodeMapper;
    //    @Autowired
    private TopoEdgeMapper topoEdgeMapper;

    @Autowired
    public TopoNodeServiceImpl(TopoNodeMapper topoNodeMapper, TopoEdgeMapper topoEdgeMapper) {
        this.topoNodeMapper = topoNodeMapper;
        this.topoEdgeMapper = topoEdgeMapper;
    }

    @Autowired
    public TopoNodeServiceImpl setTopoNodeMapper(TopoNodeMapper topoNodeMapper) {
        this.topoNodeMapper = topoNodeMapper;
        return this;
    }

    @Autowired
    public TopoNodeServiceImpl setTopoEdgeMapper(TopoEdgeMapper topoEdgeMapper) {
        this.topoEdgeMapper = topoEdgeMapper;
        return this;
    }

    //存在双向索引会导致死循环
    @Override
    public List<TopoNodeTree> parseTopoNode(TopoConfigVo topoConfigVo) {
        List<TopoConfigVo.Nodes> nodes = topoConfigVo.getNodes();
        nodes = FluentIterable.from(nodes).filter(new Predicate<TopoConfigVo.Nodes>() {
            @Override
            public boolean apply(@NullableDecl TopoConfigVo.Nodes nodes) {
                return nodes != null;
            }
        }).toList();

        LinkedList<TopoNodeTree> nodeQueue = new LinkedList<>();
        //添加一个id为空的起始节点
        TopoNodeTree allTrees = new TopoNodeTree().setCurrentNode(new TopoConfigVo.Nodes().setId(""));
        nodeQueue.offer(allTrees);
        while (!nodeQueue.isEmpty()) {
            final TopoNodeTree poll = nodeQueue.poll();
            for (TopoConfigVo.Nodes node : nodes) {
                if (Objects.equal(node.getParentNodeId(), poll.getCurrentNode().getId())) {
                    TopoNodeTree childTree = new TopoNodeTree().setCurrentNode(node);
                    nodeQueue.offer(childTree);
                    poll.getChildrenNodes().add(childTree);
                }
            }
        }
        return allTrees.getChildrenNodes();
    }

    @Override
    @Transactional
    public void save(TopoConfigVo topoConfigVo) {
        List<TopoNodeTree> nodeTrees = parseTopoNode(topoConfigVo);

        for (TopoNodeTree tree : nodeTrees) {
            LinkedList<TopoNodeTree> topoNodeQueue = new LinkedList<>();
            TopoNodeEntity peak = save(topoConfigVo, tree.getCurrentNode(), null);
            tree.setCurrentNodePo(peak);

            topoNodeQueue.offer(tree);
            while (!topoNodeQueue.isEmpty()) {
                TopoNodeTree poll = topoNodeQueue.poll();

                for (TopoNodeTree childTree : poll.getChildrenNodes()) {
                    topoNodeQueue.offer(childTree);
                    TopoNodeEntity childNode = save(topoConfigVo, poll.getCurrentNode(), poll.getCurrentNodePo().getId());
                    childTree.setCurrentNodePo(childNode);

                    TopoEdgeEntity save = save(topoConfigVo, poll, childTree);
                    int i = 1;//debug
                }
            }


        }
    }

    @Override
    public TopoConfigVo getByStNumber(String stNumber) {
        List<TopoNodeEntity> nodeEntities = topoNodeMapper.findByStNumber(stNumber);
        List<TopoEdgeEntity> edgeEntities = topoEdgeMapper.getByStNumber(stNumber);
        return new TopoConfigVo().setStNumber(stNumber)
                .setEdges(FluentIterable.from(edgeEntities).transform(new Function<TopoEdgeEntity, TopoConfigVo.Edges>() {
                    @NullableDecl
                    @Override
                    public TopoConfigVo.Edges apply(@NullableDecl TopoEdgeEntity topoEdgeEntity) {
                        return new TopoConfigVo.Edges()
                                .setDirection(topoEdgeEntity.getDirection())
                                .setEdgeName(topoEdgeEntity.getEdgeName())
                                .setFromId(String.valueOf(topoEdgeEntity.getFromDevId()))
                                .setToId(String.valueOf(topoEdgeEntity.getToDevId()))
                                .setId(String.valueOf(topoEdgeEntity.getId()))
                                .setMark(topoEdgeEntity.getMark())
                                .setTopoViewConfig(topoEdgeEntity.getTopoEdgeConfig());
                    }
                }).toList())
                .setNodes(FluentIterable.from(nodeEntities).transform(new Function<TopoNodeEntity, TopoConfigVo.Nodes>() {
                    @NullableDecl
                    @Override
                    public TopoConfigVo.Nodes apply(@NullableDecl TopoNodeEntity topoNodeEntity) {
                        return new TopoConfigVo.Nodes()
                                .setDevName(topoNodeEntity.getDevName())
                                .setDevTypeId(topoNodeEntity.getDevType())
                                .setId(String.valueOf(topoNodeEntity.getId()))
                                .setIp(topoNodeEntity.getDevIp())
                                .setIsStationDev(topoNodeEntity.getIsStationDev())
                                .setLat(topoNodeEntity.getLat())
                                .setLng(topoNodeEntity.getLng())
                                .setParentNodeId(String.valueOf(topoNodeEntity.getParentNodeId()))
                                .setMark(topoNodeEntity.getMark())
                                .setPduComNumber(topoNodeEntity.getPduComNumber())
                                .setTopoViewConfig(topoNodeEntity.getTopoNodeConfig());
                    }
                }).toList());
    }

    private TopoNodeEntity parseTopoNodePo(TopoConfigVo topoConfigVo, TopoConfigVo.Nodes node) {
        TopoNodeEntity topoNodeEntity = new TopoNodeEntity()
                .setDevIp(node.getIp())
                .setDevName(node.getDevName())
                .setDevType(node.getDevTypeId())
                .setExtend("")// TODO: 2018/8/20
                .setIsStationDev(node.getIsStationDev())
                .setLat(node.getLat())
                .setLng(node.getLng())
                .setMark(node.getMark())
                .setStNumber(topoConfigVo.getStNumber())
                .setPduComNumber(node.getPduComNumber())
                .setTopoNodeConfig(node.getTopoViewConfig());
        if(StringUtils.isNumeric(node.getId())){
            topoNodeEntity.setId(Integer.parseInt(node.getId()));
        }
        return topoNodeEntity;
    }

    private TopoNodeEntity save(TopoNodeEntity topoNode, Integer parentId) {
        TopoNodeEntity node = topoNode.setParentNodeId(parentId);
        topoNodeMapper.save(node);
        return topoNode;
    }

    private TopoNodeEntity save(TopoConfigVo topoConfigVo, TopoConfigVo.Nodes node, Integer parentId) {
        return save(parseTopoNodePo(topoConfigVo, node), parentId);
    }


    private TopoEdgeEntity save(TopoConfigVo topoConfigVo, TopoNodeTree parent, TopoNodeTree child) {
        for (TopoConfigVo.Edges edges : topoConfigVo.getEdges()) {
            if (Objects.equal(parent.getCurrentNode().getId(), edges.getFromId()) &&
                    Objects.equal(child.getCurrentNode().getId(), edges.getToId())) {
                TopoEdgeEntity topoEdge = new TopoEdgeEntity()
                        .setDirection(edges.getDirection())
                        .setEdgeName(edges.getEdgeName())
                        .setFromDevId(parent.getCurrentNodePo().getId())
                        .setToDevId(child.getCurrentNodePo().getId())
                        .setExtend("")
                        .setMark(edges.getMark())
                        .setTopoEdgeConfig(edges.getTopoViewConfig());
                if(StringUtils.isNumeric(edges.getId())){
                    topoEdge.setId(Integer.parseInt(edges.getId()));
                }
                topoEdgeMapper.save(topoEdge);
                return topoEdge;
            }

        }
        return null;
    }
}
