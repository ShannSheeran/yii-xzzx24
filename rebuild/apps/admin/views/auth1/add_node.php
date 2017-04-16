<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            添加节点
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-AddNodesFrom" method="post" style="margin-left:60px;">
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
                        <input type="radio"  name="status" checked="checked" value="1"/>
                        <label >禁用</label> 
                        <input type="radio"  name="status" value="0"/>
                    </div>
                </div>
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">所属分组</label>
                    <div class="col-xs-9">
                        <input name='pid' style="width: 280px;" class="J-combotree" value='<?php echo $pid;?>'/>
                    </div>
                </div>
                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <a class="btn btn-info J-groupqr">
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
        $('.J-combotree').combotree({
            url: '<?php echo Url::to(['auth/get-node-list-json']); ?>',
            method:'post',
            queryParams:{
                _csrf: $('meta[name="csrf-token"]').attr('content')
            },
            required:true,
        });
        $('.J-groupqr').click(function () {
            ajaxForm($('.J-AddNodesFrom'),'<?php echo Url::to(['auth/add-nodes']); ?>',function(aResult){
                if (aResult.status == 1) {
                    windowsClose();
                    $('.J-nodesList').treegrid('reload');
                }
            });
        });
    });
</script>

