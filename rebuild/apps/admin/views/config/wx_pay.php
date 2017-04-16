<?php

use bases\lib\Url;
use common\model\Configuration;
?>
<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>微信支付配置 <font color="red" style="font-size:14px;">(微信配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/wechat-save']); ?>" class='form-horizontal' style='padding-top:20px'>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">支付公众号APPID</label>
                            <div class='col-sm-9'>
                                <input placeholder="请输入公众号APPID（必填）" required title='请输入公众号APPID' name='mch_appid'class='form-control input-sm' value='<?php echo $mWechat->mch_appid; ?>' />
                                <p class="help-block">支付公众号APPID如果设置与平台接口公众号APPID不一致，那么只能使用扫码支付！</p>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">商户 ID</label>
                            <div class='col-sm-9'>
                                <input type='tel' placeholder="请输入10位商户MCH_ID（必填）" pattern="^\d{10}$" maxlength='10' required title='请输入10位数字商户MCH_ID' name='mch_id'class='form-control input-sm' value='<?php echo $mWechat->mch_id; ?>'/>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">商户密钥</label>
                            <div class='col-sm-9'>
                                <input type='password' placeholder="请输入32位商户密钥（必填）" pattern="^.{32}$" maxlength="32" required title='请输入32位商户密钥' name='partnerkey'class='form-control input-sm' value='<?php echo $mWechat->partnerkey; ?>' />
                            </div>
                        </div> 
<!--                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">支付证书</label>
                            <div class="col-sm-9">
                                <input onchange="$(this).next().html('已选择支付证书 (cert.zip)'), $('[data-pay-test]').remove()" type="hidden" name="cert_zip" value="" />
                                <div class="well" style="width:54%;text-align:center;cursor:pointer" data-file  data-type="file" data-save_path="advert" data-ext="zip" data-field="cert_zip" data-uptype="local" data-one="true">
                                    <span class="fa fa-check-circle-o" style="color:#00B83F;font-size:16px"></span> 已设置支付证书 (cert.zip)
                                </div>
                                <p class="help-block">退款操作时需要上传此证书，在<a href="https://pay.weixin.qq.com" target="_blank">微信支付商户平台</a>下载cert.zip，直接上传即可！</p>
                            </div>
                        </div>-->
                        <!--<div class="hr-line-dashed"></div>-->
                        <!--<input type='hidden' name='id' value='10000'/>-->


                        <div class="form-group">
                            <div class="col-sm-6 col-sm-offset-2 text-center">
                                <button type="submit" class="btn btn-success navbar-btn">保存配置</button>

                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>
</div>


