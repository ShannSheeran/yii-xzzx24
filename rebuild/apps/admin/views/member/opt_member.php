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
        <div class="ftitle">修改用户信息</div>
        <form class="J-CategoryFrom">
            <input name="id" type="hidden" value="0">
            <div class="fitem">
                <label>姓 名:</label>
                <input name="user_name" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>电 话:</label>
                <input class="easyui-textbox" name="mobile" required="true,validType:'number'">
            </div>
             <div class="fitem">
                <label>邮 箱:</label>
                <input name="email" class="easyui-textbox" required="true" data-options="required:true,validType:'email'">
            </div>
            <div class="fitem">
                <label>余 额:</label>
                <input name="money" class="easyui-textbox" required="true" data-options="required:true,validType:'number'">
            </div>
            <div class="fitem">
                <label>积 分:</label>
                <input name="score" class="easyui-textbox" data-options="required:true,validType:'number'">
            </div>
            <div class="fitem">
                <label>身 份:</label>
                <input class="easyui-combotree" name="category_name" data-options="url:'<?php echo Url::to(['member/get-combobox-list']) ?>',method:'get',required:true">
            </div>
        </form>
    </div>	
</div>
<div id="dlg-buttons" style="margin-top: 10px; margin-left: 10px;">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok"  style="width:90px" onclick="btnAction()">保存</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" style="width:90px" onclick="cancelAction()">Cancel</a>
</div>

<script>
    var url = "<?php echo Url::to(['agent/add-agent']);?>";
    <?php if(isset($aData) && $aData){?>
        $('.J-CategoryFrom').form('load',<?php echo \yii\helpers\Json::encode($aData);?>);
            url = "<?php echo Url::to(['member/editor-member']);?>";
    <?php }?>
    function btnAction(){
        ajaxForm($('.J-CategoryFrom'),url,function(aResult){
                if (aResult.status == 1) {
                     windowsClose();
                    $('#J-showMemberList').datagrid('reload');
                }
            });
    }
    function cancelAction(){
        windowsClose();
    }
</script>

