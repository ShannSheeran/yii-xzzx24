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
            'data-open' => Url::to(['docc/add']),
        ],
        [
            'title' => '批量操作',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['docc/upate']),
            'data-value' => 1,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量操作',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['docc/upate']),
            'data-value' => 0,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量删除',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['docc/del']),
            'data-update' => '',
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['docc/index']),
        'aFieldList' => [
            [
                'name'=>'phone',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => 'hhhhhhhh',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name'=>'msg',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => 'msg',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name'=>'create_time',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => 'create_time',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name'=>'status',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '0 成功 1 失败',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name'=>'type',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '0失败提醒重新提交资料1 更新提醒',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            
        ]
    ],
    'aColumns' => [
        'fBuildRowId' => function($aRowData) {
            return $aRowData['id'];
        },
        'isCheckBox' => true,
        'aColumnsList' => [
            'phone' => [
                'title'=>'hhhhhhhh',
                'class' => 'text-center',
            ],
            'msg' => [
                'title'=>'msg',
                'class' => 'text-center',
            ],
            'create_time' => [
                'title'=>'create_time',
                'class' => 'text-center',
            ],
            'status' => [
                'title'=>'0 成功 1 失败',
                'class' => 'text-center',
            ],
            'type' => [
                'title'=>'0失败提醒重新提交资料1 更新提醒',
                'class' => 'text-center',
            ],
            
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="1" data-update="' . $aData['id'] . '" data-action="' . Url::to(['docc/upate']) . '" href="javascript:void(0)">操作</a>';
                    if (isset($aData['status']) && $aData['status']) {
                        $statusTag = '<a data-field="status" data-value="0" data-update="' . $aData['id'] . '" data-action="' . Url::to(['docc/upate']) . '" href="javascript:void(0)">启用</a>';
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-value="' . $aData['id'] . '" data-open="' . Url::to(['docc/editor', 'id' => $aData['id']]) . '" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    ' . $statusTag . '
                    <span class="text-explode">|</span>
                    <a data-action="' . Url::to(['docc/del']) . '" data-update="' . $aData['id'] . '" href="javascript:void(0)">删除</a>';
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
