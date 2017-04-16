<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            编辑节点
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-EditorNodesForm" method="post" style="margin-left:60px;">
                <input name="id" type="hidden"/>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">唯一标示</label>
                    <div class="col-xs-9">
                        <input type="text"  name="name" class="col-xs-10 easyui-validatebox" placeholder="唯一标示" data-options="required:true,missingMessage:'唯一标示不能为空'">
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">节点名称</label>
                    <div class="col-xs-9">
                        <input type="text"  name="title" class="col-xs-10 easyui-validatebox" placeholder="节点名称" data-options="required:true,missingMessage:'节点名称不能为空'">
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">状态</label>
                    <div class="col-xs-9">
                        <label >正常</label> 
                        <input type="radio"  name="status" value="1"/>
                        <label >禁用</label> 
                        <input type="radio"  name="status" value="0"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">所属分组</label>
                    <div class="col-xs-9">
                        <input name='pid' class="J-combotree" style="width: 280px;"/>
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
         $('.J-combotree').combotree({
            url: '<?php echo Url::to(['auth/get-node-list-json']); ?>',
            method:'post',
            queryParams:{
                _csrf: $('meta[name="csrf-token"]').attr('content')
            },
            required:true,
        });
        $('.J-EditorNodesForm').form('load',<?php echo yii\helpers\Json::encode($aData)?>);
        $('.J-groupqr').click(function () {
            ajaxForm($('.J-EditorNodesForm'),'<?php echo Url::to(['auth/editor-nodes']); ?>',function(aResult){
                if (aResult.status == 1) {
                    windowsClose();
                    $('.J-nodesList').treegrid('reload');
                }
            });
        });
    });
</script>