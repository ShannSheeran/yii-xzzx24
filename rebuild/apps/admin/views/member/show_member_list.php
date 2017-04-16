<?php

use bases\lib\Url;
$this->title = '用户列表';
$this->registerAssetBundle('common\assets\AjaxUploadAsset');
?>
<style>
    .validatebox-text{
        color: #000;
    }    
</style>
<div class="div_form container-fluid">
    <div class="row">
        <form id="J-seachFromMemberList">
            <div class="col-lg-3 col-md-3 div_input">
                <label for="user_name">用户名:</label>
                <input class="easyui-validatebox" type="text" name="user_name" />
            </div>
            <div class="col-lg-3 col-md-3 div_input">
                <label for="mobile">手机号:</label>
                <input class="easyui-validatebox" type="text" name="mobile" />
            </div>
            <div class="col-lg-3 col-md-3 div_input">
                <label >邮箱:</label>
                <input class="easyui-validatebox" type="text" name="email"/>
            </div>
            <div class="col-lg-3 col-md-3 div_input">
                <label for="title">身份:</label>
                <input class="easyui-combobox" name="title"  data-options="url:'<?php echo Url::to(['agent/get-combobox-list']) ?>',method:'get',valueField:'id',textField:'text'">
            </div>
        </form>
            <div class="col-lg-12 col-md-12 div_querybtn">
                    <a href="javascript:searchDataGrid($('#J-showMemberList'),$('#J-seachFromMemberList'));" class="easyui-linkbutton" iconCls="icon-search">查询</a>
                    <a href="javascript:;" class="easyui-linkbutton" iconCls="icon-cancel" onclick="reset()">重置</a>                    
            </div>
    </div>
</div>
<div class="main-content" id="J-showMemberList"></div>
<div id="opendWindows"></div>
<script type="text/javascript">
$(function () {
    var $dom = $('#J-showMemberList');
    createDataGrid($dom,{
        url:'<?php echo Url::to(['member/get-member-list']) ?>',
        view: detailview,
        detailFormatter:function(index,row){
            return '<div class="ddv"></div>';
        },
        onExpandRow: function(index,row){
            var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv');
            ddv.panel({
                border:false,
                cache:true,
                href:'<?php echo Url::to(['member/show-member-detail']) ?>?id='+row.id,
                onLoad:function(){
                    $dom.datagrid('fixDetailRowHeight',index);
                    $dom.datagrid('selectRow',index);
                    $dom.datagrid('getRowDetail',index).find('form').form('load',row);
                }
            });
            $dom.datagrid('fixDetailRowHeight',index);
        },
        columns: [[
                {field: 'ck', checkbox: true},
                {field: 'id', title: 'ID'},
                {field: 'user_name',title: '用户名称',editor:{type:'textbox'}},
                {field: 'mobile',title: '手机号',editor:{type:'textbox'}},
                {field: 'password', title: '密码'},
                {field: 'email',title: '邮箱'},
                {field: 'money',title: '用户金额'},
                {field: 'score',  title: '用户积分'},
                {field: 'agent_level',  title: '身份'},
                {field: 'parent_name', title: '上级用户'},
                {field: 'create_time',  title: '添加时间',
                    formatter: function (index, aData) {
                        if (aData.create_time != undefined) {
                            return Ui.date('Y-m-d H:i:s', aData.create_time);
                        }
                    }
                },
                {field: 'update_time',  title: '修改时间',
                    formatter: function (index, aData) {
                        if (aData.update_time != undefined) {
                            return Ui.date('Y-m-d H:i:s', aData.update_time);
                        }
                    }
                }
            ]],
        toolbar: [
            {
                text: '编辑',
                iconCls: 'icon-edit',
                plain: true,
                handler: function (e) {
                    return editorDataGridRowById($dom, '编辑', "<?php echo Url::to(['member/editor-member']); ?>", {width: 1000, height: 700});
                }
            },
            {
                text: '删除',
                iconCls: 'icon-no',
                plain: true,
                handler: function (e) {
                    return delDataGridRowById($dom, "<?php echo Url::to(['member/delete']) ?>",undefined,function(aData){
                         UBox.show(aData.msg, aData.status);
                            if(aData.status == 1){
                                $dom.treegrid('reload');
                            }
                    });
                }
            }
        ]

    });
});
    function reset(){
        document.getElementById("J-seachFromMemberList").reset(); 
    }
    
</script>
