import * as $ from  'jquery';


export class ApiManager {
    static getConfig():string{
        return '/config.json';
    }

    static addTopo():string{
        return '/data/topo/'
    }

    static getTopoByStNumber(stNumber:string):string{
        return '/data/topo/' + stNumber;
    }
}

