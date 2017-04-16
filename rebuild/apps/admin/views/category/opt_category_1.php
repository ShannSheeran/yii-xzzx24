<?php

use bases\lib\Url;
?>
<style type="text/css">
        .ftitle{
                font-size:14px;
                font-weight:bold;
                padding:5px 0;
                margin-bottom:10px;
                border-bottom:1px solid #ccc;
        }
        .fitem{
                margin-bottom:5px;
        }
        .fitem label{
                display:inline-block;
                width:80px;
        }
        .fitem input{
            width:200px;
        }
</style>
<div class="easyui-panel" style="width:100%;padding:10px;height: 90%" buttons="#dlg-buttons">
    <div style="margin-left: auto;margin-right: auto;">
        <div class="ftitle">添加分类信息</div>
        <form class="J-CategoryFrom">
            <input name="id" type="hidden" value="0">
            <div class="fitem">
                <label>名 称:</label>
                <input name="name" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>父 级:</label>
                <input class="easyui-combotree" name="pid" value="0" data-options="url:'<?php echo Url::to(['category/get-combobox-list']) ?>',method:'get',required:true">
            </div>
             <div class="fitem">
                <label>排序:</label>
                <input name="sort_order" value="50" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>关键字:</label>
                <input name="keywords" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>描 述:</label>
                <input class="easyui-textbox" name="desc" data-options="multiline:true"  style="width:300px;height:100px">
            </div>
           
            <div class="fitem">
                <label>图片:</label>
                <input name="img" class="easyui-textbox">
            </div>
        </form>
    </div>	
</div>
<div id="dlg-buttons" style="margin-top: 10px; margin-left: 10px;">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok"  style="width:90px" onclick="btnAction()">保存</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" style="width:90px">Cancel</a>
</div>

<script>
    var url = "<?php echo Url::to(['category/add-category']);?>";
    <?php if(isset($aData) && $aData){?>
        $('.J-CategoryFrom').form('load',<?php echo \yii\helpers\Json::encode($aData);?>);
            url = "<?php echo Url::to(['category/editor-category']);?>";
    <?php }?>
    function btnAction(){
        ajaxForm($('.J-CategoryFrom'),url,function(aResult){
                if (aResult.status == 1) {
                     windowsClose();
                    $('#J-showCategoryList').datagrid('reload');
                }
            });
    }
</script>

