import { ParamHolder } from "../data/ParamHolder";
import { Utils } from "../util/Utils";
import { Config } from "../data/Config";
import { ApiManager } from "../data/ApiManager";
import { layer } from "../../index";
import * as $ from 'jquery';
var SaveAndExportManager = /** @class */ (function () {
    function SaveAndExportManager() {
    }
    SaveAndExportManager.init = function () {
        this.initEvent();
    };
    SaveAndExportManager.initEvent = function () {
        $("#topo-save").on('click', function (e) {
            layer.confirm('确认保存？', { icon: 3, title: '提示' }, function (index) {
                var dataObj = Utils.parseServer(ParamHolder.data, ParamHolder.info, ParamHolder.stNumber);
                $.ajax({
                    type: "POST",
                    url: Config.serverHost + ApiManager.addTopo(),
                    data: JSON.stringify(dataObj),
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8'
                }).done(function (resp) {
                    if (resp.code === 0) {
                        layer.alert("保存成功！");
                    }
                });
                layer.close(index);
            });
        });
    };
    return SaveAndExportManager;
}());
export { SaveAndExportManager };
//# sourceMappingURL=SaveAndExport.js.map