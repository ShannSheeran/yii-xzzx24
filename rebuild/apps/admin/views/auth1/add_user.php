<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            添加用户
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-addUserForm" method="post" style="margin-left:60px;">
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">用户名</label>
                    <div class="col-xs-9">
                        <input type="text"  name="name" class="col-xs-10 easyui-validatebox" placeholder="用户名" data-options="required:true,missingMessage:'用户名不能为空'">
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">密码</label>
                    <div class="col-xs-9">
                        <input type="password"  name="password" id="password" validType="length[4,32]" required="true" class="col-xs-10 easyui-validatebox" placeholder="密码" data-options="required:true,missingMessage:'密码不能为空'"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">确认密码</label>
                    <div class="col-xs-9">
                        <input type="password"  name="repassword" class="col-xs-10 easyui-validatebox" placeholder="确认密码" validType="equalTo['#password']" invalidMessage="两次输入密码不匹配"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">是否禁用</label>
                    <div class="col-xs-9">
                        <label >正常</label> 
                        <input type="radio"  name="status" value="0" checked="checked" />
                        <label >禁用</label> 
                        <input type="radio"  name="status" value="1"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">所属分组</label>
                    <div class="col-xs-9">
                        <select required="true" name="group_id" class="easyui-combotree" data-options="url:'<?php echo Url::to(['auth/get-group-list']); ?>',method:'get'" multiple style="width:200px;"></select>
                    </div>
                </div>
                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <a class="btn btn-info J-queren2">
                            <i class="icon-ok bigger-110"></i>
                            添加
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
    $(function () {
        $('.J-queren2').click(function () {
            ajaxForm($('.J-addUserForm'),'<?php echo Url::to(['auth/add-user']); ?>',function(aResult){
               
                if (aResult.status == 1) {
                     windowsClose();
                    $('#J-ShowUserList').datagrid('reload');
                }
            });
        });
        $.extend($.fn.validatebox.defaults.rules, {
            equalTo: { validator: function (value, param) { return $(param[0]).val() == value; }, message: '字段不匹配' }
        });
    });
</script>
