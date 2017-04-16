<?php 
use bases\lib\Url;
$this->setTitle('修改密码');
?>

        
     <style>html,body{min-width:500px!important;overflow:hidden}</style>
    <div class="framework-container layer-main-container" data-location="<?php echo Url::to(['manager/change-password']) ?>">
        <div class="wrapper" style="width:780px!important;min-width:780px!important">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>修改密码</h5>
                        </div>
                        <div class="ibox-content fadeInUp animated" style="padding-top:90px;padding-left: 100px">
                            <form onsubmit="return false;" data-callback='logincallback' data-auto role="form" method="POST" action="<?php echo Url::to(['manager/change-password']) ?>" class="form-horizontal">
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">新密码</label>
                                    <div class="col-sm-7">
                                        <input autocomplete="off" name="password" type="password" required="" pattern="^.{6,16}$" title="密码为6~16位的字符" class="form-control validate-error">
                                    </div>
                                </div>
                                <div class="hr-line-dashed" style="width:510px;"></div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">确认密码</label>
                                    <div class="col-sm-7">
                                        <input autocomplete="off" name="check_password" type="password" required="" pattern="^.{6,16}$" title="密码为6~16位的字符" class="form-control validate-error">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-sm-11 text-center">
                                            <button type="submit" class="btn btn-primary navbar-btn">保存数据</button>
                                            <button onclick="parent.layer.close(parent.layer.getFrameIndex(window.name))" type="button" class="btn btn-warning navbar-btn">取消返回</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>

        window.logincallback = function (ret, res) {
            console.log(ret, res);
            if (ret.status == 1) {
                top.window.location.href = ret.referer;
            }
            return true;
        };
    </script>
