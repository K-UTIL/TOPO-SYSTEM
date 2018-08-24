package cn.showclear.toposystem.pojo.vo.topo;

import lombok.*;
import lombok.experimental.Accessors;

import org.springframework.validation.annotation.Validated;


import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;


@Validated
@Data
@Accessors(chain = true)//Set return this
@NoArgsConstructor
@AllArgsConstructor
public class TopoConfigVo {
    @NotBlank
    private String stNumber;
    private List<Nodes> nodes = new ArrayList<>();
    private List<Edges> edges = new ArrayList<>();

    @Data
    public static class Nodes {
        private String id;
        private String devName;
        private String ip;
        private Integer devTypeId;
        private String lat;
        private String lng;
        private Integer isStationDev;
        private String parentNodeId;
        private Integer pduComNumber;
        private String topoViewConfig;
        private String mark;
    }

    @Data
    public static class Edges {
        private String id;
        private String edgeName;
        private String fromId;
        private String toId;
        private Integer direction;
        private String topoViewConfig;
        private String mark;
    }
}
