<?php

use bases\lib\Url;
use common\model\Configuration;
?>
<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>后台配置 <font color="red" style="font-size:14px;">(系统配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/save']);?>" class='form-horizontal' style='padding-top:20px'>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">后台标题</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="程序名不能为空" name='app_name' value='<?php echo Configuration::getConfigValue('app_name'); ?>' class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">后台版本</label>
                            <div class="col-sm-8">
                                <input type='text'  required title="程序版本号不能为空" name='app_version' value='<?php echo Configuration::getConfigValue('app_version'); ?>' class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">LOGO</label>
                            <div class="col-sm-8">
                                <img data-tips-image style="height:auto;max-height:32px;min-width:32px" data-field="site_logo" src='<?php echo Configuration::getConfigValue('site_logo'); ?>' />
                                <a class='btn btn-link' data-file data-one="true" data-type="ico,png" data-field="site_logo">上传图片</a>
                                <input onchange="$(this).prevAll('img').attr('src', this.value || 'http://localhost/basic/static/plugs/uploader/theme/image.png')" class='form-control input-sm' type="hidden" required title="程序LOGO样式不能为空" name='site_logo' value='http://static.cdn.cuci.cc/2016/1215/7338153edcfdca771b9b6fa6f2216105.png'/>
                                <p class="help-block m-b-none">建议LOGO图片的尺寸为160x56px，此LOGO图片用于后台登陆页面。</p> 
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">标签图标</label>
                            <div class="col-sm-8">
                                <img data-tips-image style="height:auto;max-height:32px;min-width:32px" data-field="app_logo" src='<?php echo Configuration::getConfigValue('app_logo'); ?>' />
                                <a class='btn btn-link' data-file data-one="true" data-type="image" data-field="app_logo">上传图片</a>
                                <input onchange="$(this).prevAll('img').attr('src', this.value || 'http://localhost/basic/static/plugs/uploader/theme/image.png')" class='form-control input-sm' type="hidden" required title="请上传网站图标文件" name='app_logo' value='http://static.cdn.cuci.cc/2016/1215/1366a6251688db5ed645383a5dbbaee6.png'/>
                                <p class="help-block m-b-none">建议上传ICO图标的尺寸为128x128px，此图标用于网站标题前，<a href="http://www.favicon-icon-generator.com/" target="_blank">ICON在线制作</a>。</p> 
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

