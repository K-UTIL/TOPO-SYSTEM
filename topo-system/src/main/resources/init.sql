CREATE  TABLE T_TOPO_NODE(
  id int AUTO_INCREMENT PRIMARY KEY ,
  dev_name VARCHAR(128) not null default '' '设备名称',
  dev_ip char(15) not null default '0.0.0.0' comment 'IP地址',
  dev_type tinyint not null default 0 comment '设备类型',
  lat decimal(10,6) not null default  0 comment '纬度',
  lng decimal(10,6)  not null  default 0 comment '经度',
  is_station_dev tinyint not null  default 0 comment  '是否为台站设备 0不是 1是',
  st_number varchar(100) not null  default '' comment '台站编码',
  parent_node_id int not null default  0 comment '上级节点',
  pdu_com_number tinyint not null  default  0 comment 'PDU开关序号',
  topo_node_config varchar(2048) not null default '' comment 'vis展示topo属性',
  extend varchar(256) default '' comment '补充字段',
  mark varchar(256) default '' comment '备注'
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE T_TOPO_EDGE(
  id int AUTO_INCREMENT PRIMARY KEY ,
  edge_name varchar(128) not null default '' comment '关系名称',
  from_dev_id int not null comment '网络设备1',
  to_dev_id int not null comment '网络设备2',
  direction tinyint not null default 0 comment '方向 0:设备1到2 ; 1:设备2到1 ; 2:双向',
  topo_edge_config varchar(2048) not null default '' comment 'vis展示topo属性',
  extend varchar(256) default '' comment '补充字段',
  mark varchar(256) default '' comment '备注'
)ENGINE=InnoDB CHARSET=utf8;