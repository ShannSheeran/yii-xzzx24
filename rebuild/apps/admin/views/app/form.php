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
                        <style>
                        .share{
                            margin-top: 7px;
                        }
                        .orgniz{
                            position: relative;
                            min-height: 1px;
                            padding-right: 15px;
                            padding-left: 15px;
                            float: left;
                            width:84%;
                        }
                        .red{
                            color: red;
                        }
                        .split {border-bottom: 1px #787939 dotted;padding: 2px 0;margin: 20px;color: #008B8B;font-size: 14px;font-weight: 500;}
                        .color_8b {margin-bottom: 10px;}
                        .required {color: #ff6666;position: absolute;margin: 2px auto auto 4px;}
                        .help-block{color: #b3b3b3;}
                        #edui1_iframeholder{height: 150px !important;}

                        .req:after{content: '*';
                                   color: red;
                                   position: absolute;
                                   margin-left: 4px;
                                   font-weight: bold;
                                   line-height: 1.8em;}
                        </style>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">app名称</label>
                            <div class='col-sm-8'>
                                <input required maxlength="80" title="请输入app名称" invalid_msg="名称" name="name" value='<?php echo isset($aData['name']) ? $aData['name'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">签名</label>
                            <div class='col-sm-8'>
                                <input required title="请输入app签名" invalid_msg="签名" name="code" value='<?php echo isset($aData['code']) ? $aData['code'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>         
                         <div class="hr-line-dashed"></div>
                        <div class="form-group kol">
                            <div style="">
                                <label class="col-sm-2 control-label req">网红性别</label>
                                <div class="col-sm-10 share" style="margin-left:-13px;">
                                    <div class="col-xs-2" style="margin-left: 12px;">
                                        <div class="form-group">
                                            <input type="radio" name="type" class="list-check-box sexarr" 
                                                <?php 
                                                    if(isset($aData['type'])){  
                                                        if(!$aData['type']){
                                                            echo 'checked="checked"';
                                                        }                                                        
                                                    } 
                                                    ?>
                                             value="0" data-name="自有游戏"> 自有游戏
                                        </div> 
                                    </div>
                                    <div class="col-xs-2" style="margin-left: -15px;">
                                        <div class="form-group">
                                            <input type="radio" name="type" class="list-check-box sexarr"
                                                   <?php 
                                                    if(isset($aData['type'])){  
                                                        if($aData['type']){
                                                            echo 'checked="checked"';
                                                        }                                                        
                                                    } 
                                                    ?>
                                                value="1" data-name="合作游戏"> 合作游戏 
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">佣金比例</label>
                            <div class='col-sm-8'>
                                <input required title="请输入佣金比例" invalid_msg="佣金比例" name="comission" value='<?php echo isset($aData['comission']) ? $aData['comission'] : ''; ?>' type="text" class="form-control input-sm">
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

