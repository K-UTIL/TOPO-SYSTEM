import {ParamHolder} from "../data/ParamHolder";
import {Utils} from "../util/Utils";
import {Config} from "../data/Config";
import {ApiManager} from "../data/ApiManager";
import {layer} from "../../index";
import * as $ from  'jquery';


export class SaveAndExportManager{

    public static init(){
        this.initEvent();
    }

    private static initEvent(){
        $("#topo-save").on('click', function (e) {
            layer.confirm('确认保存？', {icon: 3, title: '提示'}, function (index:any) {
                var dataObj = Utils.parseServer(ParamHolder.data,ParamHolder.info,ParamHolder.stNumber);

                $.ajax({
                    type: "POST",
                    url: Config.serverHost + ApiManager.addTopo(),
                    data: JSON.stringify(dataObj),
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8'
                }).done(function (resp) {
                    if (resp.code === 0) {
                        layer.alert("保存成功！")
                    }
                });

                layer.close(index);
            });
        });
    }


}
