<?php

use bases\lib\Url;
use common\model\Configuration;
?>

<div class="wrapper">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>文件存储 <font color="red" style="font-size:14px;">(系统配置，请勿随意更改!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="<?php echo Url::to(['config/save']);?>" class='form-horizontal' style='padding-top:20px'>


                        <div class="form-group">
                            <label class="col-sm-2 control-label">Storage(存储)</label>
                            <div class="col-sm-8">
                                <select  required name='file_storage' class='form-control input-sm'>
                                    <option <?php  if(Configuration::getConfigValue('file_storage') == 'local'){ echo 'selected'; } ?>  value='local'>本地服务器</option>
                                    <option <?php  if(Configuration::getConfigValue('file_storage') == 'qiniu'){ echo 'selected'; } ?>  value='qiniu'>七牛云存储</option>
                                </select>
                                <p data-storage-type='qiniu' class="help-block m-b-none hide">如果还没有帐号，请点击<a target="_blank" href="https://portal.qiniu.com/signup?code=3lhz6nmnwbple">免费申请10G存储空间</a>，申请成功后添加Bucket，并设置为公开空间！</p>
                                <p data-storage-type='local' class="help-block m-b-none hide">文件存储在本地服务器，对服务器网络带宽消耗比较大，建议使用云存储！</p>
                                <script>
                                    $("[name='file_storage']").on('change', function () {
                                        var type = $(this).val();
                                        $('[data-storage-type]').not($('[data-storage-type="' + type + '"]').removeClass('hide')).addClass('hide')
                                    }).trigger('change');
                                </script>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <div class='hide' data-storage-type='qiniu'>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Bucket(空间)</label>
                                <div class="col-sm-8">
                                    <input type='text'  required title="" name='qiniu_bucket' value='<?php echo Configuration::getConfigValue('qiniu_bucket'); ?>' class="form-control input-sm">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label">Domain(域名)</label>
                                <div class="col-sm-8">
                                    <input type='text'  required pattern="^[\w\.\-]{3,}$" title="包含了非法字符，请对照下面给出的例子" name='qiniu_domain' value='<?php echo Configuration::getConfigValue('qiniu_domain'); ?>' class="form-control input-sm">
                                    <p class="help-block m-b-none">只需填写域名，如：static.cdn.cuci.cc</p> </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label">AccessKey(密匙)</label>
                                <div class="col-sm-8">
                                    <input type='text'  required title="" name='qiniu_accesskey' value='<?php echo Configuration::getConfigValue('qiniu_accesskey'); ?>' class="form-control input-sm">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label">SecretKey(密码)</label>
                                <div class="col-sm-8">
                                    <input type='password' required  title="" name='qiniu_secretkey' value='<?php echo Configuration::getConfigValue('qiniu_secretkey'); ?>' class="form-control input-sm">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>
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

