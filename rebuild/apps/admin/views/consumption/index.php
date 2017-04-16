<?php

use admin\widgets\Table;
use bases\lib\Url;
use common\model\Advert;
use common\model\App;
use common\model\MainUser;

echo Table::widget([
    'title' => '数据列表',
    'aOpt' => [
       
        [
            'title' => '批量审核',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['consumption/update']),
            'data-value' => 1,
            'data-update' => '',
            'data-field' => 'status'
        ],
        [
            'title' => '批量无效',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['consumption/update']),
            'data-value' => 3,
            'data-update' => '',
            'data-field' => 'status'
        ],
//        [
//            'title' => ' 批量有效',
//            'icon_class' => 'glyphicon glyphicon-eye-open',
//            'data-action' => Url::to(['consumption/update']),
//            'data-value' => 0,
//            'data-update' => '',
//            'data-field' => 'status'
//        ],
    ],
    'aSearch' => [
        'action' => Url::to(['consumption/index']),
        'aFieldList' => [
            [
                'name' => 'order_sn',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '订单号',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
             [
                'name' => 'desc',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '描述',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'start_create_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '创建时间',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'end_create_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '到:创建时间',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
            ],           
            [
                'name' => 'status',
                'field_type' => 'select',
                'value' => '',
                'placeholder' => '状态',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
                'data_provides' => [
                    //0 正常 1待结算 2已结算 3禁用
                    'data' => [['--结算状态--', ''],['未结算', 0],['无效', 3]],
                ]
            ],            
            [
                'name' => 'type',
                'field_type' => 'select',
                'value' => '',
                'placeholder' => '游戏类型',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
                'data_provides' => [
                    //0 正常 1待结算 2已结算 3禁用
                    'data' => [['--游戏类型--', ''],['自营游戏', 0],['合作游戏', 1]],
                ]
            ],            
            [
                'name' => 'ad_id',
                'field_type' => 'select',
                'value' => '',
                'placeholder' => '所属广告',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
                'data_provides' => [
                    'class' => '\common\model\Advert',
                    'method' => 'getSelectAdvertDataList',
                    'params' => [],
                    'options' => [
                        'useEmpty' => true,
                        'emptyText' => '-所属广告-',
                        'emptyValue' => ''
                    ]
                ]
            ],            
            [
                'name' => 'app_id',
                'field_type' => 'select',
                'value' => '',
                'placeholder' => '所属游戏',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
                'data_provides' => [
                    'class' => '\admin\controllers\AdvertController',
                    'method' => 'getAppList',
                    'params' => [],
                    'options' => [
                        'useEmpty' => true,
                        'emptyText' => '-所属游戏-',
                        'emptyValue' => ''
                    ]
                ]
            ],
        ]
    ],
    'aColumns' => [
        'fBuildRowId' => function($aRowData) {
            return $aRowData['id'];
        },
        'isCheckBox' => true,
        'aColumnsList' => [
            'order_sn' => [
                'title' => '订单号',
                'class' => 'text-center'                
            ],
            'type' => [
                'title' => '类型',
                'class' => 'text-center',
                "content"=>function($aData){
                    return $aData['type'] ? '合作游戏' : '自营游戏';
                }
            ],
            'money' => [
                'title' => '消费金额',
                'class' => 'text-center',
            ],
            'meny0' => [
                'title' => '红人佣金',
                'class' => 'text-center',
                "content"=>function($aData){
                    return $aData['money'] * 0.2;
                }
            ],
            'meny1' => [
                'title' => '公会佣金',
                'class' => 'text-center',
                "content"=>function($aData){ 
                    $mOrgCommission = \common\model\OrgCommission::findOne(['org_id'=>$aData['org_id']]);
                    $mOrganizations = \common\model\xmodel\Organizations::findOne(['id'=>$aData['org_id']]);
                    if(!$mOrganizations){
                        return 0;
                    }
                    $commission_rate = $mOrganizations->commision_rate;
                    if($mOrgCommission && $mOrgCommission->commision_rate > 0){
                        $commission_rate = $mOrgCommission->commision_rate;
                    }    
                    return $aData['money'] * ($commission_rate / 100);
                }
            ],
            'uid' => [
                'title' => '消费用户',
                'class' => 'text-center',
                "content"=>function($aData){
                    $mUser = MainUser::findOne($aData['uid']);
                    if(!$mUser){
                        return '未知';
                    }
                    return $mUser->username;
                }
            ],
            'rednet_id' => [
                'title' => '网红',
                'class' => 'text-center',
                "content"=>function($aData){
                    $mRednet =  \common\model\xmodel\Rednet::findOne($aData['rednet_id']);
                    if(!$mRednet){
                        return '--';
                    }
                    return $mRednet->name;
                }
            ],
            'org_id' => [
                'title' => '公会',
                'class' => 'text-center',
                "content"=>function($aData){
                    $mRednet =  \common\model\xmodel\Organizations::findOne($aData['org_id']);
                    if(!$mRednet){
                        return '--';
                    }
                    return $mRednet->name;
                }
            ],
            'app_id' => [
                'title' => '所属游戏',
                'class' => 'text-center',
                "content"=>function($aData){
                    $mApp = App::findOne($aData['app_id']);
                    if(!$mApp){
                        return '未知';
                    }
                    return $mApp->name;
                }
            ],
            'ad_id' => [
                'title' => '所属广告',
                'class' => 'text-center',
                "content"=>function($aData){
                    $mAdvert = Advert::findOne($aData['ad_id']);
                    if(!$mAdvert){
                        return '未知广告';
                    }
                    return $mAdvert->title;
                }
            ],
            'create_time' => [
                'title' => '创建时间',
                'class' => 'text-center',
                "content" => function($aData) {
                    return isset($aData['create_time']) ? date("Y-m-d H:i:s", $aData['create_time']) : "未知";
                }
            ],           
            'status' => [
                'title' => '状态',
                'class' => 'text-center',
                "content" => function($aData) {
                    if($aData['status'] == 0){
                        return '<span style="color:#090">待审核</span>';
                    }
                    if($aData['status'] == 1){
                        return '<span style="color:#ccc">已审核</span>';
                    }
                    return '<span style="color:red">无效</span>';
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {                    
                    $statusTag1 = '<a data-field="status" data-value="3" data-update="' . $aData['id'] . '" data-action="' . Url::to(['consumption/update']) . '" href="javascript:void(0)">无效</a>';
                    if (isset($aData['status']) && $aData['status'] == 3) {
                        $statusTag1 = '<a data-field="status" data-value="0" data-update="' . $aData['id'] . '" data-action="' . Url::to(['consumption/update']) . '" href="javascript:void(0)">有效</a>';
                    }
                    $statusTag2 = '';
                    if (isset($aData['status']) && $aData['status'] == 0) {
                        $statusTag2 .= '<a data-field="status" data-value="1" data-update="' . $aData['id'] . '" data-action="' . Url::to(['consumption/update']) . '" href="javascript:void(0)">审核</a>';
                        $statusTag2 .= '<span class="text-explode">|</span>';                        
                    }
                    return $statusTag2 . $statusTag1;
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
