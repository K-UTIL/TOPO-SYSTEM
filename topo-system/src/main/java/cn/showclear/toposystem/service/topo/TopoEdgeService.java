package cn.showclear.toposystem.service.topo;

import cn.showclear.toposystem.pojo.po.TopoEdge;
import cn.showclear.toposystem.pojo.vo.topo.TopoConfigVo;
import org.springframework.stereotype.Service;

import javax.validation.constraints.Size;
import javax.xml.ws.ServiceMode;
import java.util.List;

public interface TopoEdgeService {
    List<TopoEdge> parseTopoEdge(TopoConfigVo topoConfigVo);

}
