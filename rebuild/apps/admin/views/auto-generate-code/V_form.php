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
                        {__OPT_FIELD__}
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

