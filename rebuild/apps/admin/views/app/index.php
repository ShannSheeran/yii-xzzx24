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
            'data-open' => Url::to(['app/add']),
        ],
        [
            'title' => '批量禁用',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['app/update']),
            'data-value' => 1,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量启用',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['app/update']),
            'data-value' => 0,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量删除',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['app/del']),
            'data-update' => '',
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['app/index']),
        'aFieldList' => [
            [
                'name' => 'name',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => 'app名',
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
            'name' => [
                'class' => 'text-center',
                'title' => 'app名称',
            ],
            'type' => [
                'class' => 'text-center',
                'title' => 'app类型',
                'content' => function($aData) {
                    return ($aData['type'] == 0 ? '自有游戏'  : '合作游戏') ;
                },
            ],
            'comission' => [
                'class' => 'text-center',
                'title' => '佣金比例',
                'content' => function($aData) {
                    return $aData['comission'] .'%';
                },
            ],
            'create_time' => [
                'class' => 'text-center',
                'title' => '创建时间',
                'content' => function($aData) {
                    return date('Y-m-d H:i:s', $aData['create_time']);
                },
            ],
            'status' => [
                'title' => '状态',
                'content' => function($aData) {
                    return $aData['status'] == 0 ? '<span style="color:#090">使用中</span>' : '<span style="color:red">已禁用</span>';
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="1" data-update="' . $aData['id'] . '" data-action="' . Url::to(['app/update']) . '" href="javascript:void(0)">禁用</a>';
                    if ($aData['status']) {
                        $statusTag = '<a data-field="status" data-value="0" data-update="' . $aData['id'] . '" data-action="' . Url::to(['app/update']) . '" href="javascript:void(0)">启用</a>';
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-value="' . $aData['id'] . '" data-open="' . Url::to(['app/editor', 'id' => $aData['id']]) . '" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    ' . $statusTag . '
                    <span class="text-explode">|</span>
                    <a data-action="' . Url::to(['app/del']) . '" data-update="' . $aData['id'] . '" href="javascript:void(0)">删除</a>';
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
