<?php

use bases\lib\Url;
$this->registerAssetBundle('common\assets\AjaxUploadAsset');
?>
<div class="main-content" id="J-showCategoryList"></div>
<div id="opendWindows"></div>
<script type="text/javascript">
$(function () {
    var $dom = $('#J-showCategoryList');
    createTreeGrid($dom,{
        url:'<?php echo Url::to(['category/get-tree-grid']) ?>',
        columns: [[
                {field: 'ck', checkbox: true},
                {field: 'id', title: 'ID'},
                {field: 'name',title: '分类名称'},
                {field: 'keywords', width: 150, title: '关键字'},
                {field: 'desc', width: 150, title: '描述'},
                {field: 'sort_order', width: 150, title: '排序',editor:{type:'numberbox'}},
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
                },
                {field: 'status', width: 150, title: '状态',
                    formatter: function (index, aData) {
                        if (aData.status == 0) {
                            return '禁用';
                        }else{ 
                            return '正常';
                        }
                    }
                },
                {title:'操作',field:'opt',width:180, align: 'center',
                    //自定义操作方法
                    formatter: function (value, rec) {
                        var btn = '<a class="J-addCategoryChild op_button" onclick="addCategoryChild(' + rec.id + ')" href="javascript:void(0)"></a>';
                        return btn;
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
                    return delDataGridRowById($dom, "<?php echo Url::to(['category/delete']) ?>",undefined,function(aData){
                         UBox.show(aData.msg, aData.status);
                            if(aData.status == 1){
                                $dom.treegrid('reload');
                            }
                    });
                }
            }
        ]
       ,onLoadSuccess: function (data) {
            //美化按钮
            $('.J-addCategoryChild').linkbutton({text: '添加子类', iconCls: 'icon-add'});
        }

    });
});
function addCategoryChild(id){
    return addDataGridRow('添加', "<?php echo Url::to(['category/add-category']); ?>?pid="+id, {width: 700, height: 500});
}
    
    
</script>
