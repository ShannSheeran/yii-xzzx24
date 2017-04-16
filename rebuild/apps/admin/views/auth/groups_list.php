<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title'=> '系统权限',
    'aOpt'=>[
        [
            'title' => ' 添加权限',
            'icon_class' => 'glyphicon glyphicon-plus',
            //这里定义的任何属性都会加到元素里面
            'data-add-role' => '',
        ],
        [
            'title' => '批量禁用权限',
            'icon_class' => 'glyphicon glyphicon-eye-close',
            'data-action' => Url::to(['auth/role-forbid']),
            'data-value' => 0,
            'data-update' => '',
        ],
        [
            'title' => ' 批量启用权限',
            'icon_class' => 'glyphicon glyphicon-eye-open',
            'data-action' => Url::to(['auth/role-forbid']),
            'data-value' => 1,
            'data-update' => '',
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
                'title' => '角色名称',
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
                    return  $aData['status'] == 1 ? '<span style="color:#090">使用中</span>' : '<span style="color:red">已禁用</span>';
                }
            ],
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '<a data-field="status" data-value="0" data-update="'. $aData['id'] .'" data-action="'. Url::to(['auth/role-forbid']) .'" href="javascript:void(0)">禁用</a>';
                    if($aData['status'] == 0){
                        $statusTag = '<a data-field="status" data-value="1" data-update="'. $aData['id'] .'" data-action="'. Url::to(['auth/role-forbid']) .'" href="javascript:void(0)">启用</a>';  
                    }
                    return '<span class="text-explode">|</span>
                    <a class="getedit" data-url="'. Url::to(['auth/role-editor']) .'" data-value="'. $aData['title'] .'" data-edit-role="'. $aData['id'] .'" data-edit-role href="javascript:void(0)">编辑</a>
                    <span class="text-explode">|</span>
                    '. $statusTag .'
                    <span class="text-explode">|</span>
                    <a  data-open="'. Url::to(['auth/access-nodes','id'=>$aData['id']]) .'"  href="javascript:void(0)">授权</a>';
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