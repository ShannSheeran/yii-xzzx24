<?php 
use bases\lib\Url;
?>
<div class="page-content col-xs-11">
    <div class="page-header">
        <h1>
            对(<?php echo $aGroups['title']?>)授权
        </h1>
    </div>
    <div class="row">
        <div class="col-xs-12" >
            <form class="form-horizontal J-GroupsForm" method="post" style="margin-left:60px;">
                <input name="group_id" type="hidden" value="<?php echo $aGroups['id']?>" />
                <div class="form-group">
                    <label  class="col-xs-3 control-label no-padding-right">授权</label>
                    <div class="col-xs-9">
                        <input class="J-combotree" name="rules_id" style="width:350px;">
                    </div>
                </div>
                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <a class="btn btn-info J-groupqr">
                            <i class="icon-ok bigger-110"></i>
                            授权
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
                rules:<?php echo yii\helpers\Json::encode(explode(',', $aGroups['rules']))?>,
                _csrf: $('meta[name="csrf-token"]').attr('content')
            },
            required:true,
            multiple:'multiple' 
        });
        $('.J-groupqr').click(function () {
            ajaxForm($('.J-GroupsForm'),'<?php echo Url::to(['auth/groups-access']); ?>',function(aResult){
                if (aResult.status == 1) {
                    windowsClose();
                }
            });
        });
    });
</script>

