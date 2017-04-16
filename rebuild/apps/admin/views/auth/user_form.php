<div class="wrapper">


    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>新增用户  <font color="red" style="font-size:14px;">(该功能仅能添加管理员!)</font></h5>
                </div>
                <div class="ibox-content fadeInUp animated">


                    <form onsubmit="return false;" data-auto method="POST" action="" class='form-horizontal' style='padding-top:20px'>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">账号名</label>
                            <div class="col-sm-8">
                                <input required title="用户名为4~16位的数字或字母组合" name="user_name" maxlength='16' pattern="^[a-zA-Z0-9@]{4,16}$"  type="text" value="<?php echo isset($aUserInfo['user_name']) ? $aUserInfo['user_name'] : ''; ?>" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">用户名</label>
                            <div class="col-sm-8">
                                <input required name="name" maxlength='16' value="<?php echo isset($aUserInfo['name']) ? $aUserInfo['name'] : ''; ?>" type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label label-required">所属角色</label>
                            <div class='col-sm-8'>
                                <div class=" checkbox form-control well" style="height:100px;overflow:auto">
                                    <?php 
                                    foreach($aGourpList as $aGroup){?>
                                    <label style="margin-right:10px">
                                        <input  data-auto-none name="role_ids[]" <?php if(isset($aUserGroups) && in_array($aGroup['id'], $aUserGroups)){ echo 'checked=checked'; } ?> value="<?php echo $aGroup['id'];?>" type="checkbox"/> <?php echo $aGroup['title'];?>
                                    </label>
                                    <?php }?>

                                </div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-8 col-sm-offset-2">
                                <a onclick="check()" href="javascript:void(0)">点击修改登陆密码</a>
                            </label>
                        </div>
                        <div id="checkpw" style="display:none">
                            <div class="form-group">
                                <label class="col-sm-2 control-label" disabled="disabled">登陆密码</label>
                                <div class='col-sm-8'>
                                    <input autocomplete="off" disabled="disabled" name="password" type="password" maxlength="16" required pattern="^.{6,16}$" title="密码为6~16位的字符" class="form-control input-sm">
                                </div>
                            </div> 
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">确认密码</label>
                                <div class='col-sm-8'>
                                    <input id="cpw" onblur="myFunction(this);" disabled="disabled" required maxlength="16" pattern="^.{6,16}$" name="check_password" class="form-control input-sm" type="password" >
                                    <span id="checktt" style="animation-duration: 0.2s; padding-right: 20px; color: rgb(169, 68, 66); position: absolute; right: 0px; font-size: 12px; z-index: 2; display: block; width: auto; text-align: center; pointer-events: none; top: 0px; padding-top: 6px; padding-bottom: 6px; line-height: 14px;" class="fadeInRight animated"></span>
                                </div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">手机号码</label>
                            <div class='col-sm-8'>
                                <input name="mobile" value="<?php echo isset($aUserInfo['mobile']) ? $aUserInfo['mobile'] : ''; ?>" pattern="^1\d{10}$" maxlength='11' title="请输入正确的手机号码" type="tel"  class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">E-mail</label>
                            <div class='col-sm-8'>
                                <input name="email" maxlength="20" value="<?php echo isset($aUserInfo['email']) ? $aUserInfo['email'] : ''; ?>" pattern="^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$" title='请输入邮箱地址' type="email"  class="form-control input-sm">
                            </div>
                        </div>


                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">保存数据</button>
                                    <button data-back type="button" class="btn btn-warning navbar-btn">&nbsp&nbsp&nbsp返&nbsp回&nbsp&nbsp&nbsp</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>



    <script>
        /*前段确认密码校验*/
        function myFunction(obj) {
            $(obj).parent().find('#checktt').empty();
            var pwval = $(obj).parent().parent().prev().prev().find('input').val();
            var ckval = $(obj).val();
            if (ckval.length < 5) {
                $(obj).parent().find('#checktt').empty();
                $(obj).parent().find('#checktt').append("<font class='tishi' >密码为6~16位的字符<font>");
                return;
            }
            if (pwval !== ckval) {
                $(obj).parent().find('#checktt').empty();
                $(obj).parent().find('#checktt').append("<font class='tishi' >两次密码输入不一致<font>")
            }
        }
        /*选择是否修改密码*/
        function check() {
            if ($('#checkpw').hasClass('ckpw')) {
                $('input[name="password"]').attr({disabled: "disabled"});
                $('input[name="check_password"]').attr({disabled: "disabled"});
                $('#checkpw').css({display: "none"}).removeClass('ckpw');
            } else {
                $('input[name="password"]').removeAttr("disabled");
                $('input[name="check_password"]').removeAttr("disabled");
                $('#checkpw').css({display: "block"}).addClass('ckpw');
            }
        }
        function checkParam() {
            if ($('#checkpw').hasClass('ckpw')) {
                $('input[name="password"]').attr({disabled: "disabled"});
                $('input[name="check_password"]').attr({disabled: "disabled"});
                $('#checkpw').css({display: "none"}).removeClass('ckpw');
            }
        }
        /*每次进来检测是添加还是修改操作*/
        if (!<?php echo (int) Yii::$app->request->get('id', 0) ?>) {
            check();
        }
    </script>

</div>

