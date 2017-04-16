(function($,win){
    var oPlugIn = {
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        },
        //关闭弹出层
        ClosePlugIn: function ($dom) {
            if ($dom == undefined) {
                if ($('body').find('#J-PlugInDom').length == 0) {
                    $('body').append('<div id="J-PlugInDom"></div>');
                }
                $dom = $('body').find('#J-PlugInDom');
            }
            $dom.empty();
        },
        selectFunction: function () {
            var $selectDom = $('.J-functionListDom').find('.cur');
            if ($selectDom.length == 0) {
                return layer.msg('选择先功能');
            }
            var url = $selectDom.data('url');
            var name = $selectDom.data('name');
            var id = $selectDom.data('id');
            var index = $('#ConfigMenuTab li.on').index();
            $('.J-functionUrl').find('.pm-item-label.pm-clr-aaa').html('功能链接');
            $('#MenuLink').attr('placeholder','请输入链接地址，以http://或者https://开头');
            //菜单设置
            if (index == 2) {
                $('#MenuFunction').val(name);
                if (id == 1) {                
                     $('.J-functionUrl').show().find('#MenuLink').removeAttr('readonly').val('');            
                }else if(id == 5){
                    $('.J-functionUrl').find('.pm-item-label.pm-clr-aaa').html('请输入号码');
                    $('#MenuLink').attr('placeholder','请输入号码');
                    $('.J-functionUrl').show().find('#MenuLink').removeAttr('readonly').val(url.replace('tel:',''));
                    $("#MenuLink").focus();
                    layer.msg('请输入号码');
                }else{
                    $('.J-functionUrl').show().find('#MenuLink').attr('readonly', 'readonly').val(url);
                    
                }
                $('#MenuConfigSelect option:selected').attr('data-wap_url',url);
                $('#MenuConfigSelect option:selected').attr('data-fun_name',name);
                $('#MenuConfigSelect option:selected').attr('data-fun_id',id);
                oDiy.saveNav();
                self.ClosePlugIn();
                return;
            }
            $('#ModuleTypeName').val(name);
            $('#FunctionTitle').val(name);
            $("#page-content .widget_view_selected").attr('data-name', name);
            $("#page-content .widget_view_selected").attr('data-id', id);
            $('#CustomLink').find('.pm-item-label.pm-clr-aaa').html('功能链接');
            $('#ModuleUrl').attr('placeholder','请输入链接地址，以http://或者https://开头');
            if (id == 1) {                
                $("#page-content .widget_view_selected").attr('data-wap_url', '');
                $('#CustomLink').show().find('#ModuleUrl').removeAttr('readonly').val('');          
            }else if(id == 5){
                $('#ModuleUrl').attr('placeholder','请输入号码');
                $('#CustomLink').find('.pm-item-label.pm-clr-aaa').html('请输入号码');
                $('#CustomLink').show().find('#ModuleUrl').removeAttr('readonly').val('');
                $("#page-content .widget_view_selected").attr('data-wap_url', '');
                $("#ModuleUrl").focus();
                layer.msg('请输入号码');
            }else{                
                $('#CustomLink').show().find('#ModuleUrl').attr('readonly', 'readonly').val(url);
                $("#page-content .widget_view_selected").attr('data-wap_url', url); 
            }            
            self.ClosePlugIn();
        },
        //显示设置
        showPlugInSettions:function(templateId,$dom){
            //获取模板
            oDiy.getTemplateDetail(templateId,function(aData){
                if(aData.status == 1){
                    _showPugIn(_buildSettingsPlugIn(aData.data),undefined,' pm-plugin-small');
                    oDiy.buildUploadBtn($('.J-plugin-SettImgView'),function(aData){
                        $('.J-plugin-SettImgView').find('img').attr('src',aData.path);
                        $('.J-plugin-SettImgView').find('input[name="thumb"]').val(aData.path);
                    });
                }
            });
        },
        showPlugInFunction:function(){
            var html = ' <div class="pm-plugin-show pull-left">\
                <div class="pm-plugin-funView">\
                    <div class="swiper-container swiper-container-horizontal">\
                        <div class="swiper-wrapper">\
                        </div>\
                        <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets"></div>\
                    </div>\
                </div>\
                <div class="pm-plugin-funDes">\
                    <div class="pm-plugin-funRow">\
                        <div class="pm-funDes-label">功能：</div>\
                        <div class="pm-funDes-bd J-functionName">企业圈子（SNSC）</div>\
                    </div>\
                    <div class="pm-plugin-funRow">\
                        <div class="pm-funDes-label">时间：</div>\
                        <div class="pm-funDes-bd J-functionTime">2016-09-14 18:55</div>\
                    </div>\
                </div>\
            </div>\
            <div class="pm-plugin-operate pull-right">\
                <div class="pm-plugin-tab pm-plugin-funtab tab2">\
                    <ul>\
                        <li style="width: 100%;"><a href="javascript:;"><span>功能</span></a></li>\
                    </ul>\
                </div>\
                <div class="pm-plugin-funBd pm-plugin-funStyle">\
                    <ul class="J-functionCategory">\
                    </ul>\
                </div>\
                <div class="pm-plugin-funBd pm-plugin-funStyle"></div>\
                <div class="pm-plugin-funList pm-plugin-funMy">\
                    <ul class="J-functionListDom">\
                    </ul>\
                </div>\
                <div class="pm-submit-bd">\
                    <div class="pm-plugin-page pm-frame-page pull-left"><a href="javascript:;" id="btn_pre">上一页</a><a href="javascript:;"><span id="pageIndex">1</span>/<span id="pageCount">3</span>页</a>\
                        <a href="javascript:;" id="btn_next">下一页</a>\
                    </div>\
                    <div class="pm-btn pm-btn-md pm-bg-blue pm-btn-confirm pull-right"><a href="javascript:;" onclick="oPlugIn.selectFunction(this)"><i></i>确认选择</a></div>\
                </div>\
            </div>';
            _showPugIn(html);
            self.getFunctionCategory(function(aData){
                $('.J-functionCategory').empty().append(_buindFunctionCategory(aData.data));
                _bindPageEvent();
                $('.J-functionCategory li').click(function(){
                    $(this).siblings('li').find('a').removeClass('cur');
                    $(this).find('a').addClass('cur');
                    var id = $(this).data('id');
                    $('#pageCount').data('page',1);
                    if (_aFunctionList[id] != undefined) {
                        _appendFunctionList(_pageDeal(1, id));
                        _bindFunctionEvent();
                        $('.J-functionListDom').find('li:first').click();
                        return;
                    } 
                    self.getFunctionList($(this).data('id'), function (aData) {
                        _aFunctionList[id] = aData.data;
                        //分页
                        _appendFunctionList(_pageDeal(1, id));
                        _bindFunctionEvent();
                    });
                   
                });
                $('.J-functionCategory li:first').click();
            });
        },
        showPlugInImageSelect:function(oData,cb){
            var src = oData.src;
            if(oData.src.indexOf('file.png') != -1){
                src = '';
            }
            var html = '<div class="pm-plugin-show pull-left">\
            <div class="pm-plugin-ImgView J-plugin-ImgUpload">\
                <div class="pm-plugin-ImgViewBd pm-plugin-ImgOpacity J-ImgUpload-showImage"><img src="'+ src +'" data-id="0"></div>\
                <div class="pm-item-editImg"><a href="javascript:;" class="edit"><i></i>编辑</a></div>\
            </div>\
            <div class="pm-plugin-ImgDes">\
                <div class="pm-plugin-funRow">\
                    <div class="pm-funDes-label">图片名称</div>\
                    <div class="pm-funDes-bd">\
                        <div class="pull-right"><input type="text" class="pm-normal-text pm-clr-333 J-ImgUpload-name" id="Cname" value="功能图标"></div>\
                    </div>\
                </div>\
                <div class="pm-plugin-funRow">\
                    <div class="pm-funDes-label">所属标签</div>\
                    <div class="pm-funDes-bd"><select class="frame-select pull-right" id="ImgCategorySelect"></select>\
                        <input type="text" id="ImgCategoryName" class="pm-normal-text pm-clr-333 pull-right hide" placeholder="创建标签分类"></div>\
                </div>\
            </div>\
            <div class="pm-plugin-ImgUpload J-plugin-ImgUpload">\
                <div class="webPicPicker">\
                    <div class="pm-plugin-UploadFile">\
                        <div class="webuploader-pick"><img src="'+ App.url.resource +'/vender/diy/img/file.png"></div>\
                        <input type="hidden" name="vender_image_url" class="webuploader-element">\
                    </div>\
                    <div class="pm-plugin-UploadDes">拖动图片到这里或点击选择文件<br>每次最多6张，每张小于2M</div>\
                </div>\
            </div>\
        </div>\
        <div class="pm-plugin-operate pull-right">\
            <div class="pm-plugin-tab pm-plugin-imgtab tab2">\
                <ul class="J-ImagesListCategoryGroup">\
                    <li class="cur" id="1"><a href="javascript:;"><span>我的图片</span></a></li>\
                    <li id="2"><a href="javascript:;"><span>默认图片</span></a></li>\
                </ul>\
            </div>\
            <div class="pm-plugin-funBd pm-plugin-photoStyle pm-plugin-MyphotoStyle"><span>分类标签：</span>\
                <ul class="J-myCategoryImagesList"></ul>\
            </div>\
            <div class="pm-plugin-funList pm-plugin-photo">\
                <ul class="J-myImagesList"></ul>\
            </div>\
            <div class="pm-submit-bd">\
                <div class="pm-plugin-page pm-frame-page pull-left"><a href="javascript:;" id="btn_pre_img" class="J-btn_pre_img">上一页</a>\
                    <a href="javascript:;" id="btn_next_img" class="J-btn_next_img">下一页</a>\
                </div>\
                <div class="pm-btn pm-btn-md pm-bg-blue pm-btn-confirm pull-right"><a href="javascript:;" class="J-ImageComfireSelect"><i></i>确认选择</a></div>\
            </div>\
        </div>';
            _showPugIn(html);
            _bindImageSetting();
            $('.J-ImageComfireSelect').click(function(){                
                var url = $('.J-ImgUpload-showImage img').attr('src');
                var index = $('#ConfigMenuTab li.on').index();               
                if(index == 0){
                    return _setTopNavImageUrl(url,{close:function(){ self.ClosePlugIn() }});
                }
                if(index == 2){
                    return _setNavImageUrl(url,{close:function(){ self.ClosePlugIn() }});
                }
                if(index == 1 && $("#page-content .widget_view_selected").attr('data-elm-type') == 'slide'){
                    return _setSlideImage(url,{close:function(){ self.ClosePlugIn() }});
                }
                //功能
                if(index == 1 && $("#page-content .widget_view_selected").attr('data-elm-type') == 'module'){
                    return _setModuleImage(url,{close:function(){ self.ClosePlugIn() }});
                }
                _setSelectedDrapImage(url);
                $('#ShowPicImg').attr('src',url);
                self.ClosePlugIn();
                AutoSave();
            });
            //默认获取我的分类
            self.getImageCategoryList(0,0,function(aData){
                if(aData.status == 1){
                   self.buildImagePuInHtmlByIsPublic(0,aData);
                }
            });
            if(cb !==undefined && typeof(cb) == 'function'){
                cb();
            }
        },
        clickSaveSettings:function(obj){
            var $fromDom = $(obj).closest('form');
            Request.ajaxSend($fromDom,{
                url:_aConfig.saveTemplateUrl,
                success:function(aData){
                    UBox.show(aData.msg,aData.status);
                },
            },$(obj));
        },
        getImageCategoryList: function (pid, isPublic, cb) {
            if (pid == undefined) {
                pid = 0;
            }
            if (isPublic == undefined) {
                isPublic = 0;
            }
            Request.ajax({
                url: _aConfig.getImageCategoryListUrl,
                data: {pid: pid, isPublic: isPublic},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        getMyImagelist: function (pid,isPublic,page,cb) {
            if (pid == undefined) {
                pid = 0;
            }
            if (page == undefined) {
                page = 1;
            }
            if (isPublic == undefined) {
                isPublic = 0;
            }
            Request.ajax({
                url: _aConfig.getImageListUrl,
                data: {pid: pid, isPublic: isPublic, page: page},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        getFunctionList: function (pid, cb) {
            if (pid == undefined) {
                pid = 0;
            }
            Request.ajax({
                url: _aConfig.getFunctionListUrl,
                data: {pid: pid},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        getFunctionCategory:function(cb){
             Request.ajax({
                url: _aConfig.getFunctionCategoryUrl,
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        imageCategoryAdd:function(categoryName,cb){
            Request.ajax({
                url: _aConfig.addImageCategoryUrl,
                data: {name: categoryName},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        imageCategoryEditor : function(id,categoryName,pid,cb){
            Request.ajax({
                url: _aConfig.editorImageCategoryUrl,
                data: {name: categoryName,id:id,pid:pid},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
        delImage:function(id,cb){
            Request.ajax({
                url: _aConfig.delImageUrl,
                data: {id:id},
                success: function (aData) {
                    if (cb !== undefined && typeof (cb) == 'function') {
                        cb(aData);
                    }
                }
            });
        },
         //删除我的图片
        deleteImg: function (id, obj) {
            if(!id){
                return;
            }
            oDiyCommon.confirm('确认要删除该图片?','提示',function(oLayer){
                self.delImage(id,function(aData){
                    oLayer.close();
                    UBox.show(aData.msg,aData.status);
                    if(aData.status == 1){                        
                        $(obj).closest('li').remove();
                    }
                });
            });
        },
        buildImagePuInHtmlByIsPublic:function(isPublic,aData) {
        //构建分类列表
        $('.J-myCategoryImagesList').empty().append(_buildImageCategory(aData.data));
        $('#ImgCategorySelect').empty().append(_buildImageCategorySelect(aData.data));
        //绑定分类点击事件
        $('.J-myCategoryImagesList').find('li').click(function () {
            var $this = $(this);
            $this.siblings().removeClass('cur');
            $this.addClass('cur');
            var pid = $(this).find('a').data('id');
            self.getMyImagelist(pid, isPublic, 1, function (aData) {
                if (aData.status == 1) {
                    _appendImageList(aData.data);
                    $('.J-myImagesList').data('page', 1);
                    $('.J-myImagesList').data('pid', pid);
                    $('.J-myImagesList').data('isPublic', isPublic);
                    $('.J-btn_pre_img').click(function () {
                        var page = $('.J-myImagesList').data('page');
                        var pid = $('.J-myImagesList').data('pid');
                        var isPublic = $('.J-myImagesList').data('isPublic');
                        if (page == 1) {
                            return UBox.show('已经最顶了，没有更多数据了', -1);
                        }
                        page = page - 1;
                        self.getMyImagelist(pid, isPublic, page, function (aData) {
                            $('.J-myImagesList').data('page', page);
                            return _appendImageList(aData.data);
                        });
                    });
                    $('.J-btn_next_img').click(function () {
                        var page = $('.J-myImagesList').data('page');
                        var pid = $('.J-myImagesList').data('pid');
                        var isPublic = $('.J-myImagesList').data('isPublic');
                        page = page + 1;
                        var maxPage = $('.J-myImagesList').data('max_page');
                        if (maxPage != undefined && maxPage == page) {
                            return UBox.show('没有更多数据了', -1);
                        }
                        self.getMyImagelist(pid, isPublic, page, function (aData) {
                            if (aData.data.length == 0) {
                                $('.J-myImagesList').data('max_page', page);
                                return UBox.show('没有更多数据了', -1);
                            } else {
                                $('.J-myImagesList').data('page', page);
                            }
                            return _appendImageList(aData.data);
                        });

                    });
                }
            });
        });
        //默认点击第一个
        $('.J-myCategoryImagesList li:first').click();
    },
        //初始化颜色选择控件
    InitialColorSelect: function (selectId, resourcetype, colid, colval, purpose) {
        $("#" + selectId).css('backgroundColor', '#' + colval);
        $("#" + selectId).colpick({
            colorScheme: 'dark',
            layout: 'rgbhex',
            color: colval,
            livePreview: 0,
            onSubmit: function (hsb, hex, rgb, el) {
                $(el).css('backgroundColor', '#' + hex);
                $(el).next().find("#" + colid).val(hex);
                $(el).colpickHide();
                if (resourcetype == "fun_bgcolor") {
                    $("#page-content .widget_view_selected").attr('data-bg_color', hex);
                    $("#page-content .widget_view_selected .funcs").css('backgroundColor', "#" + hex).attr('data-val', hex);
                    AutoSave();
                } else if (resourcetype == "fun_fontcolor") {
                    $("#page-content .widget_view_selected").attr('data-text_color', hex);
                    $("#page-content .widget_view_selected .funcs").find('p').css('color', '#' + hex).attr('data-val', hex);
                    AutoSave();
                } else {
                    self.InitialColorSetting(selectId, resourcetype, hex, purpose);
                }
            }
        });
    },
        InitialColorSetting: function (selectId, ResourceType, ResourceValue, Purpose) {
            layer.load(0, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            if (ResourceType == "bgcolor") {
                //TempID = 0;
            }
            if (ResourceValue.indexOf("#") == 0) {
                ResourceValue = ResourceValue;
            } else {
                ResourceValue = "#" + ResourceValue;
            }
            if (ResourceType == "fun_fontcolor") {
                $("#FunTextSelect").css('backgroundColor', ResourceValue);
                $("#page-content .widget_view_selected ." + Purpose).find('p').css('color', ResourceValue).attr('data-val', ResourceValue.replace('#', ''));
                AutoSave();
                layer.closeAll();
                return;

            } else if (ResourceType == "fun_bgcolor") {
                $("#FunBgSelect").css('backgroundColor', ResourceValue);
                $("#page-content .widget_view_selected ." + Purpose).css('backgroundColor', ResourceValue).attr('data-val', ResourceValue.replace('#', ''));
                AutoSave();
                layer.closeAll();
                return;
            } else {                
                //更新颜色
                var oData = {
                    resourceType: ResourceType,
                    resourceValue: ResourceValue,
                    id: _aConfig.templateId,
                }
                Request.ajax({
                    url: _aConfig.updateTempateColorUrl,
                    data: oData,
                    success: function (aData) {
                        layer.closeAll();
                        if (ResourceType == "tabbar_fontcolor" || ResourceType == "navibar_fontcolor") {
                            $("." + Purpose).css('color', ResourceValue);
                        } else {
                            $("." + Purpose).css('backgroundColor', ResourceValue);
                        }
                        $("#" + selectId).css('backgroundColor', ResourceValue);
                    }
                });
            }
        }
    };
    function _bindFunctionEvent() {
        //绑定点击事件
        $('.J-functionListDom').find('li').click(function () {
            $(this).siblings('li').find('a').removeClass('cur');
            $(this).find('a').addClass('cur');
            var id = $(this).find('a').data('id');
            var catogryId = $('.J-functionCategory li .cur').closest('li').data('id');
            var aData = _aFunctionList[catogryId];
            for (var i in aData) {
                if (aData[i].id == id) {
                    $('.J-functionName').text(aData[i].name);
                    $('.J-functionTime').text(Ui.date('Y-m-d H:i:s', aData[i].create_time));
                    _buildFunctionDetail(aData[i]);
                    break;
                }
            }
        });
        $('.J-functionListDom').find('li:first').click();
    }
    /**
     * 设置导航图片
     */
    function _setTopNavImageUrl(url, o) {
        $('#ShowNavImg').attr('src', url);
        var oData = {
            id: _aConfig.templateId,
            title_img: url,
        };
        Request.ajax({
            url: _aConfig.updateTempateTitleImageUrl,
            data: oData,
            success: function (aData) {
                layer.closeAll();
                if (aData.status == 1) {
                    $(".cter-navigation img").attr('src', aData.data);
                }
            }
        });
        o.close();
        AutoSave()
    }
    /**
     * 设置导航图片
     */
    function _setNavImageUrl(url, o) {
        $('#ShowMenuImg').attr('src', url);
        $('#MenuConfigSelect option:selected').attr('data-icon',url);        
        oDiy.saveNav();
        var index = $('#MenuConfigSelect option:selected').index();
        $('.cter-tabbar ul li:eq('+ index +')').find('img').attr('src',url);
        AutoSave();
        o.close();
    }
    function _bindImageSetting(){
        $(".pm-plugin-ImgDes #Cname").blur(function () {
            //默认图库不能改变
            if ($(".pm-plugin-imgtab li:last").hasClass("cur")) {
                return;
            }
            var Title = $(this).val();//图片名称
            var CategoryId = $("#ImgCategorySelect").find("option:selected").attr('id'); //分类ID
            if (!CategoryId) {
                CategoryId = "0";
            }
            var ID = $(".pm-plugin-ImgOpacity img").attr('data-id');
            $(".pm-plugin-photo li a.cur").parent().find('b').html(Title);
            if (ID && Title && CategoryId) {
                self.imageCategoryEditor(ID, Title, CategoryId);
            }
        });
        //添加标签
        $("#ImgCategoryName").blur(function () {
            var Name = $(this).val();
            if (Name) {
                self.imageCategoryAdd(Name);
            }
            $("#ImgCategorySelect").show().find("option").removeAttr('selected');
            $("#ImgCategorySelect option:first").attr("selected", true);
            $("#ImgCategoryName").val('').hide();
        });
        $("#ImgCategorySelect").change(function () {
            var CSText = $(this).find("option:selected").text();
            var CSVal = $(this).find("option:selected").val();
            var CurrCategoryId = $(".pm-plugin-photoStyle li.cur a").attr('data-id');//当前分类ID
            var ID = $(".pm-plugin-ImgViewBd img").attr('data-id'); //图片ID
            var Title = $("#Cname").val(); //图片名称
            var CategoryId = $(this).find("option:selected").attr('id'); //选中分类ID
            if (CSText == "添加标签" && CSVal == "add") {
                $("#ImgCategorySelect").hide();
                $("#ImgCategoryName").show().focus();
            }
            if (ID && Title && CategoryId) {
                if (CategoryId != CurrCategoryId) {
                    $(".pm-plugin-photo li a.cur").parent().remove();
                }
                self.imageCategoryEditor(ID, Title, CategoryId);
            }
        });
    }
    //功能图标
    function _setModuleImage(url,o){
        $('#ShowFunImg').attr('src',url);
        _setSelectedDrapImage(url);
        o.close();
        AutoSave();
    }
    function _setSlideImage(url,o){
        //获取轮播图主枝干
        var $swiper = $("#page-content .widget_view_selected .adv_list .swiper-wrapper");
        var xlist = $swiper.data('url_list');
        var index = $('#SlideSelect').find("option:selected").val();
        var link = $('#SlideLink').val();
        var aList = _dealSliderData(url,xlist,index,link);        
        $swiper.attr('data-url_list',JSON.stringify(aList));
        $swiper.find('img').attr('src',url);
        $('#ShowSlideImg').attr('src',url);
        oDiy.showSlide();
        o.close();
        AutoSave();
    }    
    function _dealSliderData(url, xlist, indexs,link) {
        var aList = [];
        if (xlist != undefined) {
            aList = xlist;
        }
        for (var i in aList) {
            if (aList[i] == null || aList[i].index == indexs) {
                delete aList[i];
            }
        }
        aList.push({
            index: indexs,
            url: url,
            link:link
        });
        return aList;
    }
    function _setSelectedDrapImage(src){
        $("#page-content .widget_view_selected .swiper-wrapper img").attr('src', src);
    }
    function _appendImageList(aData){
        $('.J-myImagesList').empty().append(_buildImageList(aData));
        $('.J-myImagesList').find('p').click(function(){
            var $this = $(this);
            $this.closest('li').siblings().find('a').removeClass('cur');
            $this.closest('li').find('a').addClass('cur');
            $('.J-ImgUpload-showImage img').attr('src',$(this).data('url'));
            $('.J-ImgUpload-showImage img').attr('data-id',$(this).data('id'));
            $('.J-ImgUpload-name').val($(this).data('name'));
        });
    }
    function _buildFunctionDetail(aData){
        var imgArr = [];
        var imgHtml = "";
        if (aData.image1) {
            imgArr.push(aData.image1);
        }
        if (aData.image2) {
            imgArr.push(aData.image2);
        }
        if (aData.image3) {
            imgArr.push(aData.image3);
        }
        if (imgArr && imgArr.length > 0) {
            $.each(imgArr, function (i, v) {
                imgHtml += ("<div class='swiper-slide'><img src='" + v + "'></a></div>")
            });
            $(".pm-plugin-funView .swiper-wrapper").empty().append(imgHtml);
            oDiy.showInitSwiper(true);
        }
    }
    function _buildFunctionList(aData){
        var html = '';
        for (var i in aData) {
            html += '<li class="isusing_1" ><a href="javascript:;" data-id='+ aData[i].id +' data-url="'+ aData[i].wap_url +'" data-name="'+ aData[i].name +'"><!--<span>使用中</span>--><i></i><p><img src="'+ aData[i].icon +'">'+ aData[i].name +'</p></a></li>';
        }
        return html;
    }
    
    function _appendFunctionList(aData){
        var html = _buildFunctionList(aData);       
        $('.J-functionListDom').empty().append(html);
    }
    
    function _buindFunctionCategory(aData){
        var html ='<li  data-id="0"><a href="javascript:;" class="cur">全部</a></li>';
        for (var i in aData) {
            html += '<li data-id="'+ aData[i].id +'"><a href="javascript:;">'+ aData[i].name +'</a></li>';
        }
        return html;
    }
    
    function _buildImageCategory(aData){
        var html = '<li class="cur"><i></i><a href="javascript:;" data-id="0">全部</a></li>';
        for (var i in aData) {
            html += '<li><i onclick="oPlugIn.DeleteImageCategory('+ aData[i].id +',this)"></i><a href="javascript:;" data-id="'+ aData[i].id +'" title="'+ aData[i].name +'" >'+ aData[i].name +'</a></li>';
        }
        return html;
    }
    function _buildImageCategorySelect(aData){
        var html = '<option value="0" data-id="0">全部</option>';
        for (var i in aData) {
            html += '<option id="'+ aData[i].id +'" value="'+ aData[i].id +'">'+ aData[i].name +'</option> ';
        }
        html += '<option value="add">添加标签</option>';
        return html;
    }
    function _buildImageList(aData){
        var html ='';
        for (var i in aData) {
            html += '<li>\
                <a href="javascript:;">\
                    <i data-pid='+ aData[i].pid +' onclick="oPlugIn.deleteImg('+ aData[i].id +',this)"></i>\
                    <p data-url="'+ aData[i].url +'" data-name="'+ aData[i].name +'" data-id="'+ aData[i].id +'"><img src="'+ aData[i].url +'"></p>\
                </a>\
                <b>'+ aData[i].name +'</b>\
            </li>';
        }
        return html;
    }
    function _showPugIn(html,$dom,className){
        var finalHtml = _getPlugHead(className) + html + _getPlugFooter();
        if ($dom == undefined) {
            if ($('body').find('#J-PlugInDom').length == 0) {
                $('body').append('<div id="J-PlugInDom"></div>');
            }
            $dom = $('body').find('#J-PlugInDom');
        }
        $dom.empty().append(finalHtml);
    }
    
    function _buildSettingsPlugIn(oData){
        var thumb = oData.thumb == '' ? App.url.resource+'/vender/diy/img/default_bg.jpeg' : oData.thumb;
        var  html = '<div class="pm-plugin-show pull-left">\
                    <form method="post" id="J-SettingForm"><div class="pm-plugin-SettingForm">\
                        <div class="pm-plugin-funRow">\
                            <div class="pm-funDes-label">模板图片</div>\
                            <div class="pm-SettDes-bd">\
                                <div class="pm-plugin-SettImgView pull-left J-plugin-SettImgView">\
                                <input type="hidden" name="thumb"/>\
                                    <div class="pm-plugin-ImgViewBd"><img src="'+ thumb +'"></div>\
                                    <input type="hidden" name="id" value='+ oData.id +'>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="pm-plugin-funRow">\
                            <div class="pm-funDes-label">模板链接地址</div>\
                            <div class="pm-SettDes-bd"><input type="text" style="width: 230px;" disabled="disabled" class="pm-normal-text pm-clr-333"  value="'+oData.wap_url +'"></div>\
                        </div>\
                        <div class="pm-plugin-funRow">\
                            <div class="pm-funDes-label">模板名字</div>\
                            <div class="pm-SettDes-bd"><input type="text" name="name" class="pm-normal-text pm-clr-333"  value="'+oData.name +'"></div>\
                        </div>\
                        <div class="pm-plugin-funRow">\
                            <div class="pm-funDes-label">备注说明</div>\
                            <div class="pm-SettDes-bd"><textarea name="description" class="pm-normal-textarea pm-clr-333" placeholder="请输入模板备注说明">'+ oData.description +'</textarea></div>\
                        </div>\
                        <div class="pm-submit-bd text-center">\
                            <div class="pm-btn pm-btn-md pm-bg-blue"><a href="javascript:;" onclick="oPlugIn.clickSaveSettings(this)">确认</a></div>\
                        </div></form>\
                    </div>\
                </div>';
        return html;
    }
    
    function _getPlugHead(className){
        if(className == undefined){
            className = '';
        }
        return '<div id="PlugInMask" style="opacity: 1;"></div>\
            <div id="PlugInLibrary" class="pm-plugin-main pm-bg-white pm-plugin-InRight '+ className +'">\
            <div class="pm-plugin-back" onclick="oPlugIn.ClosePlugIn()"></div>';
    }
    function _getPlugFooter(){
        return '</div>';
    }
    function _bindPageEvent(){
        $('#btn_pre').click(function(){
            var page = $('#pageCount').data('page');
            if(page == undefined){
                page = 1;
                $('#pageCount').data('page',1);
            }
            if(page == 1){
                return;
            }
            page = page - 1;
           var id = $('.J-functionCategory li .cur').closest('li').data('id');
            _appendFunctionList(_pageDeal(page,id));
            $('#pageCount').data('page',page);
        });
        $('#btn_next').click(function(){
             var page = $('#pageCount').data('page');
            if(page == undefined){
                page = 1;
                $('#pageCount').data('page',1);
            }
            if(page == $('#pageCount').text()){
                return;
            }
            page = page + 1;
            var id = $('.J-functionCategory li .cur').closest('li').data('id');
            _appendFunctionList(_pageDeal(page,id));
            $('#pageCount').data('page',page);
        });
        
    }
    function _pageDeal(page, i) {
        if (page <= 0) {
            page = 1;
        }
        var aData = _aFunctionList[i];
        var num = aData.length;
        var pageSize = 12;//每页显示行数
        var totalPage = Math.ceil(num / pageSize);//总页数
         $('#pageCount').text(totalPage);
         $('#pageIndex').text(page);
        var currentPage = page;//当前页数
        var startRow = (currentPage - 1) * pageSize + 1;//开始显示的行  31 
        var endRow = currentPage * pageSize;//结束显示的行   40
        //endRow = (endRow > num) ? num : endRow;
        var aResult = [];
        for (var item in aData) {
            if (item >= (startRow -1) && item < endRow) {
                aResult.push(aData[item]);
            }
        }
        return aResult;
    }
    var oDiyCommon = {
        config: function (aOptions) {
            for (var key in aOptions) {
                if (_aConfig[key] !== undefined) {
                    _aConfig[key] = aOptions[key];
                }
            }
        },
         showComfir: function (title,cb) {
            layer.msg(title, {
                time: 0, 
                btn: ['确定', '取消'],
                yes: function (index) {
                    cb();
                    layer.close(index);
                }
            });
        },
        confirm:function(msg,title,cb){
            if(msg == undefined){
                msg = '确认执行该操作？';
            }
            if(title == undefined){
                title = '提示';
            }
            layer.confirm(msg, { icon: 3, title: title }, function (index) {                
                cb({close: function () {
                        layer.close(index);
                    }});
            });
        }
        
        
    };
    var _aConfig = {
        saveTemplateUrl: '/editor-template.html',
        getImageCategoryListUrl: '/image-category-list.json',
        getImageListUrl: '/image-list.json',
        addImageCategoryUrl: '/add-image-category.html',
        editorImageCategoryUrl: '/editor-image.html',
        delImageUrl: '/del-image.html',
        templateId: parseInt(location.pathname.replace(/\/diy\-(\d+)\.html/g, '$1')),
        updateTempateColorUrl: '/update-color-template.html',
        updateTempateTitleImageUrl: '/update-template-title-image.html',
        getFunctionListUrl: '/get-function-list.json',
        getFunctionCategoryUrl: '/get-function-category.json'
    };
    win.oPlugIn = oPlugIn;
    var self = oPlugIn;
    win.oDiyCommon = oDiyCommon;
    var _aFunctionList =[];
})($,window);

