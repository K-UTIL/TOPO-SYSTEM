var EdgeIcon = /** @class */ (function () {
    function EdgeIcon(edgeId, imageSrc, network, opacity) {
        this.type = 'edge';
        this._edgeId = '';
        this.image = {};
        this.network = {};
        this.position = { x: 0, y: 0 };
        this.opacity = 1;
        this._edgeId = edgeId;
        // @ts-ignore
        this.image = new Image();
        this.image.src = imageSrc;
        this.network = network;
        opacity && (this.opacity = opacity);
    }
    EdgeIcon.prototype.getCanvasPosition = function () {
        var connectedNodes = this.network.getConnectedNodes(this._edgeId);
        var positions = this.network.getPositions(connectedNodes);
        var x = (positions[connectedNodes[0]].x + positions[connectedNodes[1]].x) / 2 - this.image.width / 2;
        var y = (positions[connectedNodes[0]].y + positions[connectedNodes[1]].y) / 2 - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        };
        return this.position;
    };
    EdgeIcon.prototype.getImage = function () {
        return this.image;
    };
    EdgeIcon.prototype.isContains = function (canvasX, canvasY) {
        var me = this;
        var lt = me.position;
        var rb = {
            x: me.position.x + me.image.width,
            y: me.position.y + me.image.height
        };
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    };
    Object.defineProperty(EdgeIcon.prototype, "edgeId", {
        get: function () {
            return this._edgeId;
        },
        enumerable: true,
        configurable: true
    });
    return EdgeIcon;
}());
export { EdgeIcon };
var NodeIcon = /** @class */ (function () {
    function NodeIcon(nodeId, imageSrc, network, opacity) {
        this.type = 'node';
        this._nodeId = '';
        this.image = {};
        this.network = {};
        this.position = { x: 0, y: 0 };
        this.opacity = 1;
        // @ts-ignore
        this.image = new Image();
        this._nodeId = nodeId;
        this.image.src = imageSrc;
        this.network = network;
        opacity && (this.opacity = opacity);
    }
    NodeIcon.prototype.getCanvasPosition = function () {
        var positions = this.network.getPositions(this._nodeId);
        var x = (positions[this._nodeId].x) - this.image.width / 2;
        var y = (positions[this._nodeId].y) - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        };
        return this.position;
    };
    NodeIcon.prototype.getImage = function () {
        return this.image;
    };
    NodeIcon.prototype.isContains = function (canvasX, canvasY) {
        var me = this;
        var lt = me.position;
        var rb = {
            x: me.position.x + me.image.width,
            y: me.position.y + me.image.height
        };
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    };
    Object.defineProperty(NodeIcon.prototype, "nodeId", {
        get: function () {
            return this._nodeId;
        },
        enumerable: true,
        configurable: true
    });
    return NodeIcon;
}());
export { NodeIcon };
//# sourceMappingURL=Icon.js.map