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
                float:left;
                margin-right: 10px;
        }
        .fitem label{
                display:inline-block;
                width:80px;
        }
        .fitem input{
            width:150px;
        }
</style>
    <div style="margin-left:-250px;" class="row">
        <form class="J-DetailFrom-<?php echo $id; ?>">
            <div  class="col-lg-2 col-md-2 div_input">
                <label>微信openid:</label>
                <input name="openid" class="easyui-textbox">
            </div>
            <div class="col-lg-2 col-md-2 div_input">
                <label>性 别:</label>
                <input class="easyui-textbox" name="sex">
            </div>
             <div class="col-lg-2 col-md-2 div_input">
                <label>备 注:</label>
                <input name="remark" class="easyui-textbox">
            </div>
            <div class="col-lg-2 col-md-2 div_input">
                <label>关注时间:</label>
                <input name="subscribe_time" class="easyui-textbox">
            </div>
        </form>
    </div>	


<script>
    var url = "<?php echo Url::to(['member/show-member-detail']);?>";
    <?php if(isset($aData) && $aData){?>
        $('.J-DetailFrom-<?php echo $id; ?>').form('load',<?php echo \yii\helpers\Json::encode($aData);?>);
            url = "<?php echo Url::to(['member/show-member-detail']);?>";
    <?php }?>
</script>

