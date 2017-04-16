define("app/member/index", ["jQuery", 'Tips', 'app/common/Request', 'app/common/Ui', 'app/common/load_more'], function (require, exports, module) {

    var $ = require("jQuery");
    var Request = require("app/common/Request");
    var Ui = require("app/common/Ui");
    var Tips = require('Tips');//弹框插件
    var oIndex = {
        load: function () {
            Request.ajax({
                url: _aConfig.memberUrl,
                data: _aConfig.data,
                success: function (data) {
                    $("#realname").text(data.data.user_name);
                    if (data.data.avatar != "") {
                        $("#avatar").attr("src", App.url.resource + data.data.avatar);
                    }
                    if (data.data.title != "") {
                        $("#agent_title").text(data.data.title);
                    }
                    if (data.data.flag == 1 && _aConfig.isShare) {
                        $('.J-share').css('display', 'block');
                    }
                }
            });
        },
        getOrderStatus: function () {
            Request.ajax({
                url: _aConfig.memberUrl,
                data: _aConfig.dataGetOrder,
                success: function (data) {
                    console.log(data);
                    if (data.data.wait_pay) {
                        $('.J-waitPay').after('<b>' + data.data.wait_pay + '</b>');
                    }
                    if (data.data.wait_send) {
                        $('.J-waitSend').after('<b>' + data.data.wait_send + '</b>');
                    }
                    if (data.data.wait_confirm) {
                        $('.J-waitConfirm').after('<b>' + data.data.wait_confirm + '</b>');
                    }
                    if (data.data.finish) {
                        $('.J-finish').after('<b>' + data.data.finish + '</b>');
                    }
                    if (data.data.after_sale) {
                        $('.J-afterSale').after('<b>' + data.data.after_sale + '</b>');
                    }

                }
            });
        },
        getUserInfo: function () {
            Request.ajax({
                url: _aConfig.memberUrl,
                data: _aConfig.data,
                success: function (data) {
                    $("#user_name").val(data.data.user_name);
                    $("#real_name").val(data.data.real_name);
                    if (data.data.sex) {
                        if (data.data.sex == 1) {
                            $("#sex2").val('男');
                        } else if (data.data.sex == 2) {
                            $("#sex2").val('女');
                        } else {
                            $("#sex2").val('未知');
                        }
                    }
                    $("#sex").val(data.data.sex);
                    $("#mobile").val(data.data.mobile);
                    $("#email").val(data.data.email);
                    $("#alipay").val(data.data.alipay);
                    if (data.data.avatar != "") {
                        $("#headImg").attr("src", App.url.resource + data.data.avatar);
                        $('.J-avatar').val(data.data.avatar);
                    } else {
                        $("#headImg").attr("src", App.url.resource + '/static/h5/head_error.png');
                    }
                }
            });
        },
        bindEvent: function () {
            $('.J-registerEvent').click(function () {
                var $this = $(this);
                Request.ajaxSend($('.J-edit'), {
                    url: _aConfig.memberUrl,
                    data: _aConfig.updateData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            return Tips.showTips('修改个人资料成功', 3, function () {
                                location.href = _aConfig.indexUrl;
                            });
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                }, $this);
            });
            $('.J-submitLogin').click(function () {
                var $this = $(this);
                Request.ajaxSend($('.J-loginEdit'), {
                    url: _aConfig.loginUrl,
                    data: _aConfig.loginData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            return Tips.showTips('登录成功', 3, function (url) {
                                location.href = url;
                            }, aData.data.url);
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                }, $this);
            });
            $('.J-registerSubmit').click(function () {
                var $this = $(this);
                var pwdFirst = $('#password').val();
                var pwdSecond = $('#password2').val();
                if (pwdFirst != pwdSecond) {
                    return Tips.showTips('两次输入的密码不相同，请重新输入！', 2);
                }
                Request.ajaxSend($('.J-registerEdit'), {
                    url: _aConfig.registerUrl,
                    success: function (aData) {
                        if (aData.status == 1) {
                            return Tips.showTips(aData.msg, 2, function () {
                                location.href = aData.data.jumpUrl;
                            });
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                }, $this);
            });
            $('.J-sendCode').click(function () {
                var mobile = $('.J-isRegister').val();
                var aSendData = _aConfig.sendCodeData;
                aSendData.mobile = mobile;
                Request.ajax({
                    url: _aConfig.apiUrl,
                    data: aSendData,
                    success: function (aData) {
                        if (aData.status == 1) {
                            Tips.showTips(aData.msg, 2);
                            return $('.J-sendCode').html('已发送');
                        }
                        return Tips.showTips(aData.msg, 3);
                    }
                });
            });
            var $imgInput = $('#imgInput'), canvas = document.getElementById('mycanvas'), $popup = $('.popup-headimg'), $headImg = $('#headImg');
            $imgInput.change(function () {
                if (!this.value)
                    return;
                lrz(this.files[0], {
                    width: 350,
                    quality: .3
                }).then(function (rst) {
                    $popup.css("display", "block");
                    setTimeout(function () {
                        $popup.addClass("div_down").removeClass("div_up");
                    }, 0);
                    new ImgTouchCanvas({
                        canvas: canvas,
                        path: rst.base64,
                        desktop: false
                    });
                });
            });
            var closePop = function () {
                $popup.addClass("div_up").removeClass("div_down");
                setTimeout(function () {
                    $popup.css("display", "none");
                }, 400);
            };
            $('#cancel').click(closePop);
            $('#complete').click(function () {
                var src = canvas.toDataURL(), index;
                if (!src)
                    return;
                ajax({
                    url: _aConfig.avatarUrl,
                    type: 'post',
                    data: {avatar: src},
                    beforeSend: function () {
                        index = app.msg.loading('头像上传中');
                    },
                    complete: function () {
                        app.msg.loadingClose(index);
                    },
                    success: function (d) {
                        if (d.status === 1) {
                            $headImg.attr('src', src);
                            $('#avatar').val(d.data);
                            closePop();
                            //app.msg.success(d.info);
                        } else {
                            app.msg.error(d.info);
                        }
                    },
                    error: function () {
                        app.msg.error('服务器错误：' + arguments[1]);
                    }
                });
            });

            //性别弹出
            $("#sexs").click(function () {
                $(".picture_bg").show();
                $("#picture").addClass("sex_up").removeClass("sex_down");
            })
            $(".popover_li,.picture_bg").click(function () {
                $("#picture").addClass("sex_down").removeClass("sex_up");
                setTimeout(function () {
                    $(".picture_bg").hide();
                }, 200);
            });


        },
        bindDefaultLogin: function (mobile, password, venderId) {

        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        },
    }
    var _aConfig = {
        memberUrl: '',
        data: '',
        updateData: '',
        avatarUrl: '',
        loginUrl: '',
        loginData: '',
        indexUrl: '',
        apiUrl: '',
        registerUrl: '',
        sendCodeData: '',
        dataGetOrder: '',
        isShare: ''
    };
    var self = oIndex;
    module.exports = oIndex;
})

