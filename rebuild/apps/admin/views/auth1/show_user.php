<?php 
use bases\lib\Url;
?>
<div class="main-content" id="J-ShowUserList"></div>
<div id="opendWindows"></div>
<script>
<?php $this->beginBlock('JS_END'); ?>
    $(function () {
        var $dom = $('#J-ShowUserList');
        $dom.datagrid({
            url: '<?php echo Url::to(['auth/get-user-list']); ?>',
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            loadMsg: '一大波数据正向你袭来,请稍后......',
            queryParams: { 
                _csrf: $('meta[name="csrf-token"]').attr('content') 
            },
            columns: [[
                    {field: 'ck', checkbox: true},
                    {field: 'id', title: 'ID',width:100},
                    {field: 'name',width:150, title: '用户名'},
                    {field: 'status',width:150, title: '状态',formatter:function(value,aData){
                         if(value == undefined){
                             return;
                         }
                         return value == 0 ? '<b style="color:green">正常</b>' : '<b style="color:red">禁用</b>';
                        }
                    },
                    {field: 'group',width:150, title: '所属分组',formatter:function(value,aData){
                        if(value == undefined){
                            return;
                        }
                        var aGroupName = [];
                        if(value.length > 0){
                            for (var item in value) {
                                aGroupName.push(value[item]);
                            }
                            return aGroupName.join('-');
                        }
                        return '无';
                    }}
                ]],
            onLoadSuccess: function (data) {
                if (data.rows.length == 0) {
                    ShowTips.show('抱歉找不到数据。。',-1);
                    var body = $(this).data().datagrid.dc.body2;
                    body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 25px; text-align: center;">实在抱歉系统检索不到数据。。。</td></tr>');
                }
            }, toolbar: [{
                    text: '添加用户',
                    iconCls: 'icon-add',
                    plain: true,
                    handler: function (e) {
                        createWindow("<?php echo Url::to(['auth/add-user']); ?>", '添加', {width: 550, height: 550});
                    }
                },
                {
                    text: '编辑用户',
                    iconCls: 'icon-edit',
                    plain: true,
                    handler: function (e) {
                        var row = $dom.datagrid('getSelected');
                        if(!row){
                            UBox.show('请先选择要编辑的列',-1);
                            return;
                        }
                        createWindow("<?php echo Url::to(['auth/editor-user']); ?>?id=" + row.id, '编辑',  {width: 550, height: 450});
                    }
                },
            {
                text: '删除',
                iconCls: 'icon-no',
                plain: true,
                handler: function (e) {
                    var row = $dom.datagrid('getSelected');
                    if(!row){
                        UBox.show('请先选择要编辑的列',-1);
                        return;
                    }
                    delAdminUser(row.id);
                }
            }
            ]
        });
        var p = $dom.datagrid('getPager');
        p.pagination({
            beforePageText: '第',
            afterPageText: '页共 {pages} 页',
            displayMsg: '当前显示 {from}- {to} 条记录共 {total} 条记录',
        });
    });
    function delAdminUser(id) {
        if(id == 1){
           UBox.show('该用户禁止操作',0);return; 
        }
        $.messager.confirm("确认", '确定要删除id为<br />(&nbsp;<b style="color:red">' + id + '&nbsp;</b>)<br />确定删除?', function (r) {
            if (r) {
                ajax({
                    url:'<?php echo Url::to(['auth/del-user']); ?>',
                    data:{id: id},
                    success:function(result){
                        UBox.show(result.msg,result.status);
                        if(result.status == 1){
                           $('#J-ShowUserList').datagrid('reload'); 
                        }
                    }
                });
            }
        });
    }
    <?php
$this->endBlock();
$this->registerJs($this->blocks['JS_END'], \yii\web\view::POS_END);
?>
</script>
