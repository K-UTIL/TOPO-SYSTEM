package cn.showclear.toposystem.pojo.jo.topo;

import cn.showclear.toposystem.pojo.po.TopoNode;
import cn.showclear.toposystem.pojo.po.TopoNodeEntity;
import cn.showclear.toposystem.pojo.vo.topo.TopoConfigVo;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class TopoNodeTree {
    private TopoConfigVo.Nodes currentNode;
    private TopoNodeEntity currentNodePo;
    private List<TopoNodeTree> childrenNodes = new ArrayList<>();
}
