<?php

use bases\lib\Url;
use common\model\Configuration;
?>

<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>微信接口对接 <font color="red" style="font-size:14px;">(微信配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/wechat-save']); ?>" class='form-horizontal' style='padding-top:20px'>

<!--                        <div class='form-group'>
                            <label class="col-sm-2 control-label">URL (服务器地址)</label>
                            <div class='col-sm-6' style="margin-bottom:0">
                                <div class="well">
                                    <div class="input-group">
                                        <p class='form-control input-sm'>http://xzzx24.dev/index.php/api.html</p>
                                        <span class="input-group-addon pointer" data-tips-text="复制" data-copy="http://xzzx24.dev/index.php/api.html"><i class="fa fa-copy"></i></span>
                                    </div>
                                    <p class="help-block" style='margin-bottom:10px'>注意：接口链接的域名必需要备案，分别支持80端口和443端口，建议使用80端口。</p>
                                </div>
                            </div>
                            <div class='col-sm-3'>
                                <input onchange="$(this).next().attr('src', this.value)" type="hidden" value="http://static.cdn.cuci.cc/2016/0923/ada6b0039f246d16e6f788f1e35876fa.jpg" name="qrc_img" />
                                <img style="width:112px;height:auto;" data-tips-image  src='http://static.cdn.cuci.cc/2016/0923/ada6b0039f246d16e6f788f1e35876fa.jpg' />
                                <a data-file data-one="true" data-type="image" data-field="qrc_img" class='btn btn-link'>上传二维码</a>
                                <p class="help-block" style='margin-bottom:10px'>建议上传图片的尺寸为430x430px。</p>
                            </div>
                        </div>-->
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">APPID (应用ID)</label>
                            <div class='col-sm-9'>
                                <input placeholder="请输入公众号APPID（必填）" required title='请输入公众号APPID' name='appid'class='form-control input-sm' value='<?php echo $mWechat->appid; ?>' />
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">AppSecret (应用密钥)</label>
                            <div class='col-sm-9'>
                                <input placeholder="请输入公众号AppSecret（必填）" required title='请输入公众号AppSecret' name='appsecret'class='form-control input-sm' value='<?php echo $mWechat->appsecret; ?>' />
                            </div>
                        </div>
<!--                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">Token (令牌)</label>
                            <div class='col-sm-9'>
                                <input placeholder="请输入接口认证TOKEN（必填）" required title='请输入认证TOKEN' name='token'class='form-control input-sm' value='<?php echo $mWechat->token; ?>'/>
                                <div class="help-block">必须为英文或数字，长度为3-32字符。</div>
                            </div>
                        </div> 
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">EncodingAESKey <br/>(消息加解密密钥)</label>
                            <div class='col-sm-9'>
                                <input placeholder="开启了消息加密时必需填写（可选）" title='请输入43位消息加密密钥' pattern="^.{43}$" maxlength='43' name='encodingaeskey'class='form-control input-sm'value='<?php echo $mWechat->encodingaeskey; ?>' />
                                <div class="help-block">消息加密密钥由43位字符组成，可随机修改，字符范围为A-Z，a-z，0-9。</div>
                            </div>
                        </div> -->
                        <div class="hr-line-dashed"></div>
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



