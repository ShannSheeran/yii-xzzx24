<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title'=> '权限管理',
    'aOpt'=>[
        [
            'title' => '添加权限',
            'icon_class' => 'glyphicon glyphicon-plus',
            'data-modal' => Url::to(['auth/add-nodes']),
        ],
        [
            'title' => '批量删除菜单',
            'icon_class' => 'glyphicon glyphicon-remove',
            'data-action' => Url::to(['auth/del-nodes']),
            'data-update'=>'',
        ],
    ],
    'aColumns' =>[
        'fBuildRowId'=>function($aRowData){
            return $aRowData['id'];
        },
        'isCheckBox'=>true,
        'aColumnsList' => [
            'title' => [
                'class'=>'text-center',
                'title' => '权限名称',
                'content'=>function($aData){
                    return $aData['html'].''.$aData['title'];
                },
            ],
            'name' => [
                'title' => '链接',
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-modal="'. Url::to(['auth/editor-nodes','id'=>$aData['id']]) .'" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    <a data-field="delete" data-action="'. Url::to(['auth/del-nodes']) .'" data-update="'. $aData['id'] .'" href="javascript:void(0)">删除</a>';
                }
            ],
        ],
    ],
    'aDataList' => $aDataList,
    'oPage'=>$oPage,
]);
?>