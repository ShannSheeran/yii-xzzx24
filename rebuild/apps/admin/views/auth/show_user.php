<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title'=> '系统权限',
    'aOpt'=>[
        [
            'title' => ' 添加用户',
            'icon_class' => 'glyphicon glyphicon-plus',
            //这里定义的任何属性都会加到元素里面
            'data-open' => Url::to(['auth/add-user']),
        ],
        [
            'title' => '批量禁用权限',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['auth/user-forbid']),
            'data-value' => 1,
            'data-update' => '',
        ],
        [
            'title' => ' 批量启用权限',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['auth/user-forbid']),
            'data-value' => 0,
            'data-update' => '',
        ],
        [
            'title' => ' 批量删除',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['auth/del-user']),
            'data-update' => '',
        ],
    ],
    'aSearch' => [
        'action' => Url::to(['auth/show-user']),
        'aFieldList'=>  [
            [
                'name' => 'name',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '用户名',
                'pclass' => 'col-xs-3',
                'class'=>'input-sm form-control',
            ],
            [
                'name' => 'user_name',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '账号名',
                'pclass' => 'col-xs-3',
                'class'=>'input-sm form-control',
            ],
            [
                'name' => 'mobile',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '手机',
                'pclass' => 'col-xs-3',
                'class'=>'input-sm form-control',
            ],
            [
                'name' => 'email',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => 'E-mail',
                'pclass' => 'col-xs-3',
                'class'=>'input-sm form-control',
            ],
        ]
    ],
    'aColumns' =>[
        'fBuildRowId'=>function($aRowData){
            return $aRowData['id'];
        },
        'isCheckBox'=>true,
        'aColumnsList' => [
            'user_name' => [
                'class'=>'text-center',
                'title' => '账号',
            ],
            'name' => [
                'class'=>'text-center',
                'title' => '用户名',
            ],
            'group' => [
                'class'=>'text-center',
                'title' => '所属角色',
                'content'=>function($aData){
                    return implode('、', $aData['group']);
                },
            ],
            'remark' => [
                'class'=>'text-center',
                'title' => '备注',
            ],
            'email' => [
                'class'=>'text-center',
                'title' => 'E-mail',
            ],
            'mobile' => [
                'class'=>'text-center',
                'title' => 'mobile',
            ],
            'create_time' => [
                'class'=>'text-center',
                'title' => '创建时间',
                'content'=>function($aData){
                    return date('Y-m-d H:i:s',$aData['create_time']);
                },
            ],
            'status' => [
                'title' => '状态',
                'content' => function($aData) {
                    return  $aData['status'] == 0 ? '<span style="color:#090">使用中</span>' : '<span style="color:red">已禁用</span>';
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="1" data-update="'. $aData['id'] .'" data-action="'. Url::to(['auth/user-forbid']) .'" href="javascript:void(0)">禁用</a>';
                    if($aData['status']){
                        $statusTag = '<a data-field="status" data-value="0" data-update="'. $aData['id'] .'" data-action="'. Url::to(['auth/user-forbid']) .'" href="javascript:void(0)">启用</a>';  
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-value="'. $aData['id'] .'" data-open="'. Url::to(['auth/editor-user','id'=>$aData['id']]) .'" href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    '. $statusTag .'
                    <span class="text-explode">|</span>
                    <a data-action="'. Url::to(['auth/del-user']) .'" data-update="'. $aData['id'] .'" href="javascript:void(0)">删除</a>';
                }
            ],
        ],
    ],
    'aDataList' => $aDataList,
    'oPage'=>$oPage,
]);
?>

<script>
    $(function() {
        $('[data-add-role]').on('click', function() {
            layer.prompt({
                title: '请输入角色名'
            }, function(name,index) {
                if (name.length >= 1) {
                    $.msg.loading();
                    layer.close(index);
                    $.form.load('<?php echo Url::to(["auth/add-role"])?>', {name: name}, 'POST');
                }
            });
        });
        $('[data-edit-role]').on('click', function() {
            var self = this;
            layer.prompt({
                value: self.getAttribute('data-value'),
                title: '请输入角色名称'
            }, function(name,index) {
                if (name === self.getAttribute('data-value')) {
                    $.msg.tips('内容没有发生改变！');
                } else if (name.length >= 1) {
                    layer.close(index);
                    $.msg.loading();
                    $.form.load('<?php echo Url::to(['auth/role-editor']);?>', {id: self.getAttribute('data-edit-role'), name: name}, 'POST');
                } else {
                    return $.msg.tips('请输入角色名称！'), false;
                }
            });
        });
    });
</script>