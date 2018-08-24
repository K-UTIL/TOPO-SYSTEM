package cn.showclear.toposystem.controller;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.APIRespJson;
import cn.showclear.toposystem.pojo.vo.topo.TopoConfigVo;
import cn.showclear.toposystem.service.topo.TopoNodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController()
@RequestMapping("/v1/data/topo")
public class TopoDataController {
    private TopoNodeService topoNodeService;

    @Autowired
    public TopoDataController(TopoNodeService topoNodeService) {
        this.topoNodeService = topoNodeService;
    }



//    @ResponseBody
    @PostMapping("/")
    public APIRespJson addTopo(/*@Valid*/ @RequestBody TopoConfigVo topoConfigVo, BindingResult bindingResult){
        topoNodeService.save(topoConfigVo);
        System.out.println(topoConfigVo);
        return null;
    }

    @GetMapping("/{stNumber}")
    public APIRespJson getTopoByStNumber(@PathVariable String stNumber){
        return new APIObjectJson(topoNodeService.getByStNumber(stNumber));
    }

}
