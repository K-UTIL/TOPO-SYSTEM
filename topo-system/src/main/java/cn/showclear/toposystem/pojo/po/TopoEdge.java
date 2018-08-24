package cn.showclear.toposystem.pojo.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;


@Data
@NoArgsConstructor
@Accessors(chain = true)
@Deprecated
public class TopoEdge {
    private Integer id;
    private String edgeName;
    private Integer fromDevId;
    private Integer toDevId;
    private Integer direction;
    private String topoEdgeConfig;
    private String extend;
    private String mark;

}
