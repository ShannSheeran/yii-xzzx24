<?php

use bases\lib\Url;
use common\model\Configuration;
?>

<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>短信服务 <font color="red" style="font-size:14px;">(系统配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/save']);?>" class='form-horizontal' style='padding-top:20px'>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">短信平台</label>
                            <div class="col-sm-8">
                                <select  required name='sms_dervice' title="" class='form-control input-sm'>
                                    <option <?php  if(Configuration::getConfigValue('sms_dervice') == 'ZT'){ echo 'selected'; } ?> value='ZT'>助通短信</option>
                                    <option <?php  if(Configuration::getConfigValue('sms_dervice') == 'HY'){ echo 'selected'; } ?> value='HY'>互亿短信</option>


                                </select>
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">账号/AppKey</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="" name='sms_username' value='<?php echo Configuration::getConfigValue('sms_username'); ?>' class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">密码/AppSecret</label>
                            <div class="col-sm-8">
                                <input type='password'  required title="" name='sms_password' value='<?php echo Configuration::getConfigValue('sms_password'); ?>' class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">通道ID/模板ID</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="" name='sms_product' value='<?php echo Configuration::getConfigValue('sms_product'); ?>' class="form-control input-sm">
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


