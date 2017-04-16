<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title'=> '菜单管理',
    'aOpt'=>[
        [
            'title' => '添加菜单',
            'icon_class' => 'glyphicon glyphicon-plus',
            'data-modal' => Url::to(['menu/add']),
        ],
        [
            'title' => '批量删除菜单',
            'icon_class' => 'glyphicon glyphicon-remove',
            'data-action' => Url::to(['menu/del']),
            'data-update'=>'',
        ],
    ],
    'aColumns' =>[
        'fBuildRowId'=>function($aRowData){
            return $aRowData['id'];
        },
        'isCheckBox'=>true,
        'aColumnsList' => [
            'sort' => [
                'title' => '<button>排序</button>',
                'class'=>'list-table-sort-td',
                'content' => function($aData) {
                    return '<input data-none-auto="" name="_'. $aData['id'] .'" value="' .$aData['sort'] . '" class="list-sort-input">';
                },
                'item'=>[
                    'class'=>'list-table-sort-td'
                ],
            ],
            'icon' => [
                'title' => '',
                'class'=>'text-center',
                'content' => function($aData) {
                    return '<i style="font-size:18px" class="'. $aData['icon'] .'"></i>';
                },
                'item'=>[
                    'class'=>'text-center'
                ],
            ],
            'title' => [
                'class'=>'text-center',
                'title' => '菜单名称',
                'content'=>function($aData){
                    return $aData['html'].''.$aData['title'];
                },
            ],
            'url' => [
                'title' => '链接',
                'content' => function($aData) {
                    return $aData['url'] == '#' ? '' : Url::to([$aData['url']]);
                }
            ],
            'status' => [
                'title' => '状态',
                'content' => function($aData) {
                    return  $aData['status'] == 1 ? '<span style="color:#090">使用中</span>' : '<span style="color:red">已禁用</span>';
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="0" data-update="'. $aData['id'] .'" data-action="'. Url::to(['menu/forbid']) .'" href="javascript:void(0)">禁用</a>';
                    if($aData['status'] == 0){
                        $statusTag = '<a data-field="status" data-value="1" data-update="'. $aData['id'] .'" data-action="'. Url::to(['menu/forbid']) .'" href="javascript:void(0)">启用</a>';  
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-modal="'. Url::to(['menu/editor','id'=>$aData['id']]) .'" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    '. $statusTag .'
                    <span class="text-explode">|</span>
                    <a data-field="delete" data-action="'. Url::to(['menu/del']) .'" data-update="'. $aData['id'] .'" href="javascript:void(0)">删除</a>';
                }
            ],
        ],
    ],
    'aDataList' => $aDataList,
    'oPage'=>$oPage,
]);
?>