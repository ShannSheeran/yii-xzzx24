<?php

use bases\lib\Url;
use common\model\Configuration;
?>
<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>邮件服务 <font color="red" style="font-size:14px;">(系统配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/save']);?>" class='form-horizontal' style='padding-top:20px'>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">邮件发送人</label>
                            <div class="col-sm-8">
                                <input type='text' required  title="请输入正确的发送人邮箱" name='mail_from_name' value='<?php echo Configuration::getConfigValue('mail_from_name'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">回复收信邮箱</label>
                            <div class="col-sm-8">
                                <input type='text'  required pattern="^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$" title="请输入正确的邮箱地址" name='mail_reply' value='<?php echo Configuration::getConfigValue('mail_reply'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">SMTP发信邮箱</label>
                            <div class="col-sm-8">
                                <input type='text'  required pattern="^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$" title="请输入正确的邮箱地址" name='mail_from' value='<?php echo Configuration::getConfigValue('mail_from'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">SMTP服务器</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="" name='mail_smtp' value='<?php echo Configuration::getConfigValue('mail_smtp'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">SMTP端口号</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="" name='mail_port' value='<?php echo Configuration::getConfigValue('mail_port'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">SMTP帐号</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="" name='mail_username' value='<?php echo Configuration::getConfigValue('mail_username'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">SMTP密码</label>
                            <div class="col-sm-8">
                                <input type='password'  required title="" name='mail_password' value='<?php echo Configuration::getConfigValue('mail_password'); ?>' class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>



                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">保存修改</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>




</div>


