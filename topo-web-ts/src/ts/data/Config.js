var Config = /** @class */ (function () {
    function Config() {
    }
    Config.nodesTypeUrl = '';
    Config.lineTypeUrl = '';
    /**
     * @deprecated 现在从服务器获取
     * @see ApiManager#getConfig
     */
    Config.defaultNodeType = [
        {
            className: '专业设备',
            subDev: [{
                    id: 1,
                    name: 'GNSS接收机',
                    iconUrl: '../image/ico_camera.png'
                }, {
                    id: 2,
                    name: '磁通门磁力仪',
                    iconUrl: '../image/ico_shebei.png'
                }]
        }, {
            className: '网络设备',
            subDev: [{
                    id: 3,
                    name: '服务器',
                    iconUrl: '../image/ico_server.png'
                }, {
                    id: 4,
                    name: '交换机',
                    iconUrl: '../image/switch-l3.png'
                }, {
                    id: 5,
                    name: '有线路由器字数超出',
                    iconUrl: '../image/router.png'
                }, {
                    id: 6,
                    name: '无线路由器',
                    iconUrl: '../image/router.png'
                }]
        }
    ];
    Config.defaultLineTypes = {
        colors: [{
                id: 1,
                properties: {
                    color: '#4392fe',
                    backgroundImage: ''
                },
                default: true
            }, {
                id: 2,
                properties: {
                    color: '#da7a77',
                    backgroundImage: ''
                }
            }, {
                id: 3,
                properties: {
                    color: '#0c0c0c',
                    backgroundImage: ''
                }
            }, {
                id: 4,
                properties: {
                    color: '#f08500',
                    backgroundImage: ''
                }
            }, {
                id: 5,
                properties: {
                    color: '#c1da50',
                    backgroundImage: ''
                }
            }, {
                id: 6,
                properties: {
                    color: '#909092',
                    backgroundImage: ''
                }
            }],
        widths: [{
                id: 1,
                properties: {
                    width: 1,
                    backgroundImage: ''
                },
                default: true
            }, {
                id: 2,
                properties: {
                    width: 2,
                    backgroundImage: ''
                }
            }, {
                id: 3,
                properties: {
                    width: 3,
                    backgroundImage: ''
                }
            }],
        dashes: [{
                id: 1,
                properties: {
                    dash: [1, 0],
                    backgroundImage: ''
                },
                default: true
            }, {
                id: 2,
                properties: {
                    dash: [3, 4],
                    backgroundImage: '../image/lines/dash/dash-4_3.png'
                }
            }],
        arrows: [{
                id: 1,
                properties: {
                    name: '有向',
                    arrow: 'to',
                    backgroundImage: ''
                },
                default: true
            }, {
                id: 2,
                properties: {
                    name: '无向',
                    arrow: '',
                    backgroundImage: ''
                }
            }, {
                id: 3,
                properties: {
                    name: '双向',
                    arrow: 'to,from',
                    backgroundImage: ''
                }
            }]
    };
    Config.serverHost = 'http://192.168.100.233:8080/topo/v1';
    Config.extendConfig = {
        edgeIcon: {
            opacity: {
                selected: 1,
                unselected: 0.4
            }
        },
        nodeIcon: {
            opacity: {
                selected: 1,
                unselected: 0.4
            }
        }
    };
    return Config;
}());
export { Config };
//# sourceMappingURL=Config.js.map