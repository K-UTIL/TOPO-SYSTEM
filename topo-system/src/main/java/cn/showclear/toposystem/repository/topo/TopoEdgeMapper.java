package cn.showclear.toposystem.repository.topo;

import cn.showclear.toposystem.pojo.po.TopoEdge;
import cn.showclear.toposystem.pojo.po.TopoEdgeEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
//@Mapper
public interface TopoEdgeMapper extends PagingAndSortingRepository<TopoEdgeEntity, Integer> {

    @Query("select edge FROM TopoEdgeEntity edge" +
            " left join  TopoNodeEntity node1 on edge.toDevId = node1.id " +
            " left join TopoNodeEntity node2 on edge.fromDevId = node2.id " +
            "where node1.stNumber = ?1 or node2.stNumber = ?1")
    List<TopoEdgeEntity> getByStNumber(String stNumber);
}
