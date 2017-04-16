(function ($, win) {
    var oDiy = {
        getTemplateDetail: function (tid, cb) {
            Request.ajax({
                url: _aConfig.getTemplateDetailUrl,
                data: {id: tid},
                success: function (oData) {
                    cb(oData);
                }
            });
        },
        init: function () {
            self.getTemplateDetail(_aConfig.templateId, function (aData) {
                if (aData.status == 1) {
                    _initTemplate(aData.data);
                    _setDrag();
                    _acceptDrag();
                    bindEvent();
                }

            });

        },
        buildUploadBtn: function ($dom, cb) {
            _buildUploadBtn($dom, cb);
        },
        showSlide: function () {
            _showSlide();
        },
        showInitSwiper: function (isFunction) {
            if (isFunction == undefined) {
                isFunction = false;
            }
            initSwiper(isFunction);
        },
        saveNav:function(){
            _saveNav();
        },
        delSilder:function(){
            oDiyCommon.confirm('确定删除该幻灯片','提示',function(o){
               var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
                var xlist = $swiper.data('url_list');
                var index = $('#SlideSelect').find("option:selected").val();
                var link = $('#SlideLink').val();

                var aList = [];
                if (xlist != undefined) {
                    aList = xlist;
                }
                for (var i in aList) {
                    if (aList[i] !== null && aList[i].index == index) {
                        delete aList[i];
                    }
                }      
                $swiper.attr('data-url_list',JSON.stringify(aList));
                oDiy.showSlide();
                $('#SlideSelect').val(0);                
                o.close();
                layer.msg('删除成功');
                AutoSave();
            });
        },
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        }
    };
    function _initTemplate(aData) {
        $("#page-content").html(aData.template_html);
        if(aData.title_name ==''){
            aData.title_name = '北斗系统';
        }
        $('.cter-navigation').text(aData.title_name);
        if(aData.title_background ==''){
            aData.title_background = '#eee';
        }
        $('#NavBgVal').val(aData.title_background);
        if(aData.title_style_type == 1){
            var Elm = $('.NavTab a:eq(1)').index();
            $(".pm-item-NavConfig").hide();
            $('.NavTab a:eq(1)').addClass('cur').siblings().removeClass('cur');
            $(".pm-item-NavConfig:eq(" + Elm + ")").show();
            $('.cter-navigation').empty().append('<img src="'+ aData.title_img +'" />');
            if(aData.title_img == ''){
                aData.title_img = App.url.resource + '/vender/diy/img/file.png';
            }
            $('#ShowNavImg').attr('src',aData.title_img);
        }
        $('#NavText').val(aData.title_name);
        if(aData.title_color ==''){
            aData.title_color = '#888';
        }
        $('#NavTextColor').val(aData.title_color);
        if(aData.title_font_size ==''){
            aData.title_font_size = 16;
        }
        $('#TextSize').val(aData.title_font_size);
         //设置标题
        $('.cter-navigation').css({backgroundColor:'#'+aData.title_background,color:'#'+aData.title_color,fontSize:aData.title_font_size+'px'});
        if (aData.is_open_title == 0) {
            $("#navibar .pm-switch-bd").removeClass('pm-switch-off').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
            $("#page-content").css('height', $("#page-content").height() - 40);
            $('.cter-navigation').show();
        } else {
            $("#navibar .pm-switch-bd").removeClass('pm-switch-on').addClass('pm-switch-off').next('.pm-switch-tips').html('隐藏');
            $("#page-content").css('height', $("#page-content").height() + 40);
            $('.cter-navigation').hide();
        }

        if (aData.is_open_nav == 0) {
            $("#ConfigMenu .pm-switch-bd").removeClass('pm-switch-off').addClass('pm-switch-on').next('.pm-switch-tips').html('显示');
            $("#page-content").css('height', $("#page-content").height() - 40);
            $('.cter-tabbar').show();
        }
        if(aData.nav_background ==''){
            aData.nav_background = '#eee';
        }
        $('#TabbarBgVal').val(aData.nav_background);
        if(aData.nav_font_color ==''){
            aData.nav_font_color = '#888';
        }
        $('#TabbarFontVal').val(aData.nav_font_color);
         //设置导航
        $('.cter-tabbar').css({backgroundColor:'#'+aData.nav_background,color:'#'+aData.nav_font_color,fontSize:aData.nav_font_size+'px'});
        var oNav = jQuery.parseJSON(aData.nav_text);
        $('#MenuNumber').val(aData.nav_nums);
        if(oNav == undefined || oNav == null){
            CreateMenu(0);
            _setNavSlider(0);
            _bindNavEvent();
            return;
        }
        var html = '';
        var menuHtml = '';
        //底部菜单
        for (var i in oNav) {
            if(oNav[i]!=null && oNav[i]!=undefined){
                html += '<option value="' + oNav[i].index + '" class="not" data-icon="' + oNav[i].icon + '" data-wap_url="'+ oNav[i].url +'" data-fun_name="'+ oNav[i].fun_name +'" data-fun_id="'+ oNav[i].fun_id +'">' + oNav[i].name + '</option>';
                menuHtml += ("<li class='notid'\"><img src='" + oNav[i].icon + "'>" + oNav[i].name + "</li>");
            }
        }
        $('#MenuConfigSelect').empty().append(html);
        $(".cter-tabbar ul").empty().append(menuHtml).find("li.notid:first").addClass("cur").trigger("click");
        _setNavSlider(oNav.length);
        _bindNavEvent();
        //CreateMenu(oNav.length,Data);       
    }

    function _setNavSlider(nums) {
        //4、菜单---数量
        $(".MenuNumberSlider").slider({
            range: "min",
            min: 1,
            max: 5,
            value: nums,
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
    }

    function _setNavEvent() {

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
            oPlugIn.InitialColorSetting("TabbarBgSelect", "tabbar_bgcolor", $(this).val(), "cter-tabbar");
        });

        //6、菜单---设置菜单文字颜色值
        $("#TabbarFontVal").blur(function () {
            oPlugIn.InitialColorSetting("TabbarFontSelect", "tabbar_fontcolor", $(this).val(), "cter-tabbar");
        });


        //9、输入功能名称自动提交
        $("#MenuName").keyup(function () {
            if ($(this).val() != "首页") {
                $("#MenuConfigSelect").find("option:selected").text($(this).val());
                var index = $('#MenuConfigSelect ooption:selected').index();
                var $img = $('.cter-tabbar ul li:eq('+ index +')').find('img');
                $('.cter-tabbar ul li:eq(' + index + ')').empty().append([$img,$(this).val()]);
            }
            _saveNav();
        });
    }
    /**
     * 顶部导航区
     */
    function _setTopNavEvent() {
        $(".pm-phoneframe-bd").delegate(".cter-navigation", "click", function (e) {
            $("#ConfigMenuTab li").removeClass('on');
            $("#ConfigMenuTab li:eq(0)").addClass('on');
            $('.pm-config-bd,#ConfigNav').show();
            $("#Configuration,#ConfigMenu").hide();
        });

        $("#ConfigNav").delegate(".NavTab a", "click", function (e) {
            var Elm = $(this).index();
            $(".pm-item-NavConfig").hide();
            $(this).addClass('cur').siblings().removeClass('cur');
            $(".pm-item-NavConfig:eq(" + Elm + ")").show();
            if (Elm == 0) {
                SetNaviBar("navibar_font", "0");
                $('.cter-navigation').empty().append($('#NavText').val());
            } else {
                SetNaviBar("navibar_img", "0");
                var src = $('#ShowNavImg').attr('src');
                if(src.indexOf('file.png') == -1){
                    $('.cter-navigation').empty().append('<img src="'+ src +'" />');
                }                
            }
            
        });
        //1、导航---设置状态
        $("#navibar").delegate(".pm-switch-bd", "click", function (e) {
            var State = 0;
            if (!$(this).hasClass('pm-switch-off')) {
                State = 1;
            }
            SetResource("navibar", State);
        });
        $('#NavBgVal').blur(function () {
            oPlugIn.InitialColorSetting("NavBgSelect", "navibar_bgcolor", $(this).val(), "cter-navigation");
        });

        $('#NavTextColor').blur(function () {
            $(".cter-navigation").css('color', $(this).val());
            CreateImage();
            oPlugIn.InitialColorSetting("NavTextSelect", "navibar_fontcolor", $(this).val(), "cter-navigation");
        });

        $('#NavText').blur(function () {
            $(".cter-navigation").html($(this).val());
            CreateImage();
        });

        $('#TextSize').change(function () {
            $(".cter-navigation").css('font-size', $(this).val() + 'px');
            CreateImage();
        });

    }
    //设置导航是图片还是文字
    function SetNaviBar(ResourceType, State) {
        var oData = {
            resourceType: ResourceType,
            id: _aConfig.templateId,
            status: State
        };
        Request.ajax({
            url: _aConfig.updateTempateTitleTypeUrl,
            data: oData,
            success: function (aData) {
                layer.closeAll();
                if (aData.status == 1) {
                    //$(".cter-navigation img").attr('src', aData.data);
                }
            }
        });
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
            var oData = {
                id: _aConfig.templateId,
                title_name: Text,
                title_color: "#" + TextColor,
                title_font_size: TextSize
            };

            Request.ajax({
                url: _aConfig.updateTempateTitleUrl,
                data: oData,
                success: function (aData) {
                    layer.closeAll();
                    if (aData.status == 1) {
                        $(".cter-navigation img").attr('src', aData.data);
                    }
                }
            });
        }
    }
    function _initColorSelect() {
        oPlugIn.InitialColorSelect("NavBgSelect", "navibar_bgcolor", "NavBgVal", $("#NavBgVal").val(), "cter-navigation");//初始化顶部导航背景颜色
        oPlugIn.InitialColorSelect("NavTextSelect", "navibar_fontcolor", "NavTextColor", $("#NavTextColor").val(), "cter-navigation");//初始化顶部导航文字颜色
        oPlugIn.InitialColorSelect("TabbarBgSelect", "tabbar_bgcolor", "TabbarBgVal", $("#TabbarBgVal").val(), "cter-tabbar");//初始化底部菜单背景颜色
        oPlugIn.InitialColorSelect("TabbarFontSelect", "tabbar_fontcolor", "TabbarFontVal", $("#TabbarFontVal").val(), "cter-tabbar");//初始化底部菜单文字颜色

        oPlugIn.InitialColorSelect("FunBgSelect", "fun_bgcolor", "FunBgColor", $("#FunTextColor").val(), "funcs");//初始化功能区域-功能背景颜色
        oPlugIn.InitialColorSelect("FunTextSelect", "fun_fontcolor", "FunTextColor", $("#FunBgColor").val(), "funcs");//初始化功能区域-功能文字颜色
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

        oDiyCommon.confirm('确认要' + StateText + ResourceText + '?', '提示', function (oLayer) {
            var type = (ResourceType == 'tabbar') ? 1 : 0;
            ajax({
                url: _aConfig.updateTempateStatusUrl,
                data: {type: type, id: _aConfig.templateId, status: State},
                success: function (aData) {
                    oLayer.close();
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
    function _buildUploadBtn($dom, cb) {
        $dom.AjaxUpload({
            uploadUrl: _aConfig.uplodImageUrl,
            fileKey: 'image',
            isUploadEnable: function (o) {
                return true;
            },
            callback: function (aResult) {
                if (aResult.status == 1) {
                    cb(aResult.data);
                } else {
                    UBox.show(aResult.msg, aResult.status);
                }
            }
        });
    }

    function _bindUploadImageBtn() {
        //上传资源图片
        $(".pm-item-bdImg .edit").unbind('click').click(function () {
            var src = $(this).parent().parent().find('.pm-item-uploadImg img').attr('src');
            var resource = $(this).parent().parent().find('.pm-item-uploadImg').attr('data-resource');
            //界面显示完成之后执行设置回调
            oPlugIn.showPlugInImageSelect({src: src}, function () {
                _buildUploadBtn($('.J-plugin-ImgUpload'), function (data) {
                    //设置表单文件路径
                    $('.J-ImgUpload-name').val(data.name);
                    $('.J-ImgUpload-showImage img').attr('src', data.path);
                    $('.J-ImgUpload-showImage img').attr('data-id', data.id);
                    $('.J-plugin-ImgUpload').find('input[name="vender_image_url"]').val(data.path);

                });
            });
            $('.J-ImagesListCategoryGroup li').click(function () {
                $(this).closest('ul').find('li').removeClass('cur');
                $(this).addClass('cur');
                var id = $(this).attr('id');
                var isPublic = (id == 2) ? 1 : 0;
                oPlugIn.getImageCategoryList(0, isPublic, function (aData) {
                    if (aData.status == 1) {
                        oPlugIn.buildImagePuInHtmlByIsPublic(isPublic, aData);
                    }
                });
                console.log(id);
            });
        });
    }
    //拖拽
    function _setDrag() {
        //2、功能---拖动布局
        $(".pm-lyt-drag .pm-mod-md").draggable({
            connectToSortable: "#page-content",
            helper: function () {//跟随鼠标移动的对象
                var cloneDiv = $(this).clone();
                $("#page-content .pm-mod-md").removeClass("widget_view_selected");
                return cloneDiv;
            },
            revert: "invalid",
            stop: function (e, t) {
                _acceptDrag();
                //initContainer('lyt');
                showcomponents();
                if ($("#page-content").children(".pm-mod-md").length <= 1) {
                    //DottedLine();
                }

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
                _acceptDrag();
                //initContainer('column');
                showcomponents();
                $("#page-content .pm-mod-hd").remove();
            }
        });
    }
    //拖动布局顺序
    function _acceptDrag() {
        $("#page-content").sortable({//拖动布局
            connectWith: "#page-content", //允许sortable对象连接另一个sortable对象，可将item元素拖拽到另一个中.(类型：Selector)
            opacity: .35,
            handle: ".pm-mod-bd", //限制排序的动作只能在item元素中的某种元素 如 handle: ‘h2′
            //释放时
            receive: function (e, ui) {
                //获取当前（被拖动的）是第几栏的布局
                var data_lyt_type = $(ui.item).attr("data-lyt-type");
                //l1 单栏 l2 2栏 l3 3栏 l4 四栏 l5 混合 l8 分割线
                var values = "";
                $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#SetFunction,#SetNoteName").hide();
                //功能项目展开
                $("#Configuration,.pm-config-bd").show();
                //高亮右侧选项卡
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
                //AutoScrollBottom();
                //自动保存
                 AutoSave();
            },
            update: function (e, ui) {
            },
            cursor: 'move', //鼠标样式
            opacity: 0.8 //拖拽时透明
        });
        $("#page-content .pm-column").sortable({//拖动元素
            connectWith: ".pm-column", //允许sortable对象连接另一个sortable对象，可将item元素拖拽到另一个中.(类型：Selector)
            opacity: .35,
            handle: ".pm-mod-bd", //限制排序的动作只能在item元素中的某种元素 如 handle: ‘h2′
            //释放时
            receive: function (e, ui) {
                if ($(this).find(".pm-mod-md").length > 1) {
                    $(this).find(".widget_view_selected").remove();
                } else {
                    //获取当前元素是那种类型元素 如text  image button
                    var data_elm_type = $(ui.item).attr("data-elm-type");
                    $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#SetFunction,#SetNoteName").hide();
                    $("#Configuration,.pm-config-bd").show();
                    $("#ConfigMenuTab li:eq(1)").addClass('on').siblings().removeClass('on');
                    if (data_elm_type) {
                        //根据元素类型不同显示不同设置选项
                        $(".pm-config-bd .pm-item-box[data-type=" + data_elm_type + "]").show();
                        $('#wapurl,#ModuleTypeName,#ModuleUrl').val('');
                        $('#FunctionTitle').val('请选择功能');
                        $('.pm-item-uploadImg').find('img').attr('src', App.url.resource + '/vender/diy/img/file.png');
                        //如果是功能弹窗功能选择层
                        if (data_elm_type == 'function' || data_elm_type == 'module') {
                            $(".pm-item-fun").show();
                            $(".FunTab a:eq(0)").addClass('cur').siblings().removeClass('cur');
                            //弹窗功能选择
                            //Global.PlugIn(data_elm_type);
                        } else if (data_elm_type == 'button') {
                            LayoutBasis(data_elm_type);
                        }else if(data_elm_type == 'video'){
                            var html = $("#page-content .widget_view_selected .J-videoDocker").attr('data-code');
                            $('.J-videoCode').empty().val('').show();
                        }
                        loadData(data_elm_type);
                    }
                    //AutoScrollBottom();
                    AutoSave();
                }
            },
            update: function (e, ui) {
            },
            cursor: 'move', //鼠标样式
            opacity: 0.8 //拖拽时透明
        });
    }

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
        _bindSildeEvent();
        $("#SlideLink").blur(function () {
            if ($(this).val() && $(this).val().indexOf("http://") < 0) {
                layer.msg('请输入以http://开头链接地址');
                return $("#SlideLink").focus();
            }
            AutoSave();
        });
        $("#SlideSpeed").change(function () {
            var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
            $swiper.attr('data-slide_speed', $(this).val());
        });
        $("#ShowSlideImg").attr('src', App.url.resource + '/vender/diy/img/swiper.jpg');
        //$("#SlideSelect").find("option").attr("value", "0").removeAttr('data');
        $("#SlideSelect option:eq(0)").attr('selected', true);
        //$(".pm-item-bdImg .del").hide();
        $("#SlideLink").val("");
        //当前选中的组件
        var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
        var olist = $swiper.data('url_list');
        var index = $('#SlideSelect').find("option:selected").val();
        if (olist == undefined || olist.length == 0) {
            $("#SlideLink").val("")
            $("#ShowSlideImg").attr("src", App.url.resource + "/vender/diy/img/file.png");
            return;
        }
        //给相应的
        for (var i in olist) {
            if (olist[i].index == index) {
                $swiper.find('img').attr('src', olist[i].url);
                $('#ShowSlideImg').attr('src', olist[i].url);
                $('#SlideLink').val(olist[i].link);
            }
        }
        showSlide();
        AutoSave();
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
    function initSwiper(moduletypeid) {
        if (moduletypeid) {
            if ($('.pm-mod-md .swiper-wrapper .swiper-slide').size() > 1) {
                mySwiper = new Swiper('.pm-plugin-funView .swiper-container', {
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
//加载轮播图
    function _showSlide() {
        $.each($("#page-content .pm-mod-md[data-elm-type='slide']"), function () {
            var $swiper = $(this).find('.swiper-wrapper');
            var olist = $swiper.data('url_list');
            if (olist == undefined || olist.length == 0) {
                //$("#ShowSlideImg").attr("src", App.url.resource + "/vender/diy/img/file.png");
                return;
            }
            var advHtml = '';
            //给相应的
            for (var i in olist) {
                if(olist[i] == null){
                    continue;
                }
                if (olist[i].link) {
                    advHtml += "<div class='swiper-slide'>" +
                            "<a href='javascript:;' onclick='showMenu(this);' data-wap_url='" + olist[i].link + "'><img src='" + olist[i].url + "'></a>" +
                            "</div>"
                } else {
                    advHtml += "<div class='swiper-slide'>" +
                            "<a href='javascript:;'><img src='" + olist[i].url + "'></a>" +
                            "</div>";
                }
            }
            $(this).find('.adv_list .swiper-wrapper').html(advHtml);
            initSwiper();
            $("#page-content .adv_list a").click(function () {
                return false;
            });
        });
    }

    function bindEvent() {
        _setTopNavEvent();
        _setNavEvent();
        _setEditor();
        _bindUploadImageBtn();
        _bindCompontEvent();
        _initColorSelect();
        showcomponents();
        removeElm();
        _bindVedioEvent();
        //右侧切换Tab
        $("#ConfigMenuTab li").unbind('click').click(function () {
            $("#ConfigMenuTab li").removeClass('on');
            $(this).addClass('on');
            var index = $("#ConfigMenuTab li").index(this);
            //底部菜单
            if (index == 2) {
                //设置菜单
                $('#Moduleid').val('-44');
                $('#ModuleTypeID').val('0');
                $("#MenuName").attr('readonly', 'readonly').val('首页');
                $('#ShowMenuImg').attr('src', App.url.resource + '/vender/diy/img/file.png');
            }
            $(".pm-config-bd .modal-config-box,#configure").hide();
            $(".pm-config-bd .modal-config-box:eq(" + index + ")").show();
        });

        $("#ModuleTypeName").blur(function () {
            $("#page-content .widget_view_selected .pm-mod-box").find('p').text($('#ModuleTypeName').val());
            AutoSave();
        });
        
        $("#ModuleUrl").blur(function () {           
            if ($(this).val() && $('#FunctionTitle').val() != '电话' && ($(this).val().indexOf("http://") < 0 && $(this).val().indexOf("https://") < 0)) {
                layer.msg('请输入以http://或者https://开头链接地址');
                return $(this).focus();
            }
            if($('#FunctionTitle').val() == '电话'){
                $("#page-content .widget_view_selected").attr('data-wap_url', 'tel:'+$(this).val());
            }else{
                $("#page-content .widget_view_selected").attr('data-wap_url', $(this).val());
            }
            AutoSave();
        });
        
        $("#MenuLink").blur(function () {           
            if ($(this).val()  && $('#MenuFunction').val() != '电话' &&  ($(this).val().indexOf("http://") < 0 && $(this).val().indexOf("https://") < 0)) {
                layer.msg('请输入以http://或者https://开头链接地址');
                return $(this).focus();
            }
            if($('#MenuFunction').val() == '电话'){
                $('#MenuConfigSelect option:selected').attr('data-wap_url', 'tel:'+$(this).val());
            }else{
                $('#MenuConfigSelect option:selected').attr('data-wap_url',$(this).val());
            }            
            _saveNav();
            AutoSave();
        });

        $("#FunTextColor").blur(function () { //设置功能文字颜色
            $("#page-content .widget_view_selected").attr('data-text_color', $(this).val());
            oPlugIn.InitialColorSetting("FunTextSelect", "fun_fontcolor", "#" + $(this).val(), "funcs");
        });

        $("#FunBgColor").blur(function () { //设置功能背景颜色
            $("#page-content .widget_view_selected").attr('data-bg_color', $(this).val());
            oPlugIn.InitialColorSetting("FunBgSelect", "data-fun_bgcolor", "#" + $(this).val(), "funcs");
        });

        $('#FunTextSize').change(function () {
            $("#page-content .widget_view_selected").attr('data-font_size', $(this).val());
            $("#page-content .widget_view_selected .pm-mod-box").find('p').css('font-size', $(this).val());
            AutoSave();
        });

        $("#Configuration").delegate(".FunTab a", "click", function (e) {
            var Elm = $(this).attr('data-type');
            var FontSize = $("#FunTextSize").find('option:selected').val();
            var FunColor = $("#FunTextColor").val();
            var BgColor = $("#FunBgColor").val();
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#page-content .widget_view_selected").attr('data-fun-type', Elm);
            //文字
            if (Elm == "0") {
                $("#SetFunStyle").show();
                var phtml = $("#page-content .widget_view_selected .pm-mod-box").find("p");
                var ModuleTypeName = $("#ModuleTypeName").val();
                $("#page-content .widget_view_selected .pm-mod-box").addClass('funcs').css('backgroundColor', '#' + BgColor).attr('data-val', BgColor).find('p').css({fontSize: FontSize + 'px', color: '#' + FunColor}).attr('data-val', FunColor).show();
                if (phtml.length == 0) {
                    $("#page-content .widget_view_selected .pm-mod-box").append("<p style='color:#" + FunColor + ";font-size:" + FontSize + "px;' data-val=" + FunColor + ">" + ModuleTypeName + "</p>");
                }
            } else {
                //图片
                $("#SetFunStyle").hide();
                $("#page-content .widget_view_selected .pm-mod-box").removeClass('funcs').removeAttr('style').find('p').hide();
            }
            AutoSave();
        });

        //点击界面元素
        $("#page-content").delegate(".pm-column .pm-mod-md", "click", function (e) {
            var data = $(this);
            var elm_type = data.attr("data-elm-type");
            //隐藏全部功能面板
            $(".pm-config-bd .pm-item-box,#ConfigNav,#ConfigMenu,#configure,#SetFunction,#SetNoteName").hide();
            //找到显示相应功能面板
            $(".pm-config-bd,.pm-config-bd .pm-item-box[data-type=" + elm_type + "],#Configuration").show();
            $('#page-content .pm-mod-md').removeClass('widget_view_selected');
            data.addClass('widget_view_selected');
            //高亮功能区域
            $("#ConfigMenuTab li").removeClass('on');
            $("#ConfigMenuTab li:eq(1)").addClass('on');
            //点击的是图片
            if (elm_type == 'image') {
                var ImgUrl = $(this).find('img').attr('src');
                //设置右侧功能模块url
                $('#ShowPicImg').attr('src', ImgUrl);
            } else if (elm_type == 'text') {
                editor.html($(this).text());
            } else if (elm_type == "button") {
                var $button = $(this).find('.pm-mod-box a');
                var w = $button.width();
                var pw = $button.closest('div').width();
                var h = $button.height();
                var text = $button.text();
                var className = $button.attr('class');
                var link = $button.attr('data-wap_url');
                $('#ButtonLink').val(link);
                $('#ButtonConfig ul li[data-val="' + className + '"]').click();
                $('#ButtonText').val(text);
                LayoutBasis(elm_type);
            } else if (elm_type == "title") {
                var title = $(this).find('.pm-mod-title h2').text();
                //修改文案
                $('#TitleText').val(title);
                $(".pm-item-box[data-type=" + elm_type + "]").find('.pm-mod-title h2').html(title);
                //自动选中当前样式
                var className = $(this).find('.pm-mod-title h2').closest('div').attr('class');
                $(".pm-item-box[data-type=" + elm_type + "] ").find('li[data-tag="' + className + '"]').click();
            } else if (elm_type == 'slide') {
                var SlideSelectHtml = "";
                for (var i = 0; i < 5; i++) {
                    SlideSelectHtml += ('<option value="' + i + '">第' + (i + 1) + '张</option>');
                }
                $("#SlideSelect").html(SlideSelectHtml);
                $("#SlideSelect").find('option:first').trigger("change");
                $("#BannerConfig .pm-item-editImg .del").show();
                $("#ShowSlideImg").attr('src', ImgUrl);
                var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
                $("#SlideSpeed").val($swiper.data('data-slide_speed'));
                _bindSildeBySelect();
                _bindSildeEvent();
                
            } else if (elm_type == "module") {
                $('#SetFunction,#SetNoteName').show();
                var ImgUrl = $(this).find('img').attr('src');
                if (ImgUrl.indexOf('default-focus.png') != -1) {
                    $('.pm-item-uploadImg[data-resource=' + elm_type + '] img').attr('src', App.url.resource + '/vender/diy/img/file.png');
                } else {
                    $('.pm-item-uploadImg[data-resource=' + elm_type + '] img').attr('src', ImgUrl);
                }
                //设置参数
                var url = $("#page-content .widget_view_selected").attr('data-wap_url');
                var name = $("#page-content .widget_view_selected").attr('data-name');
                var id = $("#page-content .widget_view_selected").attr('data-id');
                var funTitle = '请选择功能';
                if(name == undefined){
                    name = '';
                }else{
                    funTitle = name;
                }
                $('#ModuleTypeName').val(name);
                $('#FunctionTitle').val(funTitle);
                if (url == undefined) {
                    url = '';
                }
                $('#CustomLink').find('.pm-item-label.pm-clr-aaa').html('功能链接');
                $('#ModuleUrl').attr('placeholder','请输入链接地址，以http://或者https://开头');
                if(id == 1){
                   $('#CustomLink').show().find('#ModuleUrl').removeAttr('readonly').val(url); 
                }else if(id == 5){
                    $('#ModuleUrl').attr('placeholder','请输入电话号码');
                    $('#CustomLink').find('.pm-item-label.pm-clr-aaa').html('请输入号码');
                    $('#CustomLink').show().find('#ModuleUrl').removeAttr('readonly').val(url.replace('tel:','')); 
                }else{
                    $('#CustomLink').show().find('#ModuleUrl').attr('readonly', 'readonly').val(url);
                }

                var funtype = $("#page-content .widget_view_selected").attr('data-fun-type');
                if (funtype == "0" || funtype == "" || funtype == undefined) {
                    $(".FunTab a:eq(0)").addClass('cur').siblings().removeClass('cur');
                    $("#SetFunStyle").show();
                } else {
                    $(".FunTab a:eq(1)").addClass('cur').siblings().removeClass('cur');
                    $("#SetFunStyle").hide();
                }
                var bgColor = $("#page-content .widget_view_selected").attr('data-bg_color');
                if (bgColor == undefined) {
                    bgColor = '';
                }
                var fontColor = $("#page-content .widget_view_selected").attr('data-text_color');
                if (fontColor == undefined) {
                    fontColor = '';
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

            }else if(elm_type == 'video'){
                var html = $("#page-content .widget_view_selected .J-videoDocker").attr('data-code');
                if(html == undefined){
                    $('.J-videoCode').empty().val('').show();
                }else{
                    $('.J-videoCode').empty().val(html).show();
                }
            }
        });
    }
    
    function _bindVedioEvent(){
        $('.J-videoCode').blur(function(){
            var html = $(this).val();
            var $selectDom = $("#page-content .widget_view_selected .J-videoDocker");
            if(html == ''){
                return;
            }
            var $html = $('<div>' + html + '</div>');
            $html.find(':first').removeAttr('width');
            if($html.find(':first')[0].tagName != 'EMBED'){
                //return layer.msg('视频地址必须以embed开头，请填写html5的播放代码')
            }
            $html.find(':first').attr('wmode',"transparent");
            $html.find(':first').css({width:'100%'});
            $selectDom.attr('data-code',$html.html());
            $('<div class="J-videoTemp"/>').appendTo($html);
            $selectDom.empty().append($html.html());
        });
    }
    
    function _bindSildeBySelect() {
        var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
        var olist = $swiper.data('url_list');
        var index = $('#SlideSelect').find("option:selected").val();
        $("#SlideLink").val("");
        $("#ShowSlideImg").attr("src", App.url.resource + "/vender/diy/img/file.png");
        //给相应的
        for (var i in olist) {
            if (olist[i] != null && olist[i].index == index) {
                $('#ShowSlideImg').attr('src', olist[i].url);
                $('#SlideLink').val(olist[i].link);
                if (index == 0 && $('#ShowSlideImg').attr('src') == '') {
                    $("#ShowSlideImg").attr('src', App.url.resource + '/vender/diyfile.png');
                    $("#BannerConfig .pm-item-editImg .del").hide();
                }
            }
        }
    }

    function _updateSliderLink(){
        var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
        var xlist = $swiper.data('url_list');
        var index = $('#SlideSelect').find("option:selected").val();
        var link = $('#SlideLink').val();
        
        var aList = [];
        if (xlist != undefined) {
            aList = xlist;
        }
        for (var i in aList) {
            if (aList[i] !== null && aList[i].index == index) {
                aList[i].link = link;
            }
        }      
        $swiper.attr('data-url_list',JSON.stringify(aList));
        oDiy.showSlide();
        AutoSave();
    }
    function _bindSildeEvent() {
        $("#SlideSelect").change(function () {
            _bindSildeBySelect();
        });
       
        $(".pm-item-bdImg .del").unbind('click').click(function () {
            var sliderId = $('#SlideSelect').find("option:selected").val();
        });

        $("#SlideLink").blur(function () { 
            _updateSliderLink();
            if ($(this).val() && $(this).val().indexOf("http://") < 0) {
                layer.msg('请输入以http://开头链接地址');
                $(this).focus();
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
        //删掉布局显示
        $('#page-content').find(".pm-mod-hd").remove();
    }
    function _bindCompontEvent() {
        //按钮组件样式选择&文字输入&宽&高
        $("#ButtonText").bind('keyup', function () {
            $("#page-content .widget_view_selected  .pm-mod-button a").html($("#ButtonText").val());
        });
        $("#ButtonLink").bind('keyup', function () {
            var link = $("#ButtonLink").val();
            if (link == 'javascript:;') {
                return;
            }
            if (!/^((https|http)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(link)) {
                return;
            }
            $("#page-content .widget_view_selected  .pm-mod-button a").attr('data-wap_url', link);
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
            $("#page-content .widget_view_selected  .pm-mod-button a").css({'height': height + 'px', 'lineHeight': height + 'px'});
        });
        $(".pm-button-style li").click(function () {
            var type = $(this).attr('data-val');
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#page-content .widget_view_selected .pm-mod-button a").removeClass().addClass('' + type + '');
            AutoSave();
        });

        //标题组件样式选择&文字输入
        $("#TitleText").bind('keyup', function () {
            var titleName = $("#TitleText").val();
            $("#page-content .widget_view_selected  .pm-mod-title h2").html(titleName);
            $("#TitleConfig .pm-mod-title h2").html(titleName);
            AutoSave();
        });
        $(".pm-title-style li").click(function () {
            var type = $(this).attr('data-val');
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#page-content .widget_view_selected .pm-mod-title").removeClass().addClass('pm-mod-title ' + type + '');
            AutoSave();
        });
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
                //菜单数量减少
                $(".cter-tabbar ul li:not(':first')").remove();
                $("#MenuConfigSelect option:not(:first)").remove();
                for (var i = 1; i < num; i++) {
                    optionHtml += ("<option value='" + (i + 1) + "' class='not'>菜单" + (i + 1) + "</option>");
                    menuHtml += ("<li class='notid' \"><img src='" + App.url.resource + "/vender/diy/img/icon_blank.png'>菜单" + (i + 1) + "</li>");
                }
                $("#MenuConfigSelect").append(optionHtml);
                $(".cter-tabbar ul").append(menuHtml).find("li.notid:first").addClass("cur").trigger("click");
                $("#MenuNumber").val(num);
            } else {
                //加菜单
                for (i = MenuNum; i < num; i++) {
                    optionHtml += ("<option value='" + (i + 1) + "' class='not'>菜单" + (i + 1) + "</option>");
                    menuHtml += ("<li class='notid'><img src='" + App.url.resource + "/vender/diy/img/icon_blank.png'>菜单" + (i + 1) + "</li>");
                }
                if ($("#MenuConfigSelect").find("option:selected").index() == 0) {
                    $('#MenuName,#MenuFunction').val('首页');
                    $('#ShowMenuImg').attr('src', App.url.resource + '/vender/diy/img/m_home_icon.png');
                } else {
                    $('#MenuName').val('菜单');
                    $('#MenuFunction').val('选择功能');
                    $('#ShowMenuImg').attr('src', App.url.resource + '/vender/diy/img/file.png');
                }
                $("#MenuConfigSelect").append(optionHtml);
                $(".cter-tabbar ul").append(menuHtml).find("li.notid:first").addClass("cur").trigger("click");
                $("#MenuNumber").val(num);
            }
        } else {
            $("#MenuNumber").val(MenuNum);
        }

        
    }
    
    function _bindNavEvent() {
        $("#MenuFunction").click(function(){
            var name = $('#MenuConfigSelect option:selected').text();
            if(name =='首页'){
                return;
            }
            oPlugIn.showPlugInFunction();
        });
        
        $('.J-tabbarFontSize').change(function(){
            var font_size = $('.J-tabbarFontSize').val();
            $('.cter-tabbar li').css({fontSize:font_size+'px'});            
            ajax({
                url: _aConfig.saveTempateNavUrl,
                data: {
                    id: _aConfig.templateId,
                    font_size: font_size,
                },
                success: function (aData) {                    
                    console.log(aData);
                }
            });
        });
        $("#MenuConfigSelect").change(function () {
            //获取当前情况
            var MenuSelectVal = $("#MenuConfigSelect").find("option:selected").val();
            var MenuSelectText = $("#MenuConfigSelect").find("option:selected").text();
            var icon = $("#MenuConfigSelect").find("option:selected").attr('data-icon');
            var funName = $("#MenuConfigSelect").find("option:selected").attr('data-fun_name');
            var wapUrl = $("#MenuConfigSelect").find("option:selected").attr('data-wap_url');
            var funId = $("#MenuConfigSelect").find("option:selected").attr('data-fun_id');
            $('.J-functionUrl').find('.pm-item-label.pm-clr-aaa').html('功能链接');
            $('#MenuLink').attr('placeholder','请输入链接地址，以http://或者https://开头');
            if (MenuSelectVal == 0) {
                $("#MenuName").attr('readonly', 'readonly');
                $("#MenuFunction").unbind("click").val('首页');
                $("#MenuFunction").unbind("click").addClass('pm-bg-gray').removeClass('MenuFunSelect');
                $('#MenuName').val('首页');
                $('.J-functionUrl').hide().find('#MenuLink').attr('readonly', 'readonly').val('');
            } else {
                
                if(funId == 1){
                    $('.J-functionUrl').show().find('#MenuLink').removeAttr('readonly').val(wapUrl);
                }else if(funId == 5){
                    $('#MenuLink').attr('placeholder','请输入电话号码');
                    $('.J-functionUrl').find('.pm-item-label.pm-clr-aaa').html('请输入号码');
                    $('.J-functionUrl').show().find('#MenuLink').removeAttr('readonly').val(wapUrl.replace('tel:',''));
                }else{
                    $('.J-functionUrl').show().find('#MenuLink').attr('readonly', 'readonly').val(wapUrl);
                }
                $("#MenuFunction").addClass('MenuFunSelect').removeClass('pm-bg-gray');
                if (funName == 'undefined') {
                    $('#MenuFunction,#ModuleName').val('选择功能');                    
                } else {
                    $('#MenuFunction,#ModuleName').val(funName);
                }
                $('#MenuName').val(MenuSelectText).removeAttr('readonly');
                $("#MenuFunction").unbind("click").click(function () {
                    oPlugIn.showPlugInFunction();
                });
            }

            if (icon != undefined) {
                $('#ShowMenuImg').attr('src', icon);
            } else {
                $('#ShowMenuImg').attr('src', App.url.resource + '/vender/diy/img/file.png');
            }
            _saveNav();
        });
    }
    
    function _saveNav() {
        var oNavOptions = [];
        $("#MenuConfigSelect").find("option").each(function (index) {
            var $this = $(this);
            var icon = $this.attr('data-icon');
            var url = $this.attr('data-wap_url');
            var funName = $this.attr('data-fun_name');
            var funId = $this.attr('data-fun_id');
            if (icon == undefined) {
                icon = App.url.resource+'vender/diy/img/icon_blank.png';
            }
            if(index == 0){
                funName = '首页';
                url = 'javascript:void(0);';
            }
            if(funId == undefined){
                funId = 0;
            }
            oNavOptions.push({
                index: index,
                url: url,
                icon: icon,
                fun_name: funName,
                fun_id: funId,
                name: $this.text()
            });
        });
        ajax({
            url: _aConfig.saveTempateNavUrl,
            data: {
                id: _aConfig.templateId,
                aNav: oNavOptions,
            },
            success: function (aData) {
                console.log(aData);
            }
        });
    }
    function _setEditor() {
        editor = KindEditor.create('textarea[name="productcontent"]', {
            autoHeightMode: true,
            allowFileManager: false, //浏览上传文件
            themeType: 'simple',
            allowUpload: true, //是否可以上传
            urlType: 'domain',
            items: [
                'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', 'emoticons', 'source'],
            uploadJson: '../_Resource/kindeditor/asp.net/upload_json.ashx', //上传文件方法 
            afterCreate: function () {
                var self = this;
                KindEditor.ctrl(document, 13, function () {
                    self.sync();
                });
                KindEditor.ctrl(self.edit.doc, 13, function () {
                    self.sync();
                });
            },
            //监听编辑器内容发生改变的事件
            afterChange: function () {
                if (editor !== undefined) {
                    $("#page-content .widget_view_selected  .pm-mod-text").html(editor.html());
                }
            },
            afterBlur: function () {
                AutoSave();
            }
        });
        editor.html("默认文本");//初始化内容
        editor.sync();
    }
    //设置滑块比列（布局栏宽度发生变化的时候）
    function LayoutBasis(type, values) {
        var range = false;
        $("#Configuration .pm-item-box[data-type='" + type + "'] .pm-devide-control .LytSlider").each(function (i) {
            $(this).empty().slider({
                range: range,
                min: 0,
                max: 100,
                values: values,
                animate: true,
                slide: function (event, ui) {
                    values = ui.values;
                    if (type == 'button') {
                        //拖拽区域元素的宽度
                        var sType = $(this).closest('.LytSlider').data('type');
                        if (sType == 'height') {
                            $("#page-content .widget_view_selected .pm-mod-button a").css('height', ui.value + 'px');
                            $("#Configuration .pm-item-box[data-type='" + type + "'] #ButtonHeight .cell").html(ui.value + 'px');
                        } else {
                            $("#page-content .widget_view_selected .pm-mod-button a").css('width', ui.value + '%');
                            $("#Configuration .pm-item-box[data-type='" + type + "'] #ButtonWidth .cell").html(ui.value + '%');
                        }

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
    //删除布局和元素
    function removeElm() {
        $("#page-content").delegate(".pm-mod-del", "click", function (e) {
            var data = $(this).parent().parent().parent();
            var draggable = data.attr('data-elm-type');
            var dargtext = "";
            if (draggable) {
                dargtext = "元素";
            } else {
                dargtext = "布局";
            }
            oDiyCommon.confirm('确认要删除' + dargtext + '?','提示', function (o) {
                data.remove();                
                $('.pm-config-bd,#configure').hide();
                AutoSave();
                o.close();
            });
        })
    }
    var _aConfig = {
        getTemplateDetailUrl: 'template-detail.html',
        templateId: parseInt(location.pathname.replace(/\/diy\-(\d+)\.html/g, '$1')),
        uplodImageUrl: '/template-upload-img.html',
        updateTempateStatusUrl: '/update-template-status.html',
        updateTempateTitleUrl: '/update-top-title.html',
        updateTempateTitleTypeUrl: '/update-template-title-type.html',
        saveTempateNavUrl: '/save-template-nav.html',
    };
    var self = oDiy;
    win.oDiy = oDiy;
    oDiy.init();
    var editor;
})($, window);
function showMenu() {}
function EditMenu() {}

