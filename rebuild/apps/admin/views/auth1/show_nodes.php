<?php 
use bases\lib\Url;
?>
<div class="J-nodesList"></div>
<div id="opendWindows"></div>
<script>
   var $dom = $('.J-nodesList');
    $(function(){
       $dom.treegrid({
            url:'<?php echo Url::to(['auth/get-node-list-json']); ?>',
            idField:'id',
            treeField:'text',
            lines: true,
            height:600,
            queryParams: { 
                _csrf: $('meta[name="csrf-token"]').attr('content') 
            },
            columns:[[
                {title:'节点名称',field:'text',heigth:100},
                {title:'标示',field:'name'},
                {title:'操作',field:'opt',width:180, align: 'center',
                    //自定义操作方法
                    formatter: function (value, rec) {
                        var btn = '<a class="addNodeC op_button" onclick="addNodes(' + rec.id + ')" href="javascript:void(0)"></a>';
                        return btn;
                    }
                }
            ]],onLoadSuccess: function (data) {
                //美化按钮
                $('.addNodeC').linkbutton({text: '添加子节点', iconCls: 'icon-add'});
            },toolbar: [{
                    text: '添加节点',
                    iconCls: 'icon-add',
                    plain: true,
                    handler: function (e) {
                        createWindow("<?php echo Url::to(['auth/add-nodes']); ?>", '添加节点', {width: 550, height: 450});
                    }
                },
                {
                    text: '编辑节点',
                    iconCls: 'icon-edit',
                    plain: true,
                    handler: function (e) {
                        var row = $dom.treegrid('getSelected');
                        if(!row){
                            UBox.show('请先选择要编辑的列',-1);
                            return;
                        }
                        createWindow("<?php echo Url::to(['auth/editor-nodes']); ?>?id=" + row.id, '编辑节点',  {width: 550, height: 450});
                    }
                },
            {
                text: '删除',
                iconCls: 'icon-no',
                plain: true,
                handler: function (e) {
                    var row = $dom.treegrid('getSelected');
                    if(!row){
                        UBox.show('请先选择要编辑的列',-1);
                        return;
                    }
                    del(row.id,row.text);
                }
            }
            ]
        });
    });
    
    function del(id,title) {
        $.messager.confirm("确认", '确定要删除id为<br />(&nbsp;<b style="color:red">'+ title + '&nbsp;</b>)<br />确定删除?', function (r) {
            if (r) {
                ajax({
                    url:'<?php echo Url::to(['auth/del-nodes']); ?>',
                    data:{id: id},
                    success:function(result){
                        UBox.show(result.msg,result.status);
                        if(result.status == 1){
                           $dom.treegrid('reload'); 
                        }
                    }
                });
            }
        });
    }
    
    function addNodes(pid){
        createWindow("<?php echo Url::to(['auth/add-nodes']); ?>?pid=" + pid, '添加子节点',  {width: 550, height: 450});
    }
</script>
