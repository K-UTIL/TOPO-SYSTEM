package cn.showclear.toposystem.repository.topo;

import cn.showclear.toposystem.pojo.po.TopoNode;
import cn.showclear.toposystem.pojo.po.TopoNodeEntity;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//@Mapper
@Repository
public interface TopoNodeMapper  extends PagingAndSortingRepository<TopoNodeEntity,Integer> {
    List<TopoNodeEntity> findByStNumber(String stNumber);
}
