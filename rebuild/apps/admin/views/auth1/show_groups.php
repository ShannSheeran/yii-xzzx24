<?php 
use bases\lib\Url;
?>
<div class="main-content" id="J-showGroupsList"></div>
<div id="opendWindows"></div>
<script type="text/javascript">
    $(function () {
        var $dom = $('#J-showGroupsList');
        $dom.datagrid({
            url: '<?php echo Url::to(['auth/get-groups-list']); ?>',
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            queryParams: { 
                _csrf: $('meta[name="csrf-token"]').attr('content') 
            },
            loadMsg: '一大波数据正向你袭来,请稍后......',
            columns: [[
                    {field: 'ck', checkbox: true},
                    {field: 'id', title: 'ID',width:100},
                    {field: 'title',width:150, title: '分组名'}
                ]],
            onLoadSuccess: function (data) {
                if (data.rows.length == 0) {
                    UBox.show('抱歉找不到数据。。',-1);
                    var body = $(this).data().datagrid.dc.body2;
                    body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 25px; text-align: center;">实在抱歉系统检索不到数据。。。</td></tr>');
                }
            }, toolbar: [{
                    text: '添加分组',
                    iconCls: 'icon-add',
                    plain: true,
                    handler: function (e) {
                        createWindow("<?php echo Url::to(['auth/add-groups']); ?>", '添加分组', {width: 550, height: 350});
                    }
                },
                {
                    text: '编辑分组',
                    iconCls: 'icon-edit',
                    plain: true,
                    handler: function (e) {
                        var row = $dom.datagrid('getSelected');
                        if(!row){
                            UBox.show('请先选择要编辑的列',-1);
                            return;
                        }
                        createWindow("<?php echo Url::to(['auth/editor-groups']); ?>?id=" + row.id, '编辑分组',  {width: 550, height: 350});
                    }
                },
                {
                    text: '授权',
                    iconCls: 'icon-filter',
                    plain: true,
                    handler: function (e) {
                        var row = $dom.datagrid('getSelected');
                        if(!row){
                            UBox.show('请先选择要授权的列',-1);
                            return;
                        }
                        createWindow("<?php echo Url::to(['auth/show-access-list']); ?>?gid=" + row.id, '授权',  {width: 650, height: 350});
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
                    delGroup(row.id);
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
    function delGroup(id) {
        $.messager.confirm("确认", '确定要删除id为<br />(&nbsp;<b style="color:red">' + id + '&nbsp;</b>)<br />确定删除?', function (r) {
            if (r) {
                ajax({
                    url:'<?php echo Url::to(['auth/del-groups']); ?>',
                    data:{id: id},
                    success:function(result){
                        UBox.show(result.msg,result.status);
                        if(result.status == 1){
                           $('#J-showGroupsList').datagrid('reload'); 
                        }
                    }
                });
            }
        });
    }
</script>
