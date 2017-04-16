<?php

use bases\lib\Url;

$this->setTitle('管理员登录');
$this->registerCssFile('@r.css.layui.login');
?>
<style>
    html{height:100%}
    .fadeInRight{font-size:14px !important;margin-top: 10px;margin-right: 5px;color:#CDDC39 !important}
</style>
<div class="box top">
    <div class="top-title">
        <p class="p-bottom">颠覆传统自媒体广告投放收费模式<br>为有效触达付费 </p>
    </div>
    <!-- 用户登陆 -->
    <div class="login">
        <p class="login-title">用户登录</p>
        <form onsubmit="return false;" data-callback='logincallback' data-time="0.01" data-auto role="form" action="<?php echo Url::to(['login/manager-login']) ?>" method="POST">
            <input type="text" name="account" class="username input form-control" autofocus="true" autocomplete="off"  title="请输入用户帐号" required  placeholder="手机号 / 账号">
            <input type="password"  name="password"   autocomplete="off" class="password input form-control" placeholder="密码" title="请输入登录密码" required>
            <div class="verify-label ">
                <img data-tips-text='刷新验证码' class='pointer l J-checkCodeImg' style="width:69px;height:34px;float:right" src="<?php echo Url::to(['login/captcha']); ?>"/>
                <input maxlength='4' autocomplete="off" class="form-control r" style="width:198px;color:black" name="code" placeholder="请输入验证码" title="请输入验证码"  type="text" />
            </div>
            <input type="submit" class="input btn" value="登&nbsp;&nbsp;&nbsp;陆">
            <div class="login-bottom">
<!--                <div class="col-3"><input type="checkbox" id="check" name='autoLogin' class="check-box"><label for="check"></label><label for="check">自动登陆</label></div>
                <div class="register col-3"><a href="http://xzzx24.dev/index.php/admin-register.html">免费注册</a></div>
                <div class="forget col-3"><a href="http://xzzx24.dev/index.php/admin-register-password.html">忘记密码？</a></div>-->
            </div>
        </form>
    </div>
</div>
<!--脚部版权信息-->
<div class="footer">
    <p>广州市海珠区琶洲大道东2-8号广州国际采购中心1013</p>
    <p>粤ICP备16022825号-2   版权所有@广州怒沧山文化传播有限公司</p><br>
</div>
<div class="hide">
    <script>
        $(".J-checkCodeImg").click(function () {
            $.get('/captcha.png?refresh=1&t=' + $.now(), function (res) {
                $(".J-checkCodeImg").attr('src', res.url);
            });
        });

        window.login_error_num = parseInt('0');
        window.logincallback = function (ret, res) {
            if (ret.status !== 1) {
                $(".J-checkCodeImg").click();
                window.login_error_num += 1;
                if (window.login_error_num >= 3) {
                    $('.verify-label').removeClass('hide');
                }
            }
        };
    </script>
</div>