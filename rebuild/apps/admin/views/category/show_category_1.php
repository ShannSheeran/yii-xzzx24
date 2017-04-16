<?php

use bases\lib\Url;
?>
<div class="main-content" id="J-showCategoryList"></div>
<div id="opendWindows"></div>
<script type="text/javascript">
    $(function () {
        var $dom = $('#J-showCategoryList');
        createDataGrid($dom, {
            url: '<?php echo Url::to(['category/get-category-list']); ?>',
            oEidtor:{
                isOpen:true,
                //自动让系统提交的url 如果填了这个这save不需要定义
                saveUrl:"<?php echo Url::to(['category/editor-category']); ?>",
                //或者自定义编辑url
                save1:function(aData){
                    ajax({
                            url:"<?php echo Url::to(['category/editor-category']); ?>",
                            data:aData,
                            success:function(aResult){
                                UBox.show(aResult.msg,aResult.status);
                                return $dom.datagrid('reload');
                            }
                        });
                }
            },
            columns: [[
                    {field: 'ck', checkbox: true},
                    {field: 'id', title: 'ID', width: 100},
                    {field: 'name', width: 150, title: '分类名称',editor:'textbox'},
                    {field: 'keywords', width: 150, title: '关键字',editor:'textbox'},
                    {field: 'desc', width: 150, title: '描述',editor:'textbox'},
                    {field: 'sort_order', width: 150, title: '排序',editor:'numberbox'},
                    {field: 'create_time', width: 150, title: '添加时间',
                        formatter: function (index, aData) {
                            if (aData.create_time != undefined) {
                                return Ui.date('Y-m-d H:i:s', aData.create_time);
                            }
                        }
                    },
                    {field: 'update_time', width: 150, title: '修改时间',
                        formatter: function (index, aData) {
                            if (aData.update_time != undefined) {
                                return Ui.date('Y-m-d H:i:s', aData.update_time);
                            }
                        }
                    }
                ]],
            toolbar: [
                {
                    text: '添加',
                    iconCls: 'icon-add',
                    plain: true,
                    handler: function (e) {
                        return addDataGridRow('添加', "<?php echo Url::to(['category/add-category']); ?>", {width: 700, height: 500});
                    }
                },
                {
                    text: '编辑',
                    iconCls: 'icon-edit',
                    plain: true,
                    handler: function (e) {
                        return editorDataGridRowById($dom, '编辑', "<?php echo Url::to(['category/editor-category']); ?>", {width: 700, height: 500});
                    }
                },
                {
                    text: '删除',
                    iconCls: 'icon-no',
                    plain: true,
                    handler: function (e) {
                        return delDataGridRowById($dom, "<?php echo Url::to(['category/delete']) ?>");
                    }
                }
            ],            
        });
    });
    
</script>
