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
            'data-open' => Url::to(['{__URL_NAME__}/add']),
        ],
        [
            'title' => '批量操作',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['{__URL_NAME__}/upate']),
            'data-value' => 1,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量操作',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['{__URL_NAME__}/upate']),
            'data-value' => 0,
            'data-update' => '',
            'data-field'=>'status'
        ],
        [
            'title' => ' 批量删除',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['{__URL_NAME__}/del']),
            'data-update' => '',
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['{__URL_NAME__}/index']),
        'aFieldList' => [
            {__SEARCH_FIELD_INPUT__}
        ]
    ],
    'aColumns' => [
        'fBuildRowId' => function($aRowData) {
            return $aRowData['id'];
        },
        'isCheckBox' => true,
        'aColumnsList' => [
            {__TH_FIELD_NAME__}
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="1" data-update="' . $aData['id'] . '" data-action="' . Url::to(['{__URL_NAME__}/upate']) . '" href="javascript:void(0)">操作</a>';
                    if (isset($aData['status']) && $aData['status']) {
                        $statusTag = '<a data-field="status" data-value="0" data-update="' . $aData['id'] . '" data-action="' . Url::to(['{__URL_NAME__}/upate']) . '" href="javascript:void(0)">启用</a>';
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-value="' . $aData['id'] . '" data-open="' . Url::to(['{__URL_NAME__}/editor', 'id' => $aData['id']]) . '" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    ' . $statusTag . '
                    <span class="text-explode">|</span>
                    <a data-action="' . Url::to(['{__URL_NAME__}/del']) . '" data-update="' . $aData['id'] . '" href="javascript:void(0)">删除</a>';
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
