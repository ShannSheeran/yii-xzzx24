<?php

use admin\widgets\Table;
use yii\helpers\Url;

echo Table::widget([
    'title'=> '广告列表',
    'aOpt'=>[
        [
            'title'=>'批量审核通过',
            'icon_class'=>'glyphicon glyphicon-eye-open',
            //这里定义的任何属性都会加到元素里面
            'data-open'=>  bases\lib\Url::to(['ad/index']),
        ],
        [
            'title'=>'批量审核驳回',
            'icon_class'=>'glyphicon glyphicon-eye-open'
        ],
        [
            'title'=>'批量禁用',

            'icon_class'=>'glyphicon glyphicon-eye-close'
        ],
        [
            'title'=>'批量启用',
            'icon_class'=>'fa  fa-file-excel-o'
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['ad/list']),
        'aFieldList'=>  [
            [
                'name' => 'namedd',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '1',
                'placeholder' => '广告名称',
                'pclass' => 'col-xs-3',
                'class'=>'input-sm form-control',
            ],
            [
                'name' => 'radio',
                'type' => 'other',
                'field_type' => 'input',
                'content'=>'<div class="col-xs-3">
                    <div class="form-control way">
                        <span class="" style="margin-right:5px;">通讯方式</span>
                                            <label for="手机"><input type="checkbox" value="phone" id="手机" class="way_ck"> 手机</label>
                                                <label for="邮箱"><input type="checkbox" value="email" id="邮箱" class="way_ck"> 邮箱</label>

                        <input type="hidden" name="way" value="">
                    </div>
                </div>',
            ],
            [
                //指定去某个类静态方法获取数据
                'name' => 'fff',
                'field_type' => 'select',
                'value' => '',
                'placeholder' => '广告名称',
                'pclass' => 'col-xs-2',
                'class'=>'input-sm form-control',
                'data_provides' => [
                    'class' => '\common\model\ad',
                    'method' => 'getTess',
                    'params' => ['aa'],
                    'options' => [
                        'useEmpty' => true,
                        'emptyText' => '请选择',
                        'emptyValue' => ''
                    ]
                ]
            ],
             [
                'name' => 'create_time_start',
                'type' => 'laydate',
                'format'=>'YYYY-MM-DD hh:mm:ss',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '广告开始时间',
                'pclass' => 'col-xs-2',
                'class'=>'input-sm form-control',
            ],
             [
                'name' => 'create_time_end',
                'type' => 'laydate',
                'field_type' => 'input',
                'format'=>'YYYY-MM-DD',
                'value' => '',
                'placeholder' => '广告结束时间',
                'pclass' => 'col-xs-2',
                'class'=>'input-sm form-control',
            ],
             [
                'name' => 'other',
                'type' => 'other',
                'content'=>function(){
                    return '<div class="col-xs-3"><div class="form-group"><input type="text" class="input-sm form-control" name="eeee" value="" placeholder="广告名称"></div></div>';
                }
            ],
        ]
    ],
    'aColumns' =>[
        'fBuildRowId'=>function($aRowData){
            return $aRowData['id'];
        },
        'isCheckBox'=>true,
        'aColumnsList' => [
            'title' => ['title' => '广告名称'],
            'status' => [
                'title' => '广告状态',
                'content' => function($aData) {
                    $str = '启用';
                    if ($aData == 0) {
                        $str = '禁用';
                    }
                    return $str;
                }
            ],
            'pay_status' => [
                'title' => '付款状态',
                'content' => function($aData) {
                    return '已付款';
                }
            ],
            'send_status' => [
                'title' => '发货状态',
                'content' => function($aData) {
                    return '未发货';
                }
            ],
            'cpc' => [
                'title' => 'cpc',
            ],
            'operation' => [
                'title' => '操作',
                'class' => 'col-sm-1',
                'content' => function($aData) {
                    return '<a href="javascript:;" onclick="showOrder(' . $aData['id'] . ');">查看</a>';
                }
            ],
        ],
    ],
    'aDataList' => $aOrderList,
    'oPage'=>$oPage,
]);
?>