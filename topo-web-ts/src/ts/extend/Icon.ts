import * as $ from  'jquery';


export interface Icon {
    opacity: number;

    isContains(canvasX: number, canvasY: number): boolean;

    getCanvasPosition(): { x: number, y: number };

    getImage(): any;//image对象

}

export class EdgeIcon implements Icon {
    private type: string = 'edge';
    private _edgeId: string = '';
    private image: any = {};
    private network: any = {};
    private position: { x: number, y: number } = {x: 0, y: 0};
    opacity: number = 1;

    constructor(edgeId: string, imageSrc: string, network: any, opacity?: number) {
        this._edgeId = edgeId;
        // @ts-ignore
        this.image = new Image();
        this.image.src = imageSrc;
        this.network = network;
        opacity && (this.opacity = opacity);
    }

    getCanvasPosition(): { x: number; y: number } {
        var connectedNodes = this.network.getConnectedNodes(this._edgeId);
        var positions = this.network.getPositions(connectedNodes);
        var x = (positions[connectedNodes[0]].x + positions[connectedNodes[1]].x) / 2 - this.image.width / 2;
        var y = (positions[connectedNodes[0]].y + positions[connectedNodes[1]].y) / 2 - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        };
        return this.position;
    }

    getImage() {
        return this.image;
    }

    isContains(canvasX: number, canvasY: number): boolean {
        var me = this;
        var lt = me.position;
        var rb = {
            x: me.position.x + me.image.width,
            y: me.position.y + me.image.height
        }
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    }


    get edgeId(): string {
        return this._edgeId;
    }


}

export class NodeIcon implements Icon {
    private type: string = 'node';
    private _nodeId: string = '';
    private image: any = {};
    private network: any = {};
    private position: { x: number, y: number } = {x: 0, y: 0};
    opacity: number = 1;

    constructor(nodeId: string, imageSrc: string, network: any, opacity?: number) {
        // @ts-ignore
        this.image = new Image();
        this._nodeId = nodeId;
        this.image.src = imageSrc;
        this.network = network;
        opacity && (this.opacity = opacity);
    }

    getCanvasPosition(): { x: number; y: number } {
        var positions = this.network.getPositions(this._nodeId);
        var x = (positions[this._nodeId].x) - this.image.width / 2;
        var y = (positions[this._nodeId].y) - this.image.height / 2;
        this.position = {
            x: x,
            y: y
        }
        return this.position;
    }

    getImage() {
        return this.image;
    }


    isContains(canvasX: number, canvasY: number): boolean {
        var me = this;
        var lt = me.position;
        var rb = {
            x: me.position.x + me.image.width,
            y: me.position.y + me.image.height
        }
        return (canvasX >= lt.x) && (canvasX <= rb.x) && (canvasY >= lt.y) && (canvasY <= rb.y);
    }


    get nodeId(): string {
        return this._nodeId;
    }
}