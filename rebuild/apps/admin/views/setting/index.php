<?php

use admin\widgets\Table;
use bases\lib\Url;

echo Table::widget([
    'title' => '数据列表',
    'aOpt' => [
    ],
    'aSearch' => [
        'action' => Url::to(['setting/index']),
        'aFieldList' => [
            [
                'name' => 'code',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '机构代码',
                'pclass' => 'col-xs-3',
                'class' => 'input-sm form-control',
            ],
            [
                'name' => 'name',
                'type' => 'text',
                'field_type' => 'input',
                'value' => '',
                'placeholder' => '机构名称',
                'pclass' => 'col-xs-3',
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
                    'data' => [['--本系统覆盖佣金设置--', ''],['默认小主系统', 0],['本系统覆盖', 1]],
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
            'id' => [
                'title' => '编号',
                'class' => 'text-center',
            ],            
            'code' => [
                'title' => '机构代码',
                'class' => 'text-center',
            ],
            'name' => [
                'title' => '名称',
                'class' => 'text-center',
            ],
            'commision_rate' => [
                'title' => '小主平台佣金比例',
                'class' => 'text-center',
                'content' => function($aData){
                    return $aData['commision_rate'] . '%';
                }
            ],
            'commision_rate1' => [
                'title' => '分发平台佣金比例',
                'class' => 'text-center',
                'content' => function($aData){
                    return '<input name="commission" value="'. $aData['x_commission'] .'">%';
                }
            ],                 
            'operation' => [
                'title' => '操作',
                'content' => function($aData) {
                    $statusTag = '';
                    $statusTag = '<a class="J-save" data-id="' . $aData['id'] . '"  href="javascript:void(0)">保存</a>';
                    return '<span class="text-explode">|</span>
                    ' . $statusTag . '
                    <span class="text-explode">|</span>
                    <a href="javascript:void(0)" class="J-revert" data-old="'. $aData['x_commission'] .'">撤销</a>';
                }
                    ],
                ],
            ],
            'aDataList' => $aDataList,
            'oPage' => $oPage,
        ]);
?>
<script>
$('input[name="commission"]').blur(function(){    
    var $this = $(this);
    var val = $this.val();
    if(!val){
        return;
    }
    if(!/^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/.test(val)){
        $this.focus();
        $.msg.tips('请填写正确的百分比');
        return;
    }
    if(val > 90){
        $this.focus();
        $.msg.tips('佣金比例不能超过90%');
        return;
    }
});

$('.J-save').click(function(){
    var val = $(this).closest('tr').find('input[name="commission"]').val();
    var id = $(this).data('id');
    if(!val){
        $(this).closest('tr').find('input[name="commission"]').focus();
        return $.msg.tips('请先设置佣金比例');
    }
    $.msg.confirm('确定要设置该公会佣金', function(){
        var url = '<?php echo Url::to(['setting/set-org-commission']);?>';
        $.form.load(url, {field: 'commission', value: val, id: id}, 'POST');
    });
    
});
$('.J-revert').click(function(){
    var oldVal = $(this).data('old');
    if(!oldVal){
        oldVal = '';
    }
    $(this).closest('tr').find('input[name="commission"]').val(oldVal);
});
</script>