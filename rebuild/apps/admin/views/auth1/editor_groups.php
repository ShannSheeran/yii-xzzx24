<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            编辑分组
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-EditorGroupsForm" method="post" style="margin-left:60px;">
                <input name="id" type="hidden"/>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">分组名</label>
                    <div class="col-xs-9">
                        <input type="text"  name="title" class="col-xs-10 easyui-validatebox" placeholder="分组名" data-options="required:true,missingMessage:'分组名不能为空'">
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">是否可用</label>
                    <div class="col-xs-9">
                        <label >正常</label> 
                        <input type="radio"  name="status" checked="checked" value="1"/>
                        <label >禁用</label> 
                        <input type="radio"  name="status" value="0"/>
                    </div>
                </div>
                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <a class="btn btn-info J-groupqr">
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
        $('.J-EditorGroupsForm').form('load',<?php echo yii\helpers\Json::encode($aData)?>);
        $('.J-groupqr').click(function () {
            ajaxForm($('.J-EditorGroupsForm'),'<?php echo Url::to(['auth/editor-groups']); ?>',function(aResult){
                if (aResult.status == 1) {
                    windowsClose();
                    $('#J-showGroupsList').datagrid('reload');
                }
            });
        });
    });
</script>

