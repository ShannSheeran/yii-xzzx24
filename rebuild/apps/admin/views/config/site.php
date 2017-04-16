<?php

use bases\lib\Url;
use common\model\Configuration;

?>

<div class="wrapper">
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox">
                <div class="ibox-title">
                    <h5>网站配置 <font color="red" style="font-size:14px;">(系统配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/save']);?>" class='form-horizontal' style='padding-top:20px'>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">网站名称</label>
                            <div class="col-sm-8">
                                <input type='text' required  title="网站名称不能为空" name='site_name' value='<?php echo Configuration::getConfigValue('site_name'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">网站域名</label>
                            <div class="col-sm-8">
                                <input type='text' required  title="网站域名不能为空" name='site_domain' value='<?php echo Configuration::getConfigValue('site_domain'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">公司名称</label>
                            <div class="col-sm-8">
                                <input type='text' required  title="请输入公司名称" name='site_company' value='<?php echo Configuration::getConfigValue('site_company'); ?>' class="form-control input-sm">
                            </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">百度统计ID</label>
                            <div class="col-sm-8">
                                <input type='text'  title="" name='site_tongji_baidu' value='<?php echo Configuration::getConfigValue('site_tongji_baidu'); ?>' class="form-control input-sm">
                                <p class="help-block m-b-none">帮助统计网页访问情况，可以去<a target="_blank" href="http://tongji.baidu.com">百度统计</a>获取ID。</p> </div>
                        </div>

                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">CNZZ统计ID</label>
                            <div class="col-sm-8">
                                <input type='text'  title="" name='site_tongji_cnzz' value='<?php echo Configuration::getConfigValue('site_tongji_cnzz'); ?>' class="form-control input-sm">
                                <p class="help-block m-b-none">帮助统计网页访问情况，可以去<a target="_blank" href="https://tongji.cnzz.com">流量统计</a>获取ID。</p> </div>
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

