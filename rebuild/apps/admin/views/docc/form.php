<?php 
use yii\helpers\Url;
    
?>
<div class="wrapper">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5><?php echo Yii::$app->request->get('id',0) ? '编辑' : '添加'; ?></h5>
                </div>
                <div class="ibox-content fadeInUp animated">

                    <form onsubmit="return false;" data-callback='_optCallBack' data-auto action="<?php echo Yii::$app->request->url;?>" class='form-horizontal' style='padding-top:20px'>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">hhhhhhhh</label>
                            <div class='col-sm-8'>
                                <input required placeholder="hhhhhhhh" title="hhhhhhhh" invalid_msg="hhhhhhhh" name="phone" value='<?php echo isset($aData['phone']) ? $aData['phone'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            <div class="form-group">
                            <label class="col-sm-2 control-label">msg</label>
                            <div class='col-sm-8'>
                                <input required placeholder="msg" title="msg" invalid_msg="msg" name="msg" value='<?php echo isset($aData['msg']) ? $aData['msg'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            <div class="form-group">
                            <label class="col-sm-2 control-label">create_time</label>
                            <div class='col-sm-8'>
                                <input required placeholder="create_time" title="create_time" invalid_msg="create_time" name="create_time" value='<?php echo isset($aData['create_time']) ? $aData['create_time'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            <div class="form-group">
                            <label class="col-sm-2 control-label">0 成功 1 失败</label>
                            <div class='col-sm-8'>
                                <input required placeholder="0 成功 1 失败" title="0 成功 1 失败" invalid_msg="0 成功 1 失败" name="status" value='<?php echo isset($aData['status']) ? $aData['status'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            <div class="form-group">
                            <label class="col-sm-2 control-label">0失败提醒重新提交资料1 更新提醒</label>
                            <div class='col-sm-8'>
                                <input required placeholder="0失败提醒重新提交资料1 更新提醒" title="0失败提醒重新提交资料1 更新提醒" invalid_msg="0失败提醒重新提交资料1 更新提醒" name="type" value='<?php echo isset($aData['type']) ? $aData['type'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
            
                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">保存数据</button>
                                    <button data-back type="button" class="btn btn-warning navbar-btn">&nbsp&nbsp&nbsp返&nbsp回&nbsp&nbsp&nbsp</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>

</div>
<script>
    _optCallBack = function (ret, res) {
        if (ret.status !== 1) {
            
        }
        return true;
    };
    $(function(){
        $('input[name="icon"]').change();
    })
</script>

