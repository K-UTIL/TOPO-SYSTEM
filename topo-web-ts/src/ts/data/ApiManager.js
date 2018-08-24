var ApiManager = /** @class */ (function () {
    function ApiManager() {
    }
    ApiManager.getConfig = function () {
        return '/config.json';
    };
    ApiManager.addTopo = function () {
        return '/data/topo/';
    };
    ApiManager.getTopoByStNumber = function (stNumber) {
        return '/data/topo/' + stNumber;
    };
    return ApiManager;
}());
export { ApiManager };
//# sourceMappingURL=ApiManager.js.map