package cn.showclear.toposystem.pojo.po;

import com.google.common.base.Objects;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

@DynamicInsert
@DynamicUpdate
@Data
@Accessors(chain = true)
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "T_TOPO_NODE", schema = "DB_SC_TOPO_PLUS", catalog = "")
public class TopoNodeEntity {
    @Id
    @Column(name = "id"/*,nullable = false*/)
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "dev_name"/*,nullable = false*/)
    private String devName;
    @Basic
    @Column(name = "dev_ip"/*,nullable = false*/)
    private String devIp;
    @Basic
    @Column(name = "dev_type"/*,nullable = false*/)
    private Integer devType;
    @Basic
    @Column(name = "lat"/*,nullable = false*/)
    private String lat;
    @Basic
    @Column(name = "lng"/*,nullable = false*/)
    private String lng;
    @Basic
    @Column(name = "is_station_dev"/*,nullable = false*/)
    private Integer isStationDev;
    @Basic
    @Column(name = "st_number"/*,nullable = false*/)
    private String stNumber;
    @Basic
    @Column(name = "parent_node_id"/*,nullable = false*/)
    private Integer parentNodeId;
//    @OneToOne(fetch = FetchType.LAZY)
////    @Column(name = "parent_node_id"/*,nullable = false*/)
//    @JoinColumn(name = "parent_node_id")
//    @NotFound(action= NotFoundAction.IGNORE)
//    private TopoNodeEntity parentNodeId;
    @Basic
    @Column(name = "pdu_com_number"/*,nullable = false*/)
    private Integer pduComNumber;
    @Basic
    @Column(name = "topo_node_config"/*,nullable = false*/)
    private String topoNodeConfig;
    @Basic
    @Column(name = "extend"/*,nullable = false*/)
    private String extend;
    @Basic
    @Column(name = "mark"/*,nullable = false*/)
    private String mark;
}
