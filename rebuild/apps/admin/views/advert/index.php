<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title' => '数据列表',
    'aOpt' => [
        [
            'title' => ' 添加',
            'icon_class' => 'glyphicon glyphicon-plus',
            //这里定义的任何属性都会加到元素里面
            'data-open' => Url::to(['advert/add']),
        ],
        [
            'title' => '批量禁用',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['advert/update']),
            'data-value' => 1,
            'data-update' => '',
            'data-field' => 'status'
        ],
        [
            'title' => ' 批量启用',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['advert/update']),
            'data-value' => 0,
            'data-update' => '',
            'data-field' => 'status'
        ],
        [
            'title' => ' 批量删除',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['advert/del']),
            'data-update' => '',
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['advert/index']),
        'aFieldList' => [
            [
                'name' => 'title',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '广告标题',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'content',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '广告内容',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'link',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '广告链接',
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
                'name' => 'download_link',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '下载链接',
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
                'name' => 'start_start_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '开始时间',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'end_start_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '到:开始时间',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'start_end_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '结束时间',
                'pclass' => 'col-xs-2',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'end_end_time',
                'type' => 'laydate',
                'format' => 'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '到:结束时间',
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
                    'data' => [['--广告状态--', ''],['启用', 0],['禁用', 1]],
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
            'title' => [
                'title' => '广告标题',
                'class' => 'text-center',
            ],
            'app_id' => [
                'title' => '所属游戏',
                'class' => 'text-center',
                "content"=>function($aData){
                    $aList = \admin\controllers\AdvertController::getAppList();
                    $tag = '';
                    foreach($aList as $aItem){
                        if($aItem[1] == $aData['app_id']){
                            $tag = $aItem[0];
                            break;
                        }
                    }
                    return $tag;
                }
            ],
            'img' => [
                'title' => '图片',
                'class' => 'text-center',
                "content"=>function($aData){
                    return '<img data-tips-image="" class="list-table-image" width="100px" src="'. $aData['img'] .'">';
                }
            ],
            'link' => [
                'title' => '广告链接',
                'class' => 'text-center',
            ],           
            'download_link' => [
                'title' => '下载链接',
                'class' => 'text-center',
            ],
            'create_time' => [
                'title' => '创建时间',
                'class' => 'text-center',
                "content" => function($aData) {
                    return isset($aData['create_time']) ? date("Y-m-d H:i:s", $aData['create_time']) : "未知";
                }
            ],
            'start_time' => [
                'title' => '开始时间',
                'class' => 'text-center',
                "content" => function($aData) {
                    return isset($aData['start_time']) ? date("Y-m-d H:i:s", $aData['start_time']) : "未知";
                }
            ],
            'end_time' => [
                'title' => '结束时间',
                'class' => 'text-center',
                "content" => function($aData) {
                    return isset($aData['end_time']) ? date("Y-m-d H:i:s", $aData['end_time']) : "未知";
                }
            ],
            'status' => [
                'title' => '状态',
                'class' => 'text-center',
                "content" => function($aData) {
                    if($aData['status'] == 0){
                        return '<span style="color:#090">启用</span>';
                    }
                    if($aData['status'] == 1){
                        return '<span style="color:red">禁用</span>';
                    }
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '';
                    $statusTag = '<a data-field="status" data-value="3" data-update="' . $aData['id'] . '" data-action="' . Url::to(['advert/update']) . '" href="javascript:void(0)">禁用</a>';
                    if (isset($aData['status']) && $aData['status'] != 0) {
                        $statusTag = '<a data-field="status" data-value="0" data-update="' . $aData['id'] . '" data-action="' . Url::to(['advert/update']) . '" href="javascript:void(0)">启用</a>';
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-value="' . $aData['id'] . '" data-open="' . Url::to(['advert/editor', 'id' => $aData['id']]) . '" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    ' . $statusTag . '
                    <span class="text-explode">|</span>
                    <a data-action="' . Url::to(['advert/del']) . '" data-update="' . $aData['id'] . '" href="javascript:void(0)">删除</a>';
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
