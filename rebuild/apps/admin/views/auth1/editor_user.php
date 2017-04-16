<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            修改用户
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-EditorUserForm" method="post" style="margin-left:60px;">
                <input name="id" type="hidden"/>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">用户名</label>
                    <div class="col-xs-9">
                        <input type="text"  name="name" class="col-xs-10 easyui-validatebox" placeholder="用户名" data-options="required:true,missingMessage:'用户名不能为空'">
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">是否禁用</label>
                    <div class="col-xs-9">
                        <label >正常</label> 
                        <input type="radio"  name="status" value="0" />
                        <label >禁用</label> 
                        <input type="radio"  name="status" value="1"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">所属分组</label>
                    <div class="col-xs-9">
                        <select name="group_id" required="true" class="easyui-combotree" data-options="url:'<?php echo Url::to(['auth/get-group-list','groupsIds' => $aData['group']]); ?>',method:'get'" multiple style="width:200px;"></select>
                    </div>
                </div>
                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <a class="btn btn-info J-queren2">
                            <i class="icon-ok bigger-110"></i>
                            修改
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
    $(function () {
        $('.J-EditorUserForm').form('load',<?php echo yii\helpers\Json::encode($aData)?>);
        $('.J-queren2').click(function () {
            ajaxForm($('.J-EditorUserForm'),'<?php echo Url::to(['auth/editor-user']); ?>',function(aResult){
                if (aResult.status == 1) {
                     windowsClose();
                    $('#J-ShowUserList').datagrid('reload');
                }
            });
        });
    });
</script>
