/**
 * Created by baoli on 2016/1/28.
 */
var layouthistory;
var lyt_Id = "";//布局唯一ID
var elm_Id = ""; //元素唯一ID
var elm_type = "";//元素类型
var ModuleUrl = "";//自定义链接
var advHtml = '';
var timerSave = 3000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $("#page-content").html();
var currenteditor = null;
var ecid = QueryString('ecid');//获取当前登录的ECID
var TempID = QueryString('TempID');//模板ID
var auth_token = QueryString('auth_token');//获取当前的登录信息
var needReGenerator = false;
var timestamp = ""; //获取当前时间
var shellnlist = [];
$(function () {

    showcomponents();//加载小工具
    removeElm();//加载删除布局、元素
    singletemp();//加载单个模板
    initTextWidget();//加载文本编辑器
    ShowModuleList();//显示模块名称
    DragResponsive();//元素适配
    $(window).resize();
    $("#ecid").val(ecid);
    if ($("#TemplateId").val() == "" || $("#TemplateId").val() == null || $("#TemplateId").val() != TempID) {
        $("#TemplateId").val(TempID);
    }

    //选择对应的功能
    $(".modal-body-mod ol li").click(function () {
        $(".modal-body-mod ol li").removeClass();
        $(this).addClass('hover');
    });

    //鼠标经过改变元素、布局变化
    $(".pm-draggable .pm-mod-md").hover(function () {
        $(this).find('.pm-mod-hd').css('opacity', '1');
    }, function () {
        $(this).find('.pm-mod-hd').css('opacity', '');
    });


    //**********************************************编辑区事件***********************************
    //显示导航菜单资源
    ShowNavMenu();

    //上传资源图片
    $(".pm-item-bdImg .edit").unbind('click').click(function () {
        var pid = $(this).parent().parent().find('.pm-item-uploadImg img').attr('id');
        var resource = $(this).parent().parent().find('.pm-item-uploadImg').attr('data-resource');
        Global.PlugIn('FormImg', pid, resource);
    });

    //右侧切换Tab
    $("#ConfigMenuTab li").unbind('click').click(function () {
        $("#ConfigMenuTab li").removeClass('on');
        $(this).addClass('on');
        var index = $("#ConfigMenuTab li").index(this);
        var data = $("#MenuConfigSelect").find("option:selected").attr('data');
        if (index == 2) {
            if (data) {
                str = data.split(",");
                $('#Moduleid').val(str[1]);
                $('#ModuleTypeID').val(str[2]);
                $("#MenuName").val(str[3]).attr('readonly,readonly');
                $('#ShowMenuImg').attr('src', str[4]);
                if (str[5] && str[5] != "null") {
                    $('#MenuFunction,#ModuleName').val(str[5]);
                } else {
                    $('#MenuFunction,#ModuleName').val('首页');
                }
                if (str[6]) {
                    $('#ShowMenuBd .pm-item-row:eq(4)').show().find('#MenuLink').val(str[6]);
                }
            } else {
                $('#Moduleid').val('-44');
                $('#ModuleTypeID').val('0');
                $("#MenuName").attr('readonly', 'readonly').val('首页');
                $('#ShowMenuImg').attr('src', '../skin/img/file.png');
            }
        }
        $(".pm-config-bd .modal-config-box,#configure").hide();
        $(".pm-config-bd .modal-config-box:eq(" + index + ")").show();
    });
    //一、============================顶部导航区============================
    $(".pm-phoneframe-bd").delegate(".cter-navigation", "click", function (e) {
        $("#ConfigMenuTab li").removeClass('on');
        $("#ConfigMenuTab li:eq(0)").addClass('on');
        $('.pm-config-bd,#ConfigNav').show();
        $("#Configuration,#ConfigMenu").hide();
    })

    $("#ConfigNav").delegate(".NavTab a", "click", function (e) {
        var Elm = $(this).index();
        $(".pm-item-NavConfig").hide();
        $(this).addClass('cur').siblings().removeClass('cur');
        $(".pm-item-NavConfig:eq(" + Elm + ")").show();
        if (Elm == 0) {
            SetNaviBar("navibar_font", "0");
            SetNaviBar("navibar_img", "1");
        } else {
            SetNaviBar("navibar_font", "1");
            SetNaviBar("navibar_img", "0");
        }
    })


    //1、导航---设置状态
    $("#navibar").delegate(".pm-switch-bd", "click", function (e) {
        var State = 0;
        if (!$(this).hasClass('pm-switch-off')) {
            State = 1;
        }
        SetResource("navibar", State);
    })

    $('#NavBgVal').blur(function () {
        Global.InitialColorSetting("NavBgSelect", "navibar_bgcolor", $(this).val(), "cter-navigation");
    });

    $('#NavTextColor').blur(function () {
        $(".cter-navigation").css('color', $(this).val());
        CreateImage();
        Global.InitialColorSetting("NavTextSelect", "navibar_fontcolor", $(this).val(), "cter-navigation");
    });

    $('#NavText').blur(function () {
        $(".cter-navigation").html($(this).val());
        CreateImage();
    });

    $('#TextSize').change(function () {
        CreateImage();
    });


    //二、============================功能区============================

    //1、功能---拖动排序
    initContainer();

    //2、功能---拖动布局
    $(".pm-lyt-drag .pm-mod-md").draggable({
        connectToSortable: "#page-content",
        helper: function () {//跟随鼠标移动的对象
            var cloneDiv = $(this).clone();
            $("#page-content .pm-mod-md").removeClass("widget_view_selected");
            return cloneDiv;
        },
        revert: "invalid",//当元素拖拽结束后，元素回到原来的位置
        stop: function (e, t) {
            initContainer('lyt');
            showcomponents();
        }
    });

    //3、功能---拖动元素
    $(".pm-elm-drag .pm-mod-md").draggable({
        connectToSortable: ".pm-column",
        helper: function () {//跟随鼠标移动的对象
            var cloneDiv = $(this).clone();
            $("#page-content .pm-mod-md").removeClass("widget_view_selected");
            return cloneDiv;
        },
        revert: "invalid",
        stop: function (event, ui) {
            initContainer('column');
            showcomponents();
            $("#page-content .pm-mod-hd").remove();
        }
    });

    $("#ModuleTypeName,#ModuleUrl").blur(function () {
        SaveFunModule('module');
        AutoSave();
    });

    $("#FunTextColor").blur(function () { //设置功能文字颜色
        Global.InitialColorSetting("FunTextSelect", "fun_fontcolor", "#" + $(this).val(), "funcs");
    });

    $("#FunBgColor").blur(function () { //设置功能背景颜色
        Global.InitialColorSetting("FunBgSelect", "fun_bgcolor", "#" + $(this).val(), "funcs");
    });

    $('#FunTextSize').change(function () {
        SaveFunModule('module');
        AutoSave();
    });

    $("#Configuration").delegate(".FunTab a", "click", function (e) {
        var Elm = $(this).attr('data-type');
        var FontSize = $("#FunTextSize").find('option:selected').val();
        var FunColor = $("#FunTextColor").val();
        var BgColor = $("#FunBgColor").val();
        $(this).addClass('cur').siblings().removeClass('cur');
        $("#page-content .widget_view_selected").attr('data-fun-type', Elm);
        if (Elm == "0") {
            $("#SetFunStyle").show();
            var phtml = $("#page-content .widget_view_selected .pm-mod-box").find("p");
            var ModuleTypeName = $("#ModuleTypeName").val();
            $("#page-content .widget_view_selected .pm-mod-box").addClass('funcs').css('backgroundColor', '#' + BgColor).attr('data-val', BgColor).find('p').css({ fontSize: FontSize + 'px', color: '#' + FunColor }).attr('data-val', FunColor).show();
            if (phtml.length == 0) {
                $("#page-content .widget_view_selected .pm-mod-box").append("<p style='color:#" + FunColor + ";font-size:" + FontSize + "px;' data-val=" + FunColor + ">" + ModuleTypeName + "</p>");
            }
        } else {
            $("#SetFunStyle").hide();
            $("#page-content .widget_view_selected .pm-mod-box").removeClass('funcs').removeAttr('style').find('p').hide();
        }
        AutoSave();
    })

    //5、功能---预览区布局选择
    /*$("#page-content .pm-mod-md").unbind('click').click(function (e) {
    $("#page-content").delegate(".pm-mod-md", "click", function (e) {
        if ($(this).find(".pm-column .pm-mod-md").length == 0) {
            var lyt_type = $(this).attr('data-lyt-type');
            var values = [];
            var val = parseInt($(this).attr('data-width'));
            $('#page-content .pm-mod-md').removeClass('widget_view_selected');
            $(this).addClass('widget_view_selected');
            $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#configure,#SetFunction,#SetNoteName").hide();
            $(".pm-config-bd,.pm-config-bd .pm-item-box[data-type=" + lyt_type + "],#Configuration").show();
            values.push(val);
            LayoutBasis(lyt_type, JSON.stringify(values));
        }
    })*/

    //6、功能---预览区组件
    $("#page-content").delegate(".pm-column .pm-mod-md", "click", function (e) {
        var data = $(this);
        var bgColor = $(this).find('.pm-mod-box').attr("data-val");
        var fontColor = $(this).find('.pm-mod-box p').attr("data-val");
        var funtype = data.attr("data-fun-type");
        var str = '';
        var ImgUrl = $(this).find('img').attr('src');
        var Text = '';
        var elm_type = data.attr('data-elm-type');
        $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#configure,#SetFunction,#SetNoteName").hide();
        if (elm_type == 'module' || elm_type == 'function') {
            $('.pm-item-fun').show();
            elm_type = 'module';
        }
        $(".pm-config-bd,.pm-config-bd .pm-item-box[data-type=" + elm_type + "],#Configuration").show();
        $('#page-content .pm-mod-md').removeClass('widget_view_selected');
        data.addClass('widget_view_selected');
        $("#ConfigMenuTab li").removeClass('on');
        $("#ConfigMenuTab li:eq(1)").addClass('on');
        if (elm_type == 'text') {
            Text = $(this).text();
            editor.html(Text);
        } else if (elm_type == 'slide') {
            $("#SlideSelect").empty();
            var moduletypeid = data.attr('data-moduletypeid');
            var currSellnList = [];
            $.each(shellnlist, function (i, item) {
                if (item.moduleType == moduletypeid) {
                    currSellnList.push(item);
                }
            });
            var SlideSelectHtml = "";
            for (var i = 0; i < 5; i++) {
                if (currSellnList[i]) {
                    SlideSelectHtml += ('<option value="' + currSellnList[i].id + '" data="' + currSellnList[i].link + ',' + currSellnList[i].img + '">第' + (i + 1) + '张</option>');
                } else {
                    SlideSelectHtml += ('<option value="0">第' + (i + 1) + '张</option>');
                }
            }
            $("#SlideSelect").attr('data-moduletypeid', moduletypeid).html(SlideSelectHtml).find('option:first').trigger("change");
            if (currSellnList && currSellnList.length > 0) {
                $("#SlideLink").val(currSellnList[0].link);
                $("#ShowSlideImg").attr('src', currSellnList[0].img);
                $("#BannerConfig .pm-item-editImg .del").show();
            } else {
                $("#ShowSlideImg").attr('src', ImgUrl);
                $("#BannerConfig .pm-item-editImg .del").hide();
            }
            $("#SlideSelect").change(function () {
                var data = $(this).find('option:selected').attr('data');
                if (data) {
                    data = data.split(',');
                    $("#SlideLink").val(data[0]);
                    $("#ShowSlideImg").attr('src', data[1]);
                    $("#BannerConfig .pm-item-editImg .del").show();
                } else {
                    $("#SlideLink").val('');
                    $("#ShowSlideImg").attr('src', '../skin/img/file.png');
                    $("#BannerConfig .pm-item-editImg .del").hide();
                }
            });

            $("#SlideLink").blur(function () {
                if ($(this).val() && $(this).val().indexOf("http://") < 0) {
                    layer.msg('请输入以http://开头链接地址');
                    $("#SlideLink").focus();
                }
                UpdateShellN();
            });

            $(".pm-item-bdImg .del").unbind('click').click(function () {
                var sliderId = $('#SlideSelect').find("option:selected").val();
                var moduleTypeId = $('#SlideSelect').attr("data-moduletypeid");
                DeleteShellN(sliderId, moduleTypeId);
            });


        } else if (elm_type == "image" || elm_type == "function" || elm_type == "module") {
            if (ImgUrl != "../skin/img/default-focus.png") {
                $('.pm-item-uploadImg[data-resource=' + elm_type + '] img').attr('src', ImgUrl);
            } else {
                $('.pm-item-uploadImg[data-resource=' + elm_type + '] img').attr('src', '../skin/img/file.png');
            }
            if (data.attr("data")) {
                str = data.attr("data").split(",");
                if (str[0] && str[1] == '24') {
                    $('#CustomLink').show().find('#ModuleUrl').attr('readonly', 'readonly').val(str[0]);
                    $('#wapurl').val(str[0]);
                }
                if (str[5] == "146") {
                    $('#CustomLink').show().find('#ModuleUrl').removeAttr('readonly').val(str[0]);
                }
                $('#Moduleid').val(str[1]);
                $('#ModuleTypeID').val(str[2]);
                $('#ModuleTypeName,#ModuleName').val(str[3]);
                $('#FunctionTitle').val(str[4]);
                $('#BizModuleid').val(str[5]);
            } else {
                $('#Moduleid,#ModuleTypeID,#ModuleTypeName,#FunctionTitle,#ModuleUrl').val('');
            }
            if (elm_type == "function" || elm_type == "module") {
                if (funtype == "0" || funtype == "" || funtype == undefined) {
                    $(".FunTab a:eq(0)").addClass('cur').siblings().removeClass('cur');
                    $("#SetFunStyle").show();
                } else {
                    $(".FunTab a:eq(1)").addClass('cur').siblings().removeClass('cur');
                    $("#SetFunStyle").hide();
                }
                if (bgColor) {
                    $("#FunBgSelect").css('backgroundColor', '#' + bgColor);
                    $("#FunBgColor").val(bgColor);
                } else {
                    $("#FunBgSelect").css('backgroundColor', '#eeeeee');
                    $("#FunBgColor").val("eeeeee");
                }
                if (fontColor) {
                    $("#FunTextSelect").css('backgroundColor', '#' + fontColor);
                    $("#FunTextColor").val(fontColor);
                } else {
                    $("#FunTextSelect").css('backgroundColor', '#888888');
                    $("#FunTextColor").val("888888");
                }
            }
        } else if (elm_type == "title") {
            var title = $(this).find('.pm-mod-title h2').text();
            $("#TitleText").val(title);
            $(".pm-item-box[data-type=" + elm_type + "]").find('.pm-mod-title h2').html(title);
        } else if (elm_type == "button") {
            LayoutBasis(elm_type);
        }

        //loadData(elm_type);      

    });


    //三、============================菜单区============================

    //3、菜单---删除
    $(".pm-item-del a").click(function () {
        var id = $(this).parent().attr('data-id');
        DeletaTabbar(id);
    });

    //4、菜单---switch开关
    $("#tabbar").delegate(".pm-switch-bd", "click", function (e) {
        var State = 0;
        if (!$(this).hasClass('pm-switch-off')) {
            State = 1;
        }
        SetResource("tabbar", State);
    })

    //5、菜单---设置菜单背景颜色值
    $("#TabbarBgVal").blur(function () {
        Global.InitialColorSetting("TabbarBgSelect", "tabbar_bgcolor", $(this).val(), "cter-tabbar");
    });

    //6、菜单---设置菜单文字颜色值
    $("#TabbarFontVal").blur(function () {
        Global.InitialColorSetting("TabbarFontSelect", "tabbar_fontcolor", $(this).val(), "cter-tabbar");
    });


    //9、输入功能名称自动提交
    $("#MenuName").blur(function () {
        if ($(this).val() != "首页") {
            SaveFunModule('menu');
        }
    });

    var editor;
    KindEditor.ready(function (K) {
        editor = K.create('textarea[name="productcontent"]', {
            autoHeightMode: true,
            allowFileManager: false, //浏览上传文件
            themeType: 'simple',
            allowUpload: true,                                                                   //是否可以上传
            urlType: 'domain',
            items: [
                    'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', 'emoticons', 'source'],
            uploadJson: '../_Resource/kindeditor/asp.net/upload_json.ashx',  //上传文件方法 
            afterCreate: function () {
                var self = this;
                K.ctrl(document, 13, function () {
                    self.sync();
                });
                K.ctrl(self.edit.doc, 13, function () {
                    self.sync();
                });
            },
            //监听编辑器内容发生改变的事件
            afterChange: function () {
                if(editor !==  undefined){
                    $("#page-content .widget_view_selected  .pm-mod-text").html(editor.html());
                }
            },
            afterBlur: function () {
                AutoSave();
            }
        });
        editor.html("默认文本");//初始化内容
        editor.sync();
    });


    //关闭选择功能
    $(".pm-config-tit span").click(function () {
        $("#configure").hide();
        var type = $("#ColseFunction").val();
        if (type == 'module') {
            $('#Configuration').show();
        } else {
            $('#ConfigMenu').show();
        }
    });

    //按钮组件样式选择&文字输入&宽&高
    $("#ButtonText").bind('keyup', function () {
        $("#page-content .widget_view_selected  .pm-mod-button a").html($("#ButtonText").val());
    });
    $("#ButtonWidth").bind('keyup', function () {
        var width = $("#ButtonWidth").val();
        if (width < 35) {
            width = 35;
        }
        $("#page-content .widget_view_selected  .pm-mod-button a").css('width', width + '%');
    });
    $("#ButtonHeight").bind('keyup', function () {
        var height = $("#ButtonHeight").val() - 2;
        if (height < 40) {
            height = 40;
        }
        $("#page-content .widget_view_selected  .pm-mod-button a").css({ 'height': height + 'px', 'lineHeight': height + 'px' });
    });
    $(".pm-button-style li").click(function () {
        var type = $(this).attr('data-val');
        $(this).addClass('cur').siblings().removeClass('cur');
        $("#page-content .widget_view_selected .pm-mod-button a").removeClass().addClass('' + type + '');
        AutoSave();
    });

    //标题组件样式选择&文字输入
    $("#TitleText").bind('keyup', function () {
        $(".pm-mod-title h2").html($("#TitleText").val());
        AutoSave();
    });
    $(".pm-title-style li").click(function () {
        var type = $(this).attr('data-val');
        $(this).addClass('cur').siblings().removeClass('cur');
        $("#page-content .widget_view_selected .pm-mod-title").removeClass().addClass('pm-mod-title ' + type + '');
        AutoSave();
    });
})

//**********************************************基础设置***********************************
//初始化导航&菜单资源显示
function ShowNavMenu() {
    var IsEnableTabbar = true;
    var IsEnableNavbar = true;
    //$.getJSON("/BasicSettings/List?ecid=" + ecid + "&templateId=" + TempID, null, function (data) {
    $.getJSON("/init-settings.json", null, function (data) {
        layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        if (data.status == 1 && data.data) {
            if (data.data.length > 0) {
                $(".cter-tabbar ul,#MenuConfigSelect").empty();
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].ResourceType == "navibar_font" && data.data[i].TemplateId == TempID) { //导航文字
                        $("#NavText").val(data.data[i].Name);
                        $(".cter-navigation").html(data.data[i].Name);
                    }
                    if (data.data[i].ResourceType == "navibar_bgcolor" && data.data[i].TemplateId == TempID) { //导航背景
                        var navibar_bg = data.data[i].Style;
                        if (navibar_bg.indexOf('#') == '0') {
                            $(".cter-navigation,#NavBgSelect").css("backgroundColor", navibar_bg);
                            $("#NavBgVal").val(navibar_bg.replace('#', ''));
                        } else {
                            $(".cter-navigation,#NavBgSelect").css("backgroundColor", '#' + navibar_bg);
                            $("#NavBgVal").val(navibar_bg);
                        }
                    }
                    if (data.data[i].ResourceType == "navibar_fontcolor" && data.data[i].TemplateId == TempID) { //导航文字颜色
                        var navibar_bg = data.data[i].Style;
                        if (navibar_bg.indexOf('#') == '0') {
                            $(".cter-navigation").css("color", navibar_bg);
                            $("#NavTextSelect").css("backgroundColor", navibar_bg);
                            $("#NavTextColor").val(navibar_bg.replace('#', ''));
                        } else {
                            $(".cter-navigation").css("color", '#' + navibar_bg);
                            $("#NavTextSelect").css("backgroundColor", '#' + navibar_bg);
                            $("#NavTextColor").val(navibar_bg);
                        }
                    }
                    if (data.data[i].ResourceType == "navibar_img" && data.data[i].TemplateId == TempID) { //导航图片
                        $(".cter-navigation").html('<img src="' + data.data[i].ImgUrl + '">');
                        $("#ShowNavImg").attr('src', data.data[i].ImgUrl);
                        $("#ConfigNav .pm-item-uploadImg").addClass('UpSuccess');
                    }
                    if (data.data[i].ResourceType == "tabbar_bgcolor" && data.data[i].TemplateId == TempID) { //菜单背景
                        var tabbar_bg = data.data[i].Style.indexOf('#');
                        if (tabbar_bg == '-1') {
                            $(".cter-tabbar").css("backgroundColor", '#' + data.data[i].Style);
                            $("#TabbarBgVal").val(data.data[i].Style);
                            if (data.data[i].Style != 'ffffff') {
                                $("#TabbarBgSelect").css('backgroundColor', '#' + data.data[i].Style);
                            }
                        } else {
                            $(".cter-tabbar").css("backgroundColor", data.data[i].Style);
                            $("#TabbarBgVal").val(data.data[i].Style.replace('#', ''));
                            if (data.data[i].Style != '#ffffff') {
                                $("#TabbarBgSelect").css('backgroundColor', data.data[i].Style);
                            }
                        }
                    }
                    if (data.data[i].ResourceType == "tabbar_icon" && data.data[i].TemplateId == TempID) { //菜单图标
                        var WapUrl = data.data[i].WapUrl;
                        var str = "{0},{1},{2},'{3}','{4}','{5}',this";
                        var params = str.format(data.data[i].ID, data.data[i].ModuleID, data.data[i].ModuleTypeID, data.data[i].Name, data.data[i].ImgUrl, data.data[i].ModuleName);
                        if (!WapUrl) {
                            WapUrl = "";
                        } else {
                            if (WapUrl.indexOf("?ecid=") < 0) {
                                WapUrl += "?ecid=" + ecid;
                            }
                            WapUrl = WapUrl + "&moduletype=" + data.data[i].ModuleTypeID + "&module_type=" + data.data[i].ModuleTypeID;
                        }
                        var datajson = "{0},{1},{2},{3},{4},{5}".format(data.data[i].ID, data.data[i].ModuleID, data.data[i].ModuleTypeID, data.data[i].Name, data.data[i].ImgUrl, data.data[i].ModuleName);
                        $(".cter-tabbar ul").append('<li onclick="EditMenu(' + params + ')" wap_url="' + WapUrl + '"><img src="' + data.data[i].ImgUrl + '">' + data.data[i].Name + '</li>');
                        $("#MenuConfigSelect").append('<option value="' + data.data[i].ID + '" id="' + data.data[i].ID + '" data="' + datajson + '">' + data.data[i].Name + '</option>');
                        CreateMenu();
                    }
                    if (data.data[i].ResourceType == "tabbar_fontcolor" && data.data[i].TemplateId == TempID) { //菜单文字颜色
                        var tabbar_fcolor = data.data[i].Style.indexOf('#');
                        if (tabbar_fcolor == '-1') {
                            $(".cter-tabbar").css("color", '#' + data.data[i].Style);
                            $("#TabbarFontVal").val(data.data[i].Style);
                            $("#TabbarFontSelect").css('backgroundColor', '#' + data.data[i].Style);
                        } else {
                            $(".cter-tabbar").css("color", data.data[i].Style);
                            $("#TabbarFontVal").val(data.data[i].Style.replace('#', ''));
                            $("#TabbarFontSelect").css('backgroundColor', data.data[i].Style);
                        }
                    }

                    if (data.data[i].ResourceType.indexOf("tabbar") > -1 && data.data[i].TemplateId == TempID) {
                        if (data.data[i].State == 1) {
                            IsEnableTabbar = false;
                        }
                    }
                    if (data.data[i].ResourceType.indexOf("navibar") > -1 && data.data[i].TemplateId == TempID) {
                        if (data.data[i].State == 1) {
                            IsEnableNavbar = false;
                        }
                    }

                    if (IsEnableNavbar == false) {
                        $("#navibar .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-off').next('.pm-switch-tips').html('隐藏');
                        $("#pm-phoneconent .cter-navigation").hide();
                    } else {
                        $("#navibar .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
                        $("#pm-phoneconent .cter-navigation").show();
                    }

                    if (IsEnableTabbar == false) {
                        $("#tabbar .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-off').next('.pm-switch-tips').html('隐藏');
                        $("#pm-phoneconent .cter-tabbar").hide();
                    } else {
                        $("#tabbar .pm-switch-bd").removeClass('pm-switch-off').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
                        $("#pm-phoneconent .cter-tabbar").show();
                    }
                }
            }
        }
        Global.InitialColorSelect("NavBgSelect", "navibar_bgcolor", "NavBgVal", $("#NavBgVal").val(), "cter-navigation");//初始化顶部导航背景颜色
        Global.InitialColorSelect("NavTextSelect", "navibar_fontcolor", "NavTextColor", $("#NavTextColor").val(), "cter-navigation");//初始化顶部导航文字颜色
        Global.InitialColorSelect("TabbarBgSelect", "tabbar_bgcolor", "TabbarBgVal", $("#TabbarBgVal").val(), "cter-tabbar");//初始化底部菜单背景颜色
        Global.InitialColorSelect("TabbarFontSelect", "tabbar_fontcolor", "TabbarFontVal", $("#TabbarFontVal").val(), "cter-tabbar");//初始化底部菜单文字颜色


        $(".cter-tabbar li:first").addClass('home');
        var MenuNumber = $("#MenuConfigSelect option").size();
        if (MenuNumber > 0) {
            $(".MenuNumberSlider .ui-slider-handle").css('left', (MenuNumber - 1) * 25 + '%');
            $(".MenuNumberSlider .ui-slider-range").css('width', (MenuNumber - 1) * 25 + '%');
        } else {
            $("#MenuConfigSelect").append('<option val="0">首页</option>');
            $(".MenuNumberSlider .ui-slider-handle").css('left', '0%');
            $(".MenuNumberSlider .ui-slider-range").css('width', '0%');
        }
        //4、菜单---数量
        $(".MenuNumberSlider").slider({
            range: "min",
            min: 1,
            max: 5,
            value: MenuNumber,
            slide: function (event, ui) {
                var MenuMun = $("#MenuNumber").val();
                if (ui.value < MenuMun) {
                    layer.confirm("减少菜单数量需重新配置喔?", {
                        icon: 3, title: '提示', cancel: function (index) {
                            $(".MenuNumberSlider .ui-slider-range").css('width', (MenuMun - 1) * 25 + '%');
                            $(".MenuNumberSlider .ui-slider-handle").css('left', (MenuMun - 1) * 25 + '%');
                        }
                    }, function (index) {
                        layer.load(0, {
                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                        });
                        CreateMenu(ui.value);
                    })
                } else {
                    CreateMenu(ui.value);
                }
            }
        });

        SetWidgetHeight();
        layer.closeAll();
    });
}


//显示已有模块
function ShowModuleList() {
    layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    //$.getJSON("/moduletype/list?ecid=" + ecid + "&templateId=" + TempID, function (data) {
    $.getJSON("/module-list.json", function (data) {
        layer.closeAll();
        if (data.status == 1) {
            if (data.data) {
                var modules = "";
                $.each(data.data, function (k, v) {
                    modules += "<li><b onclick=\"ExistingModulesMenu('" + v.BizModuleID + "','" + v.ModuleTypeID + "','" + v.WapUrl + "','" + v.ModuleID + "','" + v.BizModuleName + "','" + v.TextName + "')\" objid=" + v.ID + " title=" + v.BizModuleName + ">" + v.TextName + "</b><i class='pm-bg-blue'>X</i></li>";
                });
                $("#UsingModule").html(modules);
            } else {
                $("#configure .pm-config-tit:eq(2)").hide();
            }
        }
    });
}

//删除当前模板已配置的菜单
function DeletaTabbar(id) {
    layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    $.post("/BasicSettings/Delete/" + id, null, function (jsobj) {
        layer.closeAll();
        if (jsobj.status == 1) {
            $('#ShowMenuLan li[id=' + id + '],.cter-tabbar li[id=' + id + ']').remove();
            var MenuSize = $('#ShowMenuLan li:not(".add")').size();
            if (MenuSize == 0) {
                $('#MenuFunction,#MenuName').val('');
                $('#FileImgMenuIcon img').attr('src', '../skin/img/default-icon.png');
                $('.pm-item-del').hide();
            } else if (MenuSize == 2) {
                $('#ShowMenuLan li').css('width', '33.33333%');
            } else if (MenuSize == 3) {
                $('#ShowMenuLan li').css('width', '25%');
            } else if (MenuSize == 4) {
                $('#ShowMenuLan li').css('width', '20%');
                $('#ShowMenuLan li.add').show().addClass('on');
                $('.pm-item-del').hide();
                $('#MenuFunction,#Moduleid,#MenuName,#ModuleName,#ModuleTypeID').val('');
                $('#FileImgMenuIcon img').attr('src', '../skin/img/default-icon.png');
            }
            layer.msg(jsobj.message);
        } else {
            layer.msg(jsobj.message);
        }
    }, "json")
}

//添加菜单
function CreateMenu(num) {
    var optionHtml = "";
    var menuHtml = "";
    layer.closeAll();
    var MenuNum = $("#MenuConfigSelect option").size();
    if (!MenuNum) {
        MenuNum = 1;
    }
    if (num) {
        $('.pm-item-uploadImg').removeClass('UpSuccess');
        if (num < MenuNum) {
            $(".cter-tabbar ul li:not('.home')").remove();
            $("#MenuConfigSelect option:not(:first)").remove();
            for (i = 1; i < num ; i++) {
                optionHtml += ("<option value='" + (i + 1) + "' class='not'>菜单" + (i + 1) + "</option>");
                menuHtml += ("<li class='notid' onclick=\"EditMenu(0,0,0,'菜单" + (i + 1) + "','../skin/img/file.png','选择菜单',this)\"><img src='../skin/img/icon_blank.png'>菜单" + (i + 1) + "</li>");
            }
            $("#MenuConfigSelect").append(optionHtml);
            $(".cter-tabbar ul").append(menuHtml).find("li.notid:first").addClass("cur").trigger("click");;
            $("#MenuNumber").val(num);
            //清除所配置的菜单
            $.post("/BasicSettings/DeleteTabbar?ecid=" + ecid + "&templateId=" + TempID, null, function (jsobj) {
                if (jsobj.status == 1) {

                }
            }, "json");
        } else {
            for (i = MenuNum; i < num; i++) {
                optionHtml += ("<option value='0,0,0," + (i + 1) + "' class='not'>菜单" + (i + 1) + "</option>");
                menuHtml += ("<li class='notid' onclick=\"EditMenu(0,0,0,'菜单" + (i + 1) + "','../skin/img/file.png','选择菜单',this)\"><img src='../skin/img/icon_blank.png'>菜单" + (i + 1) + "</li>");
            }
            if ($("#MenuConfigSelect").find("option:selected").index() == 0) {
                $('#MenuName,#MenuFunction').val('首页');
                $('#ShowMenuImg').attr('src', 'http://b5.pmit.cn/skin/img/m_home_icon.png');
            } else {
                $('#MenuName').val('菜单');
                $('#MenuFunction').val('选择功能');
                $('#ShowMenuImg').attr('src', '../skin/img/file.png');
            }
            $("#MenuConfigSelect").append(optionHtml);
            $(".cter-tabbar ul").append(menuHtml).find("li.notid:first").addClass("cur").trigger("click");
            $("#MenuNumber").val(num);
        }
    } else {
        $("#MenuNumber").val(MenuNum);
    }

    $("#MenuConfigSelect").change(function () {        
        var MenuSelectVal = $("#MenuConfigSelect").find("option:selected").val();
        var MenuSelectText = $("#MenuConfigSelect").find("option:selected").text();
        var data = $("#MenuConfigSelect").find("option:selected").attr('data');
        if (data) {
            str = data.split(",");
            $('#Moduleid').val(str[1]);
            $('#ModuleTypeID').val(str[2]);
            $("#MenuName").val(str[3]);
            $('#ShowMenuImg').attr('src', str[4]);
            if (str[1] == "-44") {
                $("#MenuName").attr('readonly', 'readonly');
                $("#MenuFunction").unbind("click").val('首页');
                $("#MenuFunction").unbind("click").addClass('pm-bg-gray').removeClass('MenuFunSelect');
            } else {
                $("#MenuFunction").addClass('MenuFunSelect').removeClass('pm-bg-gray');
                if (str[5] && str[5] != "null") {
                    $('#MenuFunction,#ModuleName').val(str[5]);
                } else {
                    $('#MenuFunction,#ModuleName').val('选择功能');
                }
                $('#MenuName').val(str[3]).removeAttr('readonly');
                $("#MenuFunction").unbind("click").click(function () {
                    Global.PlugIn('menu');
                });
            }

        } else {
            $("#MenuFunction").addClass('MenuFunSelect').val('选择功能');
            $("#MenuName").removeAttr('readonly').val(MenuSelectText);
            $('#ShowMenuImg').attr('src', '../skin/img/file.png');
            $('.pm-item-uploadImg').removeClass('UpSuccess');
            $(".MenuFunSelect").unbind("click").click(function () {
                Global.PlugIn('menu');
            });
        }
    });
}


//修改菜单(点击菜单修改)
function EditMenu(Tabbarid, ModuleID, ModuleTypeID, TabbarName, ImgUrl, ModuleName, Element) {
    $('#ConfigMenuTab li:eq(2)').addClass('on').siblings().removeClass('on');
    $('.pm-config-bd,#ConfigMenu').show();
    $('#ConfigNav,#Configuration').hide();
    $(Element).addClass("cur").siblings().removeClass("cur");
    var MenuName = $.trim($(this).text());
    $('#Moduleid').val(ModuleID);
    $('#ModuleTypeID').val(ModuleTypeID);
    $("#MenuName").val(TabbarName);
    $('#ShowMenuImg').attr('src', ImgUrl);
    if (!ModuleName) {
        ModuleName = TabbarName;
    }
    $('#MenuFunction,#ModuleName').val(ModuleName);
    if (ModuleID == "-44") {
        $("#MenuFunction").unbind("click").addClass('pm-bg-gray').removeClass('MenuFunSelect');
        $('#MenuName').attr('readonly', 'readonly');
    } else {
        $("#MenuFunction").addClass('MenuFunSelect').removeClass('pm-bg-gray');
        $('#MenuName').removeAttr('readonly', 'readonly');
        $(".MenuFunSelect").unbind("click").click(function () {
            Global.PlugIn('menu');
        });
    }
    Global.setSelectChecked('MenuConfigSelect', Tabbarid, TabbarName);
}

//设置滑块比列（布局栏宽度发生变化的时候）
function LayoutBasis(type, values) {
    console.log(type,values);
    var range = false;
    $("#Configuration .pm-item-box[data-type='" + type + "'] .pm-devide-control .LytSlider").each(function () {
        $(this).empty().slider({
            range: range,
            min: 0,
            max: 100,
            values: values,
            animate: true,
            slide: function (event, ui) {
                values = ui.values;
                if (type == 'button') {
                    $("#page-content .widget_view_selected .pm-mod-button a").css('width', ui.value + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] #ButtonWidth .cell").html(ui.value + '%');
                }
                if (type == 'l2') {
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0)").html(values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1)").html(100 - values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0),#page-content .widget_view_selected .pm-column:eq(0)").css('width', values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1),#page-content .widget_view_selected .pm-column:eq(1)").css('width', 100 - values[0] + '%');
                }
                if (type == 'l3') {
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0)").html(values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1)").html(values[1] - values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(2)").html(100 - values[1] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0),#page-content .widget_view_selected .pm-column:eq(0)").css('width', values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1),#page-content .widget_view_selected .pm-column:eq(1)").css('width', values[1] - values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(2),#page-content .widget_view_selected .pm-column:eq(2)").css('width', 100 - values[1] + '%');
                }
                if (type == 'l4') {
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0)").html(values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1)").html(values[1] - values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(2)").html(values[2] - values[1] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(3)").html(100 - values[2] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(0),#page-content .widget_view_selected .pm-column:eq(0)").css('width', values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(1),#page-content .widget_view_selected .pm-column:eq(1)").css('width', values[1] - values[0] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(2),#page-content .widget_view_selected .pm-column:eq(2)").css('width', values[2] - values[1] + '%');
                    $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(3),#page-content .widget_view_selected .pm-column:eq(3)").css('width', 100 - values[2] + '%');
                }
                $("#page-content .widget_view_selected").attr('data-width', values);
                //if (type.indexOf("l") == 0 && ui.values.length >= 1) {
                //    $.each(ui.values, function (i, item) {
                //        $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(" + i + "),#page-content .widget_view_selected .pm-column:eq(" + i + ")").css('width', item + '%').attr('data-width', item);
                //        $("#Configuration .pm-item-box[data-type='" + type + "'] .cell:eq(" + i + ")").html(item + '%');
                //    });
                //}
            }
        });
    });
}

//设置导航图片是否可用
function SetNaviBar(ResourceType, State) {
    var jsonsrt = {
        "ecid": ecid,
        "ResourceType": ResourceType,
        "TemplateId": TempID,
        "State": State
    }
    $.post("/BasicSettings/SetResourceEnable", jsonsrt, function (data) {
    });
}

//设置导航栏、菜单栏状态
function SetResource(ResourceType, State) {
    var StateText = "显示";
    var ResourceText = "导航";
    if (State == 1) {
        StateText = "隐藏";
    }
    if (ResourceType == 'tabbar') {
        ResourceText = "菜单";
    }
    layer.confirm('确认要' + StateText + ResourceText + '?', { icon: 3, title: '提示' }, function (index) {
        layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        var jsonsrt = {
            "ecid": ecid,
            "ResourceType": ResourceType,
            "TemplateId": TempID,
            "State": State
        }
        $.post("/BasicSettings/SetResourceEnable", jsonsrt, function (data) {
            layer.closeAll();
            if (data.status == 1) {
                layer.msg(data.message);
            }
        });
        if (ResourceType == 'tabbar') {
            if ($("#ConfigMenu .pm-switch-bd").hasClass('pm-switch-off')) {
                $("#ConfigMenu .pm-switch-bd").removeClass('pm-switch-off').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
                $("#page-content").css('height', $("#page-content").height() - 40);
                $('.cter-tabbar').show();
            } else {
                $("#ConfigMenu .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-off').next('.pm-switch-tips').html('隐藏');
                $("#page-content").css('height', $("#page-content").height() + 40);
                $('.cter-tabbar').hide();
            }
        }
        if (ResourceType == 'navibar') {
            if ($("#navibar .pm-switch-bd").hasClass('pm-switch-off')) {
                $("#navibar .pm-switch-bd").removeClass('pm-switch-off').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
                $("#page-content").css('height', $("#page-content").height() - 40);
                $('.cter-navigation').show();
            } else {
                $("#navibar .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-off').next('.pm-switch-tips').html('隐藏');
                $("#page-content").css('height', $("#page-content").height() + 40);
                $('.cter-navigation').hide();
            }
        }
    });
}

//拖动布局顺序
function initContainer() {
    $("#page-content").sortable({  //拖动布局
        connectWith: "#page-content",//允许sortable对象连接另一个sortable对象，可将item元素拖拽到另一个中.(类型：Selector)
        opacity: .35,
        handle: ".pm-mod-bd",//限制排序的动作只能在item元素中的某种元素 如 handle: ‘h2′
        //释放时
        receive: function (e, ui) {
            //获取当前（被拖动的）是第几栏的布局
            var data_lyt_type = $(ui.item).attr("data-lyt-type");
            //l1 单栏 l2 2栏 l3 3栏 l4 四栏 l5 混合 l8 分割线
            var values = "";
            $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#SetFunction,#SetNoteName").hide();
            $("#Configuration,.pm-config-bd").show();
            $("#ConfigMenuTab li:eq(1)").addClass('on').siblings().removeClass('on');
            //布局不是单栏和混合布局
            if (data_lyt_type && data_lyt_type != 'l1' || data_lyt_type && data_lyt_type != 'l5') {
                //显示可拖动比例
                $(".pm-config-bd .pm-item-box[data-type=" + data_lyt_type + "]").show();
                if (data_lyt_type == "l2") {
                    values = [50];
                }
                if (data_lyt_type == "l3") {
                    values = [33, 66];
                }
                if (data_lyt_type == "l4") {
                    values = [25, 50, 75];
                }
                LayoutBasis(data_lyt_type, values);
            }
            //自动到底部
            AutoScrollBottom();
            //自动保存
            AutoSave();
        },
        update: function (e, ui) {
        },
        cursor: 'move', //鼠标样式
        opacity: 0.8 //拖拽时透明
    });
    $("#page-content .pm-column").sortable({  //拖动元素
        connectWith: ".pm-column",//允许sortable对象连接另一个sortable对象，可将item元素拖拽到另一个中.(类型：Selector)
        opacity: .35,
        handle: ".pm-mod-bd",//限制排序的动作只能在item元素中的某种元素 如 handle: ‘h2′
        //释放时
        receive: function (e, ui) {
            if ($(this).find(".pm-mod-md").length > 1) {
                $(this).find(".widget_view_selected").remove();
            } else {
                //获取当前元素是那种类型元素 如text  image button
                var data_elm_type = $(ui.item).attr("data-elm-type");
                console.log(data_elm_type);
                $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#SetFunction,#SetNoteName").hide();
                $("#Configuration,.pm-config-bd").show();
                $("#ConfigMenuTab li:eq(1)").addClass('on').siblings().removeClass('on');
                if (data_elm_type) {
                    //根据元素类型不同显示不同设置选项
                    $(".pm-config-bd .pm-item-box[data-type=" + data_elm_type + "]").show();
                    $('#wapurl,#ModuleTypeName,#ModuleUrl').val('');
                    $('#FunctionTitle').val('请选择功能');
                    $('.pm-item-uploadImg').find('img').attr('src', '../skin/img/file.png');
                    //如果是功能弹窗功能选择层
                    if (data_elm_type == 'function' || data_elm_type == 'module') {
                        $(".pm-item-fun").show();
                        $(".FunTab a:eq(0)").addClass('cur').siblings().removeClass('cur');
                        //弹窗功能选择
                        Global.PlugIn(data_elm_type);
                    } else if (data_elm_type == 'button') {
                        LayoutBasis(data_elm_type);
                    }
                    loadData(data_elm_type);
                }
                AutoScrollBottom();
                AutoSave();
            }
        },
        update: function (e, ui) {
        },
        cursor: 'move', //鼠标样式
        opacity: 0.8 //拖拽时透明
    });
}

//设置编辑区域高度
function SetWidgetHeight() {
    if ($('.cter-navigation').is(':hidden') && $('.cter-tabbar').is(':hidden')) {
        $('#page-content').css('height', $('#page-content').height() + 120);
    }
    if ($('.cter-navigation').is(':visible') && $('.cter-tabbar').is(':hidden')) {
        $('#page-content').css('height', $('#page-content').height() + 60);
    }
    if ($('.cter-navigation').is(':hidden') && $('.cter-tabbar').is(':visible')) {
        $('#page-content').css('height', $('#page-content').height() + 60);
    }
}

//删除布局和元素
function removeElm(tempId) {
    $("#page-content").delegate(".pm-mod-del", "click", function (e) {
        var data = $(this).parent().parent().parent();
        var draggable = data.attr('data-elm-type');
        var dargtext = "";
        if (draggable) {
            dargtext = "元素";
        } else {
            dargtext = "布局";
        }
        layer.confirm('确认要删除' + dargtext + '?', { icon: 3, title: '提示' }, function (index) {
            if (data.attr('data')) {
                layer.closeAll();
                var objid = data.attr('data').split(",");
                if (objid[2] > 0) {
                    layer.load(0, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });
                    var jsonsrt = {
                        "ECID": ecid,
                        "Templateid": tempId,
                        "ModuleTypeId": objid[2],
                        "TextName": objid[3]
                    }
                    $.post("/moduletype/delete/", jsonsrt, function (jsobj) {
                        if (jsobj.status == 1) {
                            layer.msg(jsobj.message);
                            data.remove();
                        } else {
                            layer.msg(jsobj.message);
                        }
                    }, "json")
                } else {

                    data.remove();
                }
            } else if (draggable == 'slide') {
                var moduletypeid = data.attr('data-moduletypeid');
                var jsonsrt = {
                    "ecid": ecid,
                    "Templateid": tempId,
                    "ModuleTypeId": moduletypeid
                }
                $.post("/moduletype/deleteshelln", jsonsrt, function (jsobj) {
                    layer.closeAll();
                    if (jsobj.status == 1) {
                        layer.msg(jsobj.message);
                        data.remove();
                    } else {
                        layer.msg(jsobj.message);
                    }
                }, "json")
            } else {
                layer.closeAll();
                if (!draggable) {
                    var info = [];
                    $.each(data.find('.pm-column'), function (k, v) {
                        var objid = $(this).find('.pm-mod-md').attr('data');
                        if (objid) {
                            objid = objid.split(",");
                            info.push(objid[2]);
                        }
                    });

                    if (info.length > 0) {
                        deletesModule(info.join(","));
                    }
                }
                data.remove();
            }
            $('.pm-config-bd,#configure').hide();
            AutoSave();
        });
    })
}

//批量删除模板中的模块
function deletesModule(moduletypeid) {
    var jsonsrt = {
        "ecid": ecid,
        "Templateid": TempID,
        "ModuleTypeIds": moduletypeid
    }
    $.post("/moduletype/deletes", jsonsrt, function (jsobj) {
        if (jsobj.status == 1) {

        }
    }, "json");
}


//创建自动保存导航图片配置
function CreateImage() {
    var Text = $("#NavText").val();
    var TextColor = $("#NavTextColor").val();
    var TextSize = $("#TextSize").find("option:selected").val();
    if (Text && TextColor && TextSize) {
        layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        var jsonStr = {
            "ecid": ecid,
            "TemplateId": TempID,
            "NaviFont": Text,
            "NaviFontColor": "#" + TextColor,
            "NaviFontSize": TextSize
        }
        $.post("/BasicSettings/SaveNaviTextConfig/", jsonStr, function (jsobj) {
            layer.closeAll();
            if (jsobj.status == 1) {
                $(".cter-navigation img").attr('src', jsobj.data);
            }
        }, "json");
    }
}

//添加、修改轮播图
function UpdateShellN() {
    var moduleTypeId = $("#page-content .widget_view_selected[data-elm-type='slide']").attr('data-moduletypeid');
    var link = $("#SlideLink").val();
    var imgUrl = $("#ShowSlideImg").attr('src');
    var sliderId = $("#SlideSelect").find('option:selected').val();
    layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    if (!sliderId) {
        sliderId = 0;
    }
    if (moduleTypeId && imgUrl != "../skin/img/swiper.jpg") {
        var jsonStr = {
            "id": sliderId,
            "ecid": ecid,
            "moduleType": moduleTypeId,
            "link": link,
            "img": imgUrl
        }
        $.ajax({
            type: "post",
            url: "http://mod.pmit.cn/shelln/update",
            data: JSON.stringify(jsonStr),
            dataType: 'json',
            success: function (data) {
                layer.closeAll();
                if (data.result == true && data.data) {
                    $("#SlideSelect").find('option:selected').val(data.data.id).attr('data', data.data.link + ',' + data.data.img);
                    if ($("#page-content .widget_view_selected[data-moduletypeid=" + moduleTypeId + "] .swiper-wrapper").find(".swiper-slide").length > 0) {
                        $("#page-content .widget_view_selected[data-moduletypeid=" + moduleTypeId + "] .swiper-wrapper").append("<div class='swiper-slide'><a href='javascript:;'><img src='" + data.data.img + "'></a></div>");
                    } else {
                        $("#page-content .widget_view_selected[data-moduletypeid=" + moduleTypeId + "] .swiper-wrapper").html("<div class='swiper-slide'><a href='javascript:;'><img src='" + data.data.img + "'></a></div>");
                    }
                    $("#page-content .widget_view_selected[data-moduletypeid=" + moduleTypeId + "] .swiper-pagination").empty();
                    layer.msg(data.message);
                    showSlide();
                    $("#BannerConfig .pm-item-editImg .del").show();
                } else {
                    layer.msg(data.message);
                }
            }
        });
    }
}

//删除单个轮播图片
function DeleteShellN(sliderId, moduleTypeId) {
    layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    var jsonStr = {
        "id": sliderId,
        "ecid": ecid,
        "moduleType": moduleTypeId
    }
    $.ajax({
        type: "post",
        url: "http://mod.pmit.cn/shelln/delete",
        data: JSON.stringify(jsonStr),
        dataType: 'json',
        success: function (data) {
            if (data.result == true) {
                layer.closeAll();
                layer.msg(data.message);
                $("#SlideSelect").find("option:selected").removeAttr('data').val('0');
                if ($("#SlideSelect").find("option:selected").index() == 0) {
                    $("#ShowSlideImg").attr('src', '../skin/img/swiper.jpg');
                } else {
                    $("#ShowSlideImg").attr('src', '../skin/img/file.png');
                }
                $("#BannerConfig .pm-item-editImg .del").hide();
                showSlide();
                AutoSave();
            }
        }
    });
}

//鼠标经过显示拖动、删除小组件
function showcomponents() {
    $("#page-content .pm-mod-md").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    });
    $('#page-content').find(".pm-mod-hd").remove();
}

//加载单个模板
function singletemp() {
	//http://b5.pmit.cn/apptemplate/250
	//'/apptemplate/' + TempID
    $.get('/apptemplate.json', function (data) {
        if (data.status == 1) {
            if (data.data.tmpl.length > 0) {
                $("#page-content").html(data.data.tmpl);
            } else {
                $("#page-content").append(data.data.tmpl);
            }
            if (data.data.tmpl.indexOf('<input type="hidden" id="EditOperateTime"') < 0) {
                $("#page-content").append('<input type="hidden" id="EditOperateTime" value="' + Date.parse(new Date()) / 1000 + '"/>');
            }
            if (data.data.tmpl.indexOf('<input type="hidden" id="ecid"') < 0) {
                $("#page-content").append('<input type="hidden" id="ecid" value="' + ecid + '"/>');
            } else {
                $("#ecid").val(ecid);
            }
            if (data.data.tmpl.indexOf('<input type="hidden" id="TemplateId"') < 0) {
                $("#page-content").append('<input type="hidden" id="TemplateId" value="' + TempID + '"/>');
            } else {
                $("#TemplateId").val(TempID);
            }
            showcomponents();
            showSlide();//加载轮播图
            removeElm(data.data.ID);
            AutoSave("Initial");
            Global.InitialColorSelect("FunBgSelect", "fun_bgcolor", "FunBgColor", $("#FunTextColor").val(), "funcs");//初始化功能区域-功能背景颜色
            Global.InitialColorSelect("FunTextSelect", "fun_fontcolor", "FunTextColor", $("#FunBgColor").val(), "funcs");//初始化功能区域-功能文字颜色
        } else {
            window.history.go(-1);
        }
    }, 'json');
}

//加载轮播图
function showSlide() {
    var moduleTypeId = [];
    shellnlist = [];
    $.each($("#page-content .pm-mod-md[data-elm-type='slide']"), function () {
        var moduletypeid = $(this).attr('data-moduletypeid');
        if (moduletypeid) {
            moduleTypeId.push(moduletypeid);
            $.ajax({
                type: "get",
                url: "http://mod.pmit.cn/ShellN/List?ecid=" + ecid + "&moduleTypeId=" + moduletypeid,
                dataType: "json",
                success: function (data) {
                    if (data.result == true && data.data.length > 0) {
                        var advHtml = "";
                        $('.pm-mod-md[data-moduletypeid=' + moduletypeid + '] .swiper-wrapper,.pm-mod-md[data-moduletypeid=' + moduletypeid + '] .swiper-pagination').empty();
                        $.each(data.data, function (k, v) {
                            shellnlist.push(v);
                            if (v.link) {
                                advHtml += ("<div class='swiper-slide'>" +
                                    "<a href='javascript:;' onclick='showMenu(this);' data='" + v.link + ",24,0,' wap_url='" + v.link + "'><img src='" + v.img + "'></a>" +
                                "</div>");
                            } else {
                                advHtml += "<div class='swiper-slide'>" +
                                        "<a href='javascript:;'><img src='" + v.img + "'></a>" +
                                    "</div>"
                            }
                        });
                        $('.pm-mod-md[data-moduletypeid=' + moduletypeid + '] .swiper-wrapper').html(advHtml);
                        initSwiper(moduletypeid);
                    } else {
                        $('.pm-mod-md[data-moduletypeid=' + moduletypeid + '] .swiper-wrapper').removeAttr('style').html("<img src='../skin/img/swiper.jpg'>");
                        $('#ShowSlideImg').attr("src", "../skin/img/swiper.jpg");
                        $("#SlideSelect").find("option:first").attr("selected", true);
                    }
                }
            });
        }
    });
    if (moduleTypeId.length <= 0) {
        var parm = { "moduleid": "44", "ecid": ecid };
        $.ajax({
            type: "post",
            url: "http://mod.pmit.cn/ShellE/GetShellEInfo",
            data: JSON.stringify(parm),
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.result == true && data.info.length > 0) {
                    $('.adv_list .swiper-wrapper,.adv_list .swiper-pagination').empty();
                    $.each(data.info, function (k, v) {
                        if (v.ad_linkurl) {
                            advHtml += "<div class='swiper-slide'>" +
                                    "<a href='javascript:;' onclick='showMenu(this);' data='" + v.ad_linkurl + ",24,0,' wap_url='" + v.ad_linkurl + "'><img src='" + v.ad_imgurl + "'></a>" +
                                "</div>"
                        } else {
                            advHtml += "<div class='swiper-slide'>" +
                                    "<a href='javascript:;'><img src='" + v.ad_imgurl + "'></a>" +
                                "</div>"
                        }
                    });
                    $('.adv_list .swiper-wrapper').html(advHtml);
                    initSwiper();
                } else {

                }
            }
        });
    }
    $("#page-content .adv_list a").click(function () {
        return false;
    });
}

function initSwiper(moduletypeid) {
    if (moduletypeid) {
        if ($('.pm-mod-md[data-moduletypeid=' + moduletypeid + '] .swiper-wrapper .swiper-slide').size() > 1) {
            mySwiper = new Swiper('.adv_list .swiper-container', {
                autoplay: 3000,
                loop: true,
                slidesPerView: 'auto',
                loopedSlides: 5,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                observer: true,
                paginationClickable: true,
                centeredSlides: true,
                autoplayDisableOnInteraction: false
            });
        }
    } else {
        if ($('.adv_list .swiper-wrapper .swiper-slide').size() > 1) {
            mySwiper = new Swiper('.adv_list .swiper-container', {
                autoplay: 3000,
                loop: true,
                slidesPerView: 'auto',
                loopedSlides: 5,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                observer: true,
                paginationClickable: true,
                centeredSlides: true,
                autoplayDisableOnInteraction: false
            });
        }
    }
}

//**********************************************数据绑定*************************************
//1、根据不同元素类型，显示不同的组件
function loadData(dataType) {
    switch (dataType) {
        case "text"://文本
            initTextWidget();
            break;
        case "image"://图片            
            initImageWidget();
            break;
        case "button"://按钮            
            initButtonWidget();
            break;
        case "search"://搜索            
            initSearchWidget();
            break;
        case "slide"://轮播
            initSlideWidget();
            break;
        case "navigate"://导航            
            initNavigateWidget();
            break;
        case "title"://标题            
            initTitleWidget();
            break;
        case "link"://链接            
            initLinkWidget();
            break;
        case "video"://视频            
            initVideoWidget();
            break;
        case "audio"://音频            
            initAudioWidget();
            break;
        case "artlist"://文章列表            
            initArtlistWidget();
            break;
        case "function"://功能
            initFunWidget();
            break;
        case "tel"://一键拨打
            initTelWidget();
            break;
        default:
            break;
    }
}

//文字组件-数据绑定
function initTextWidget() {

}
//图片组件-数据绑定
function initImageWidget() {
    $("#upload_imgform img").attr('src', '../skin/img/file.png');
}
//功能组件-数据绑定
function initFunWidget() {
    $("#SetFunction,#SetNoteName").show();
    $("#FunctionTitle,#ModuleTypeName").val('');
    $("#upload_funform img").attr('src', '../skin/img/file.png');
}
//电话组件-数据绑定
function initTelWidget() {

}
//按钮组件-数据绑定
function initButtonWidget() {
}
//搜索组件-数据绑定
function initSearchWidget() {
}
//轮播组件-数据绑定
function initSlideWidget() {
    $("#ShowSlideImg").attr('src', '../skin/img/swiper.jpg');
    $("#SlideSelect").find("option").attr("value", "0").removeAttr('data');
    $("#SlideSelect option:eq(0)").attr('selected', true);
    $(".pm-item-bdImg .del").hide();
    $("#SlideLink").val("");
    var jsonStr = {
        "ecid": ecid,
        "TemplateId": TempID
    }
    $.post("/moduletype/createshelln", jsonStr, function (jsobj) {
        if (jsobj.status == 1) {
            $("#page-content .widget_view_selected[data-elm-type='slide']").attr('data-moduletypeid', jsobj.data.moduleTypeId);
            $("#SlideSelect").change(function () {
                var data = $(this).find("option:selected").attr('data');
                if (data) {
                    var data = data.split(',');
                    if (data[0]) {
                        $("#SlideLink").val(data[0]);
                    }
                    $("#ShowSlideImg").attr("src", data[1]);
                } else {
                    $("#SlideLink").val("")
                    $("#ShowSlideImg").attr("src", "../skin/img/file.png");
                }
            });
            $("#SlideLink").blur(function () {
                if ($(this).val() && $(this).val().indexOf("http://") < 0) {
                    layer.msg('请输入以http://开头链接地址');
                    $("#SlideLink").focus();
                }
                UpdateShellN();
            });
            AutoSave();
        } else {
            layer.msg(data.message);
        }
    }, "json");
}
//导航组件-数据绑定
function initNavigateWidget() {
}
//标题组件-数据绑定
function initTitleWidget() {
}
//链接组件-数据绑定
function initLinkWidget() {
}
//视频组件-数据绑定
function initVideoWidget() {
}
//音频组件-数据绑定
function initAudioWidget() {
}
//文章列表组件-数据绑定
function initArtlistWidget() {
}


//4、校验提交的数据是否合法
function verifydata(type) {
    if (type == 'menu') {
        if (!$("#ShowMenuLan li:eq(0)").hasClass('on')) {
            if ($("#ModuleTypeID").val() == "" || $("#ModuleTypeID").val() == null) {
                layer.msg('请选择功能');
                return false;
            }
        }
        if ($("#MenuName").val() == "" || $("#MenuName").val() == null) {
            layer.msg('请输入菜单名称');
            $("#MenuName").focus();
            return false;
        }
        if ($("#ShowMenuImg").attr('src') == "../skin/img/default-icon.png") {
            layer.msg('请上传菜单图标');
            return false;
        }
    } else {
        var elm_widget_view = $('#page-content .widget_view_selected').attr('data-elm-type');
        var lyt_widget_view = $('#page-content .widget_view_selected').attr('data-lyt-type');
        if (elm_widget_view == "function") {
            if ($("#ModuleTypeID").val() == "" || $("#ModuleTypeID").val() == null) {
                layer.msg('请选择功能');
                return false;
            }
            if ($("#ModuleTypeName").val() == "" || $("#ModuleTypeName").val() == null) {
                layer.msg('请输入备注名称');
                $("#ModuleTypeName").focus();
                return false;
            }
        } else {
            layer.msg('成功');
            $(".pm-config-bd").hide();
            return false;
        }
    }
    return true;
}


//6、替换参数值放到对应的元素上
function SaveFunModule(type, moduleTypeId) {
    layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    
    if (type == 'module') {
        var Moduleid = $("#Moduleid").val();
        var ModuleTypeName = $("#ModuleTypeName").val();
        var BizModuleid = $("#BizModuleid").val();
        var ModuleTypeID = $("#ModuleTypeID").val();
        var WapUrl = $("#ModuleUrl").val();
        var FunTextColor = $("#FunTextColor").val();
        var FunTextSize = $("#FunTextSize").find("option:selected").val();
        var ShowFunImg = $("#ShowFunImg").attr('src');
        var FunBgColor = $("#FunBgColor").val();
        var FunTabVal = $(".FunTab .cur").attr('data-type');
        var ModuleName = $('#FunctionTitle').val();
        var flag = true;
        if ($("#page-content").html() == "" || $("#page-content").html() == null) {
            return false;
        }
        if (!ModuleTypeID || !Moduleid || !ModuleTypeName || !BizModuleid || ShowFunImg == "../skin/img/file.png") {
            layer.closeAll();
            flag = false;
        }
        if (FunTabVal == "0") {
            if (!FunTextSize || !FunTextColor || !FunBgColor) {
                layer.closeAll();
                flag = false;
            }
        }
        if (BizModuleid == null || BizModuleid == "") {
            BizModuleid = 0;
        }
        if (ModuleTypeID == null || ModuleTypeID == "") {
            ModuleTypeID = 0;
        }
        if (flag == false) {
            $("#page-content .widget_view_selected").attr("data", "," + Moduleid + ',' + ModuleTypeID + ',' + ModuleTypeName + ',' + ModuleName + ',' + BizModuleid);
            AutoSave();
            return;
        }
        if (moduleTypeId && moduleTypeId != "undefined") {
            DeleteModleTypeFromTemplate(ecid, moduleTypeId, TempID)
        }
        CreateModuleType(ecid, Moduleid, ModuleTypeName, TempID, BizModuleid, ModuleTypeID, WapUrl, function (data) {
            ModuleUrl = $('#ModuleUrl').val();
            var Moduleid = $('#Moduleid').val();
            var ModuleTypeID = $('#ModuleTypeID').val();
            var Title = $('#ModuleTypeName').val();
            var ModuleName = $('#FunctionTitle').val();
            var BizModuleid = $('#BizModuleid').val();
            var ParentModuleID = $('#parentmoduleid').val();
            var DataVal = "";
            var WapUrl = "";
            var DataUrl = "";
            if (ModuleTypeID == 0) {
                ModuleTypeID = data.data.moduleTypeId;
            }
            if (ParentModuleID == '12') {
                Moduleid = '24';
                DataUrl = data.data.wapUrl + ',' + Moduleid + ',' + ModuleTypeID + ',' + Title + ',' + ModuleName + ',' + BizModuleid;
                if (data.data.wapUrl) {
                    if (data.data.wapUrl.indexOf("?ecid=") < 0) {
                        data.data.wapUrl += "?ecid=" + ecid;
                    }
                    WapUrl = data.data.wapUrl + '&moduletype=' + ModuleTypeID + '&module_type=' + ModuleTypeID;
                }
            } else if (ParentModuleID == '0' && Moduleid == '24') {
                DataUrl = ModuleUrl + ',' + Moduleid + ',' + ModuleTypeID + ',' + Title + ',' + ModuleName + ',' + BizModuleid;
                WapUrl = data.data.wapUrl;
            } else {
                DataUrl = ModuleUrl + ',' + Moduleid + ',' + ModuleTypeID + ',' + Title + ',' + ModuleName + ',' + BizModuleid;
                if (data.data.wapUrl) {
                    if (data.data.wapUrl.indexOf("?ecid=") < 0) {
                        data.data.wapUrl += "?ecid=" + ecid;
                    }
                    WapUrl = data.data.wapUrl + '&moduletype=' + ModuleTypeID + '&module_type=' + ModuleTypeID;
                }
            }
            $("#page-content .widget_view_selected").attr({ 'data': DataUrl, 'wap_url': WapUrl });
            if (FunTabVal == "0") {
                var ImgUrl = $("#page-content .widget_view_selected .pm-mod-box img").attr('src');
                $("#page-content .widget_view_selected .pm-mod-box").html(
                    '<img src=' + ImgUrl + '>' +
                    '<p style="font-size:' + FunTextSize + 'px;color:#' + FunTextColor + '" data-val="' + FunTextColor + '">' + Title + '</p>'
                ).css('backgroundColor', '#' + FunBgColor).attr('data-val', FunBgColor).addClass('funcs');
            }
            $('.pm-normal-text').val('');
            $('.pm-config-bd').hide();
            AutoSave();
        })
    } else if (type = 'menu') {
        //获取当前是第几个菜单
        var id = $("#MenuConfigSelect").find("option:selected").attr('id');
        
        //获取名称
        var Name = $("#moduleName").val();
        var ImgUrl = $("#ShowMenuImg").attr('src');
        var ModuleName = '';
        var ModuleID = $("#Moduleid").val();
        var ModuleTypeID = $("#ModuleTypeID").val();
        var BizModuleid = $("#BizModuleid").val();
        var WapUrl = $("#MenuLink").val();
        var ShowMenuImg = $("#ShowMenuImg").attr('src');
        if (!ModuleTypeID || !ModuleID || !Name || ShowMenuImg == "../skin/img/file.png") {
            layer.closeAll();
            return false;
        }
        if (ModuleID == null || ModuleID == "") {
            ModuleID = 0;
        }
        if (ModuleTypeID == null || ModuleTypeID == "") {
            ModuleTypeID = 0;
        }
        if (BizModuleid == null || BizModuleid == "") {
            BizModuleid = 0;
        }
        if (id) {
            if (ModuleTypeID == 0 && ModuleID != -44) {
                CreateModuleType(ecid, ModuleID, Name, TempID, BizModuleid, ModuleTypeID, WapUrl, function (data) {
                    $("#ModuleTypeID").val(data.data.moduleTypeId);
                    Name = $("#MenuName").val();
                    ModuleID = ModuleID;
                    ImgUrl = $("#ShowMenuImg").attr('src');
                    ModuleTypeID = $("#ModuleTypeID").val();
                    ModuleName = $("#MenuFunction").val();
                    WapUrl = $("#MenuLink").val();
                    if (!WapUrl) {
                        WapUrl = data.data.wapUrl;
                    }
                    var wap_urljson = WapUrl;
                    if (BizModuleid != "146") {
                        if (WapUrl.indexOf("?ecid=") < 0) {
                            WapUrl += "?ecid="+ecid;
                        }
                        wap_urljson = WapUrl + '&moduletype=' + ModuleTypeID + '&module_type=' + ModuleTypeID;
                    }
                    SaveTabbar(id, ecid, ModuleID, ModuleTypeID, Name, ImgUrl, WapUrl, TempID, function (jsobj) {
                        $(".cter-tabbar li.cur").html('<img src="' + ImgUrl + '"/>' + Name).attr({ onclick: jsobj.data.ModuleID + ',' + jsobj.data.ModuleTypeID + ',' + Name + ',' + ImgUrl + ',' + ModuleName + ',' + WapUrl, wap_url: wap_urljson });
                        $("#MenuConfigSelect").find("option:selected").html(Name).attr({ id: id, data: id + "," + ModuleID + ',' + ModuleTypeID + ',' + Name + ',' + ImgUrl + ',' + ModuleName + ',' + WapUrl, value: id });
                    })

                });
            } else {
                SaveTabbar(id, ecid, ModuleID, ModuleTypeID, Name, ImgUrl, WapUrl, TempID, function (jsobj) {
                    ModuleName = $("#MenuFunction").val();
                    WapUrl = $("#MenuLink").val();
                    if (!WapUrl) {
                        WapUrl = jsobj.data.wapUrl;
                    }
                    var wap_urljson = WapUrl;
                    if (BizModuleid != "146") {
                        if (WapUrl.indexOf("?ecid=") < 0) {
                            WapUrl += "?ecid=" + ecid;
                        }
                        wap_urljson = WapUrl + '&moduletype=' + ModuleTypeID + '&module_type=' + ModuleTypeID;
                    }

                    var str = "{0},{1},{2},'{3}','{4}','{5}','{6}',this";
                    var datajson = str.format(jsobj.data.ID, jsobj.data.ModuleID, jsobj.data.ModuleTypeID, Name, ImgUrl, ModuleName, WapUrl);
                    $(".cter-tabbar li.cur").html('<img src="' + ImgUrl + '"/>' + Name).removeAttr("notid").attr({ onclick: 'EditMenu(' + datajson + ')', wap_url: wap_urljson });

                    $(".cter-tabbar li.cur").html('<img src="' + ImgUrl + '"/>' + Name).attr({ data: jsobj.data.ModuleID + ',' + jsobj.data.ModuleTypeID + ',' + Name + ',' + ImgUrl + ',' + ModuleName + ',' + WapUrl, wap_url: wap_urljson });
                    $("#MenuConfigSelect").find("option:selected").html(Name).attr({ id: id, data: id + "," + ModuleID + ',' + ModuleTypeID + ',' + Name + ',' + ImgUrl + ',' + ModuleName + ',' + WapUrl, value: id });
                });
            }
        } else {
            CreateModuleType(ecid, ModuleID, Name, TempID, BizModuleid, ModuleTypeID, WapUrl, function (data) {
                $("#ModuleTypeID").val(data.data.moduleTypeId);
                Name = $("#MenuName").val();
                ModuleID = ModuleID;
                ImgUrl = $("#ShowMenuImg").attr('src');
                ModuleTypeID = $("#ModuleTypeID").val();
                ModuleName = $("#MenuFunction").val();
                WapUrl = $("#MenuLink").val();
                if (!WapUrl) {
                    WapUrl = data.data.wapUrl;
                }
                SaveTabbar(0, ecid, ModuleID, ModuleTypeID, Name, ImgUrl, WapUrl, TempID, function (jsobj) {
                    var wap_urljson = WapUrl;
                    if (BizModuleid != "146") {
                        if (WapUrl.indexOf("?ecid=") < 0) {
                            WapUrl += "?ecid=" + ecid;
                        }
                        wap_urljson = WapUrl + '&moduletype=' + ModuleTypeID + '&module_type=' + ModuleTypeID;
                    }
                    var str = "{0},{1},{2},'{3}','{4}','{5}','{6}',this";
                    var datajson = str.format(jsobj.data.ID, jsobj.data.ModuleID, jsobj.data.ModuleTypeID, Name, ImgUrl, ModuleName, WapUrl);
                    $(".cter-tabbar li.cur").html('<img src="' + ImgUrl + '"/>' + Name).removeAttr("notid").attr({ onclick: 'EditMenu(' + datajson + ')', wap_url: wap_urljson });
                    $("#MenuConfigSelect").find("option:selected").html(Name).attr({ id: jsobj.data.ID, data: jsobj.data.ID + "," + ModuleID + ',' + ModuleTypeID + ',' + Name + ',' + ImgUrl + ',' + ModuleName + ',' + WapUrl, value: jsobj.data.ID });
                })

            });
        }
        return
    }
}
//保存Tabbar
function SaveTabbar(id, ecid, ModuleID, ModuleTypeID, Name, ImgUrl, WapUrl, TempID, successCallback) {
    var jsonStr2 = {
        "ID": id,
        "ECID": ecid,
        "ResourceType": "tabbar_icon",
        "ModuleID": ModuleID,
        "Name": Name,
        "ImgUrl": ImgUrl,
        "ModuleTypeID": ModuleTypeID,
        "WapUrl": WapUrl,
        "TemplateId": TempID
    };
    $.post('/BasicSettings/SaveTabbar', jsonStr2, function (data, status) {
        layer.closeAll();
        if (data.status == 1) {
            successCallback(data);
        } else {
            layer.msg(data.message);
        }
    }, "json");
}
//创建ModuleTypeId
function CreateModuleType(ecid, ModuleID, ModuleTypeName, TempID, BizModuleid, ModuleTypeID, WapUrl, successCallback) {
    var jsonStr = {
        "ECID": ecid,
        "ModuleID": ModuleID,
        "TextName": ModuleTypeName,
        "TemplateId": TempID,
        "BizModuleID": BizModuleid,
        "ModuleTypeID": ModuleTypeID,
        "WapUrl": WapUrl
    };
    $.post('/moduletype/create', jsonStr, function (data, status) {
        layer.closeAll();
        if (data.status == 1) {
            successCallback(data);
        } else {
            layer.msg(data.message);
        }
    }, "json");
}
//删除模板中的模块
function DeleteModleTypeFromTemplate(ecid, moduleTypeId, templateId, callback) {
    var jsonStr = {
        "ECID": ecid,
        "TemplateId": templateId,
        "ModuleTypeID": moduleTypeId,
    };
    $.post('/moduletype/delete', jsonStr, function (data, status) {
        if (callback) {
            callback(data);
        }
    }, "json");
}

//7、生成测试应用
function GenerateTest(type) {
    timestamp = Date.parse(new Date()) / 1000;
    $("#EditOperateTime").val(timestamp);
    $(".pm-Autosave time").html(jsDateDiff(timestamp));
    var TemplateHtml = $("#page-content").html();
    var jsonStr = {
        "ECID": ecid,
        "ID": TempID,
        "TemplateHtml": TemplateHtml
    };
    $.post('/apptemplate/update', jsonStr, function (data, status) {
        if (data.status == 1) {
            layer.closeAll();
            //lf.location = document.referrer;
            if (type) {
                if ($(".pm-post-platform").is(":visible")) {
                    $(".pm-post-platform").hide();
                } else {
                    $(".pm-post-platform").show().find('a').click(function () {
                        var platform = $(this).attr('data-type');
                        CheckTemplate(TempID, platform, null, jsonStr);
                    });
                }
            }
        }
    }, "json");
}



//8、发布到平台
function CheckTemplate(templateId, platform) {
    layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    var jsonStr = {
        ID: templateId,
        Platform: platform,
        ECID: ecid
    };

    $.post('/apptemplate/check', jsonStr, function (data, status) {
        layer.closeAll();
        if (data.status == 1) {
            PublishApp(jsonStr, platform);
        } else {
            needReGenerator = true;
            layer.confirm("确定是否发布到该平台？" + data.message, { icon: 3, title: '提示' }, function (index) {
                PublishApp(jsonStr, platform);
            });
        }
        // success();
    }, "json");
}


//9、发布应用
function PublishApp(batchplatform, platform) {
    $(".adv_list .swiper-wrapper,.adv_list .swiper-pagination").removeAttr('style').empty();
    $(".adv_list .swiper-wrapper").html('<img src="../skin/img/swiper.jpg" style="height:100%">');
    var TemplateHtml = $("#page-content").html();
    var jsonStr = {
        "ECID": ecid,
        "ID": TempID,
        "TemplateHtml": TemplateHtml
    };
    $.ajax({
        type: "post",
        url: "/apptemplate/update",
        data: jsonStr,
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.result == true) {

            }
        }
    });
    layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    $.post('/apptemplate/publish', batchplatform, function (data, status) {
        layer.closeAll();
        if (data.status == 1) {
            if (platform == 1 && needReGenerator) {
                $.getJSON("/ECClientInfo/Check?ecid=" + ecid, null, function (jsobj) {
                    if (jsobj && jsobj.data) {
                        if (jsobj.data.BasicSettingInfo) {
                            window.location.href = "/step3.aspx?ecid=" + ecid;
                        } else {
                            window.location.href = "/step2.aspx?ecid=" + ecid + "&f=step1";
                        }
                    }
                });

            } else {
                layer.msg("新首页内容已经生效");
                window.location.href = "/default.aspx?ecid=" + ecid;
            }
        } else {
            layer.alert(data.message);
        }
    }, "json");
}


//**************************************************工具函数******************************
//返回上一步
function callback() {
    window.history.go(-1);
    //self.location = document.referrer;
}

//有修改时，3秒自动保存操作
function AutoSave(type) {
    if (type) {
        timestamp = $("#EditOperateTime").val();
        $(".pm-Autosave time").html(jsDateDiff(timestamp));
    } else {
        var TagModify = parseInt($("#TagModify").val()) + 1; //有几处修改了
        timestamp = Date.parse(new Date()) / 1000;
        $("#TagModify").val(TagModify);
        $(".pm-Autosave b").html(TagModify + "处未保存");
        $("#EditOperateTime").val(timestamp);
        $(".pm-btn-issued").removeClass("pm-bg-blue").addClass("pm-bg-gray").find('a').unbind("click").attr("onclick", "");
        setTimeout(function () {
            GenerateTest();
            $(".pm-Autosave time").html(jsDateDiff(timestamp));
            $(".pm-Autosave b").html("全部操作已保存");
            $("#TagModify").val("0");
            $(".pm-btn-issued").removeClass("pm-bg-gray").addClass("pm-bg-blue").find('a').unbind("click").attr("onclick", "GenerateTest('module')");
        }, timerSave);
    }
}

//获取页面传递过来的参数
function QueryString(item) {
    var sValue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue
}

//替换函数
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

//HTML转义
encodeHTML = function (source) {
    return String(source)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\/g, '&#92;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
//HTML转义
uncodeHTML = function (source) {
    return String(source)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#92;/g, '\\')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&nbsp;/g, ' ');
};

//时间转换计算方法（从上次修改时间到這次修改时间距离多少）
function jsDateDiff(publishTime) {
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else if (d_hours == 0 && d_minutes == 0) {
        return "刚刚";
    } else {
        var s = new Date(publishTime * 1000);
        return (s.getMonth() + 1) + "-" + s.getDate() + " " + s.getHours() + ":" + s.getMinutes();
    }
}

//空格转义
function InputValueToHtml(str) {
    return str.replaceAll("\r\n", "<br/>").replaceAll(" ", "&nbsp;");
}

function showMenu() {
}

$(window).resize(function () {
    initSwiper();
    DragResponsive();
});

//页面加载完成后1秒再执行
window.onload = function () {
    setTimeout(function () {
        initContainer();
    }, 1000);
}

//适配屏幕宽度
function DragResponsive() {

}

//自动滚动最底部
function AutoScrollBottom() {
    var ph = $("#page-content").height();
    var dh = $("#page-content")[0].scrollHeight;
    if (dh > ph) {
        $("#page-content").animate({ scrollTop: dh }, 300);
    }
}


String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] == undefined) {
                    args[key] = "";
                }
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    arguments[i] = "";
                }
                var reg = new RegExp("({)" + i + "(})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }
    }
    return result;
}