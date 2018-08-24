package cn.showclear.toposystem.pojo.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.stereotype.Repository;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.Valid;

@Data
@NoArgsConstructor
@Accessors(chain = true)
@Deprecated
public class TopoNode {
    private Integer id;
    private String devName;
    private String devIp;
    private Integer devType;
    private String lat;
    private String lng;
    private Integer isStationDev;
    private String stNumber;
    private Integer parentNodeId;
    private Integer pduComNumber;
    private String topoNodeConfig;
    private String extend;
    private String mark;
}
