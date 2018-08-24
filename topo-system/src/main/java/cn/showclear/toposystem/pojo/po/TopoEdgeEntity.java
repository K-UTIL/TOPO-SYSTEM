package cn.showclear.toposystem.pojo.po;

import com.google.common.base.Objects;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@DynamicInsert
@DynamicUpdate
@Data
@Accessors(chain = true)
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "T_TOPO_EDGE", schema = "DB_SC_TOPO_PLUS", catalog = "")
public class TopoEdgeEntity {
    @Id
    @Column(name = "id"/*nullable = false*/)
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "edge_name"/*nullable = false*/)
    private String edgeName;
    @Basic
    @Column(name = "from_dev_id"/*nullable = false*/)
    private Integer fromDevId;
    @Basic
    @Column(name = "to_dev_id"/*nullable = false*/)
    private Integer toDevId;
    @Basic
    @Column(name = "direction"/*nullable = false*/)
    private Integer direction;
    @Basic
    @Column(name = "topo_edge_config"/*nullable = false*/)
    private String topoEdgeConfig;
    @Basic
    @Column(name = "extend"/*nullable = false*/)
    private String extend;
    @Basic
    @Column(name = "mark"/*nullable = false*/)
    private String mark;
}
