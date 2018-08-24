package cn.showclear.toposystem.service.topo;

import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.toposystem.pojo.jo.topo.TopoNodeTree;
import cn.showclear.toposystem.pojo.po.TopoNode;
import cn.showclear.toposystem.pojo.vo.topo.TopoConfigVo;
import org.springframework.stereotype.Service;

import java.util.List;

public interface TopoNodeService {
    List<TopoNodeTree> parseTopoNode(TopoConfigVo topoConfigVo);

    void save(TopoConfigVo topoConfigVo);

    TopoConfigVo getByStNumber(String stNumber);
}
