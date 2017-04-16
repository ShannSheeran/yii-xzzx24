var bizModuleList;
var currAddedModule;
var pageIndex = 1;
var pageCount = 1;
var pageSize = 12;
var presentElm = 0;
var prev = "";
var next = "";

var modulePageIndex = 1;
var modulePageSize = 12;
var modulePageCount = 1;

var bizPageIndex = 1;
var bizPageSize = 12;
var bizPageCount = 1;
function ajax(aTmpOption){
    if (!aTmpOption.url) {
        $.error('亲,没配置URL啊');
        return;
    }
    var aOption = $.extend({}, aTmpOption);
    aOption.type = aOption.type || 'post';
    aOption.dataType = aOption.dataType || 'json';

    if (aOption.type == 'post') {
        if (aOption.data == undefined) {
            aOption.data = {};
        }
        if (typeof (aOption.data) == 'object' && aOption.data['_csrf'] == undefined) {
            var csrfToken = $('meta[name="csrf-token"]').attr('content');
            if (csrfToken) {
                aOption.data['_csrf'] = csrfToken;
            } else {
                return layer.msg('会话信息已过期,请刷新重试');
            }
        }
    }
    
    if(aOption.success != undefined){
        var cb = aOption.success;
        aOption.success = function(xResult){
            if(xResult.token != undefined){
                $('meta[name="csrf-token"]').attr('content',xResult.token);
            }
            cb(xResult);
        }
    }
    $.ajax(aOption);

}
var Global = {
    rootDomain: 'pmit.cn', //站点运行根域名
    //切换
    change: function (obj, callback) {
        $(document).on('click', obj, function () {
            $(obj).removeClass('active');
            $(this).addClass('active');
            if (callback) {
                callback.call(this);
            }
        });
    },
    //获取地址参数
    queryString: function (item) {
        var sValue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue
    },
    //初始化弹出层
    PlugIn: function (type, pid, resource) {
        //menu
        console.log(type, pid, resource);
        var PlugHtml = "";
        var PlugCss = "";
        if (type) {
            if (type == "module" || type == "menu" || type == "FormImg") {
                PlugCss = "";
            } else {
                PlugCss = "pm-plugin-small";
            }
            PlugHtml += (
                '<div id="PlugInMask"></div>' +
                '<div id="PlugInLibrary" class="pm-plugin-main pm-bg-white pm-plugin-InRight ' + PlugCss + '" data-type="' + type + '">' +
                    '<div class="pm-plugin-back" onclick=\"Global.ClosePlugIn()\"></div>' +
                    '<div class="pm-plugin-show pull-left">'
                );
            if (type == "module" || type == "menu") {
                PlugHtml += ('<div class="pm-plugin-funView">' +
                            '<div class="swiper-container">' +
                                '<div class="swiper-wrapper"><img src=""></div>' +
                                '<div class="swiper-pagination"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="pm-plugin-funDes">' +
                            '<div class="pm-plugin-funRow">' +
                                '<div class="pm-funDes-label">功能：</div>' +
                                '<div class="pm-funDes-bd"></div>' +
                            '</div>' +
                            '<div class="pm-plugin-funRow">' +
                                '<div class="pm-funDes-label">时间：</div>' +
                                '<div class="pm-funDes-bd"></div>' +
                            '</div>' +
                        '</div>'
                );
            } else if (type == "FormImg") {
                PlugHtml += (
                    '<div class="pm-plugin-ImgView">' +
                        '<div class="pm-plugin-ImgViewBd"></div>' +
                        '<div class="pm-item-editImg"><a href="javascript:;" class="edit"><i></i>编辑</a></div>' +
                        '<form method="post" id="MultipleEditForm"><input type="file" name="file" class="webuploader-element" id="editfile_fun" data-type="photo" accept="image/*"></form>' +
                    '</div>' +
                    '<div class="pm-plugin-ImgDes">' +
                        '<div class="pm-plugin-funRow">' +
                            '<div class="pm-funDes-label">图片名称</div>' +
                            '<div class="pm-funDes-bd">' +
                                '<div class="pull-right"><input type="text" class="pm-normal-text pm-clr-333" value="船票功能图标" id="Cname"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="pm-plugin-funRow">' +
                            '<div class="pm-funDes-label">所属标签</div>' +
                            '<div class="pm-funDes-bd">' +
                                '<select class="frame-select pull-right" id="ImgCategorySelect">' +
                                    '<option value="0" data-id="0">全部</option>' +
                                    '<option value="add">添加标签</option>' +
                                '</select>' +
                                '<input type="text" id="ImgCategoryName" class="pm-normal-text pm-clr-333 pull-right hide" placeholder="创建标签分类">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="pm-plugin-ImgUpload">' +
                        '<div class="webPicPicker">' +
                            '<div class="pm-plugin-UploadFile">' +
                                '<div class="webuploader-pick">' +
                                    '<img src="../skin/img/file.png">' +
                                '</div>' +
                                '<form method="post" id="MultipleUploadForm"><input type="file" name="file" class="webuploader-element" id="uploadfile_fun" data-type="photo" accept="image/*" multiple="multiple"/></form>' +
                            '</div>' +
                            '<div class="pm-plugin-UploadDes">点击选择文件<br>每次最多6张，每张小于2M</div>' +
                        '</div>' +
                    '</div>'
                );
            } else if (type == "settings") {
                var Setdata = $(".pm-temp-list[data=" + pid + "]");
                var Thumb = Setdata.find(".thumb").find('img').attr('src');
                var Title = Setdata.find(".title").text();
                var Description = Setdata.find(".desc").text();
                PlugHtml += (
                        "<div class='pm-plugin-SettingForm'>" +
                            '<div class="pm-plugin-funRow">' +
                                '<div class="pm-funDes-label">模板图片</div>' +
                                '<div class="pm-SettDes-bd">' +
                                    '<div class="pm-plugin-SettImgView pull-left">' +
                                        '<div class="pm-plugin-ImgViewBd"><img src="' + Thumb + '"></div>' +
                                        '<form method="post" id="MultipleSettingForm"><input type="file" name="file" class="webuploader-element" id="Settfile_fun" data-type="photo" accept="image/*"></form>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="pm-plugin-funRow">' +
                                '<div class="pm-funDes-label">模板名字</div>' +
                                '<div class="pm-SettDes-bd"><input type="text" class="pm-normal-text pm-clr-333" id="TempTitle" value="' + Title + '"></div>' +
                            '</div>' +
                            '<div class="pm-plugin-funRow">' +
                                '<div class="pm-funDes-label">备注说明</div>' +
                                '<div class="pm-SettDes-bd"><textarea class="pm-normal-textarea pm-clr-333" id="TempDescription" placeholder="请输入模板备注说明">' + Description + '</textarea></div>' +
                            '</div>' +
                            '<div class="pm-submit-bd text-center">' +
                                '<div class="pm-btn pm-btn-md pm-bg-blue">' +
                                    "<a href=\"javascript:;\" onclick=\"Global.ConfirmChoice('" + type + "','" + pid + "','" + resource + "')\">确认</a>" +
                                '</div>' +
                            '</div>' +
                        "</div>"
                    );
            } else if (type == "Updated") {
                PlugHtml += (
                        '<div class="">' +
                            '<div class="pm-submit-bd text-center">' +
                                '<div class="pm-btn pm-btn-md pm-bg-blue">' +
                                    "<a href=\"javascript:;\" onclick=\"Global.ConfirmChoice('" + type + "','" + pid + "','" + resource + "')\">确认</a>" +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    );
            }
            PlugHtml += ('</div>');
            if (type == "module" || type == "menu" || type == "FormImg") {
                PlugHtml += ('<div class="pm-plugin-operate pull-right">');
                if (type == "module" || type == "menu") {
                    PlugHtml += ('<div class="pm-plugin-tab pm-plugin-funtab tab2">' +
                            '<ul>' +
                                '<li class="cur" id="1"><a href="javascript:;"><span>我的功能</span></a></li>' +
                                '<li id="2"><a href="javascript:;"><span>默认功能</span></a></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="pm-plugin-funBd pm-plugin-funStyle"></div>' +
                        '<div class="pm-plugin-funList pm-plugin-funMy"></div>'
                        );
                    prev = "btn_pre";
                    next = "btn_next";
                } else if (type == "FormImg") {
                    PlugHtml += ('<div class="pm-plugin-tab pm-plugin-imgtab tab2">' +
                            '<ul>' +
                                '<li class="cur" id="1"><a href="javascript:;"><span>我的图片</span></a></li>' +
                                '<li id="2"><a href="javascript:;"><span>默认图片</span></a></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="pm-plugin-funBd pm-plugin-photoStyle"></div>' +
                        '<div class="pm-plugin-funList pm-plugin-photo"></div>'
                        );
                    prev = "btn_pre_img";
                    next = "btn_next_img";
                }
                PlugHtml += ('<div class="pm-submit-bd">' +
                            '<div class="pm-plugin-page pm-frame-page pull-left">' +
                                '<a href="javascript:;" id="' + prev + '">上一页</a>' +
                                '<a href="javascript:;">' +
                                    '<span id="pageIndex">1</span>/<span id="pageCount">1</span>页' +
                                '</a>' +
                                '<a href="javascript:;" id="' + next + '">下一页</a>' +
                            '</div>' +
                            '<div class="pm-btn pm-btn-md pm-bg-blue pm-btn-confirm pull-right">' +
                                "<a href=\"javascript:;\" onclick=\"Global.ConfirmChoice('" + type + "','" + pid + "','" + resource + "')\"><i></i>确认选择1</a>" +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');
            }
            if ($('body').find('#PlugInLibrary').length == 0) {
                $('body').append(PlugHtml);
                $('#PlugInMask').animate({
                    opacity: '1'
                });
            }
            Global.Initialization();//初始化操作
            if (type == "module" || type == "menu") {
                Global.InitialCurrAddedModule();//默认加载我的功能
                Global.LoadCurrAddedModule("", pageIndex, pageSize);
            } else if (type == "FormImg") { //默认加载我的图片
                Global.LoadMyPhotoCategory();
                Global.InitialMyPhotolist(0, "", 1);
                $("#btn_pre_img").click(function () {
                    pageIndex--;
                    if (pageIndex <= 0) {
                        pageIndex = 1;
                    } else {
                        var categoryId = $(".pm-plugin-photoStyle li.cur a").attr('data-id');
                        var id = $(".pm-plugin-imgtab li.cur").attr('id');
                        if (id == 1) {
                            Global.InitialMyPhotolist(categoryId, "", pageIndex);
                        } else {
                            Global.InitialDefaultPhotolist(categoryId, "", pageIndex);
                        }
                        $("#pageIndex").html(pageIndex);
                    }
                });
                $("#btn_next_img").click(function () {
                    pageIndex++;
                    if (pageIndex > pageCount) {
                        pageIndex = pageCount
                    } else {
                        var categoryId = $(".pm-plugin-photoStyle li.cur a").attr('data-id');
                        var id = $(".pm-plugin-imgtab li.cur").attr('id');
                        if (id == 1) {
                            Global.InitialMyPhotolist(categoryId, "", pageIndex);
                        } else {
                            Global.InitialDefaultPhotolist(categoryId, "", pageIndex);
                        }
                        $("#pageIndex").html(pageIndex);
                    }
                });
                Global.InitialUploadImageForm("MultipleUploadForm", Global.queryString("ecid"), resource, 0, function (jsobj) {
                    Global.InitialMyPhotolist(0, "");
                });

                $("#editfile_fun").change(function () { //修改图片
                    $("#MultipleEditForm").submit();
                });

                $("#uploadfile_fun").change(function () { //上传图片
                    $("#MultipleUploadForm").submit();
                });

                $("#ImgCategoryName").blur(function () {
                    var Name = $(this).val();
                    if (Name) {
                        Global.CategoryAdd(Name);
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
                        Global.UpdateImageResource(ID, Title, CategoryId);
                    }
                });
            } else if (type == "settings") { //默认加载模板信息
                Global.InitialUploadImageForm("MultipleSettingForm", Global.queryString("ecid"), "template", pid, function (jsobj) {
                    if (jsobj.status == 1) {
                        $(".pm-plugin-SettImgView .pm-plugin-ImgViewBd img,.pm-temp-list[data='" + pid + "'] .thumb img").attr('src', jsobj.data);
                        $(".pm-plugin-ImgViewBd").addClass("pm-plugin-ImgOpacity");
                    }
                });

                $("#Settfile_fun").change(function () { //修改模板图片
                    $("#MultipleSettingForm").submit();
                });

                $("#TempTitle").blur(function () { //修改模板标题
                    $(".pm-temp-list[data='" + pid + "'] .pm-temp-info .title").html($(this).val());
                    //Global.ConfirmChoice(type, pid, "template");
                });

                $("#TempDescription").blur(function () { //修改模板描述
                    $(".pm-temp-list[data='" + pid + "'] .pm-temp-info .desc").html($(this).val());
                    //Global.ConfirmChoice(type, pid, "template");
                });
            }
        }
    },
    //加载我的图片标签分类
    LoadMyPhotoCategory: function () {
        $.ajax({
            type: "get",
            url: '/category/list?ecid=' + ecid,
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                var CategoryHtml = "";
                CategoryHtml += ("<span>分类标签：</span><ul><li><i></i><a href=\'javascript:;\' data-id='0' onclick=\"Global.InitialMyPhotolist('0','','1')\">全部</a></li>");
                if (data.status == 1 && data.data.length > 0) {
                    var CategoryVal = "<option value=\"0\" data-id=\"0\">全部</option>";
                    $.each(data.data, function (i, v) {
                        CategoryHtml += ("<li><i onclick=\"Global.DeleteCategory('" + v.ID + "',this)\"></i><a href=\"javascript:;\" data-id=" + v.ID + " title=" + v.Name + " onclick=\"Global.InitialMyPhotolist('" + v.ID + "','','1')\">" + v.Name + "</a></li>");
                        CategoryVal += ("<option id=" + v.ID + " value=" + v.ID + ">" + v.Name + "</option>");
                    });
                    CategoryVal += "<option value=\"add\">添加标签</option>";
                    $("#ImgCategorySelect").html(CategoryVal);
                }
                CategoryHtml += ('</ul><s');
                $(".pm-plugin-photoStyle").addClass("pm-plugin-MyphotoStyle").html(CategoryHtml).find('li:first').addClass('cur').find('a').trigger("click");
            }
        });
    },
    //添加我的图片分类
    CategoryAdd: function (Name) {
        var jsonStr = {
            ecid: ecid,
            Name: Name
        }
        $.post("/category/add", jsonStr, function (jsobj) {
            layer.closeAll();
            if (jsobj.status == 1) {
                layer.msg(jsobj.message);
                var StyleHtml = "";
                StyleHtml += ("<li><i onclick='Global.DeleteCategory(" + jsobj.data + ",this)'></i><a href='javascript:;' data-id='" + jsobj.data + "' onclick=\"Global.InitialMyPhotolist('" + jsobj.data + "','','1')\">" + Name + "</a></li>");
                $(".pm-plugin-photoStyle ul").append(StyleHtml);

                //.find('span').show()
                $("#ImgCategorySelect option:first").after("<option id=" + jsobj.data + ">" + Name + "</option>");
                $("#ImgCategorySelect option").removeAttr('selected');
                $("#ImgCategorySelect option:eq(1)").attr("selected", true);
            } else {
                layer.msg(jsobj.message);
            }
        }, "json")
    },
    //删除我的图片分类
    DeleteCategory: function (Id, obj) {
        layer.confirm('确认要删除该分类标签?', { icon: 3, title: '提示' }, function (index) {
            layer.load(0, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            $.post("/category/delete/" + Id, null, function (jsobj) {
                layer.closeAll();
                if (jsobj.status == 1) {
                    layer.msg(jsobj.message);
                    obj.parentNode.remove();
                    $("#ImgCategorySelect").find('option[id=' + Id + ']').remove();
                } else {
                    layer.msg(jsobj.message);
                }
            }, "json")
        })
    },
    //更新我的图片名称和类别
    UpdateImageResource: function (ID, Title, CategoryId) {
        if (ID && Title && CategoryId) {
            var jsonStr = {
                ID: ID,
                Title: Title,
                CategoryId: CategoryId
            }
            $.post("/imageresource/update", jsonStr, function (jsobj) {
                layer.closeAll();
                if (jsobj.status == 1) {
                    layer.msg(jsobj.message);
                } else {
                    layer.msg(jsobj.message);
                }
            }, "json");
        }
    },
    //加载我的图片列表
    InitialMyPhotolist: function (categoryId, keyword, currPageIndex) {
        $(".pm-plugin-photoStyle li").removeClass('cur').find("a[data-id=" + categoryId + "]").parent().addClass('cur');
        $(".pm-plugin-photo").empty();
        if (!categoryId) {
            categoryId = 0;
        }
        if (!keyword) {
            keyword = "";
        }
        $.ajax({
            type: "get",
            url: '/imageresource/list?ecid=' + ecid + '&categoryId=' + categoryId + '&pageIndex=' + currPageIndex + '&pageSize=' + pageSize + "&keyword=" + keyword,
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.status == 1 && data.data.length > 0) {
                    pageCount = data.totalCount % pageSize == 0 ? data.totalCount / pageSize : (parseInt(data.totalCount / pageSize) + 1);
                    pageIndex = currPageIndex;
                    $("#pageCount").html(pageCount);
                    $("#pageIndex").html(pageIndex);
                    var PhotoHtml = "";
                    PhotoHtml += ('<ul>');
                    $.each(data.data, function (i, v) {
                        PhotoHtml += ("<li><a href='javascript:;'><i onclick=\"Global.DeleteImg('" + v.ID + "',this)\"></i><p onclick=\"Global.ExistingPhotoList('" + v.ID + "','" + v.Img + "','" + v.Title + "','" + v.CategoryId + "')\" data-id=" + v.ID + "><img src='" + v.Img + "'></p></a><b>" + v.Title + "</b></li>");
                    });
                    PhotoHtml += ('</ul>')
                    $(".pm-plugin-photo").html(PhotoHtml).find("li:first a").addClass('cur').find('p').trigger("click");

                } else {
                    pageCount = 1;
                    pageIndex = 1;
                    $("#pageCount").html(pageCount);
                    $("#pageIndex").html(pageIndex);
                }
            }
        });
    },
    //图片列表选中修改
    ExistingPhotoList: function (ID, Img, Title, CategoryId) {
        $('.pm-plugin-funList a').removeClass('cur');
        $(".pm-plugin-funList p[data-id='" + ID + "']").parent().addClass('cur');
        if (!Title) {
            Title = '船票功能图标';
        }
        $(".pm-plugin-ImgDes #Cname").val(Title);
        Global.setSelectChecked('ImgCategorySelect', CategoryId);
        $(".pm-plugin-ImgViewBd").html("<img src='" + Img + "' data-id=" + ID + ">").addClass("pm-plugin-ImgOpacity");

        Global.InitialUploadImageForm("MultipleEditForm", ecid, "", ID, function (data) {
            if (data.status == 1) {
                $(".pm-plugin-photo a.cur img,.pm-plugin-ImgViewBd img").attr('src', data.data);
                $(".pm-plugin-ImgViewBd").addClass("pm-plugin-ImgOpacity");
            }
        });
    },
    //自动选择所属分类标签
    setSelectChecked: function (selectId, checkValue, checkName) {
        var select = document.getElementById(selectId);
        for (var i = 0; i < select.options.length; i++) {
            if (checkValue == 0) {
                if (select.options[i].text == checkName) {
                    select.options[i].selected = true;
                    break;
                }
            } else {
                if (select.options[i].value == checkValue) {
                    select.options[i].selected = true;
                    break;
                }
            }
        }
    },
    //删除我的图片
    DeleteImg: function (ID, obj) {
        layer.confirm('确认要删除该图片?', { icon: 3, title: '提示' }, function (index) {
            layer.load(0, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            var jsonStr = {
                ecid: ecid,
                Id: ID
            }
            var Categoryid = $(".pm-plugin-photoStyle li.cur a").attr('data-id');
            $.post("/imageresource/delete", jsonStr, function (jsobj) {
                layer.closeAll();
                if (jsobj.status == 1) {
                    layer.msg(jsobj.message);
                    obj.parentNode.parentNode.remove();
                    $(".pm-plugin-ImgView .pm-plugin-ImgViewBd").empty();
                    Global.InitialMyPhotolist(Categoryid, "", $("#pageIndex").text());
                } else {
                    layer.msg(jsobj.message);
                }
            }, "json")
        });
    },
    //初始化默认图片分类
    InitialDefaultPhotoCategory: function () {
        $.ajax({
            type: "get",
            url: '/category/list?ecid=0',
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.status == 1 && data.data.length > 0) {
                    var PhotoCategoryHtml = "";
                    var CategoryVal = "";
                    PhotoCategoryHtml += ("<span>分类标签：</span><ul><li><i></i><a href=\'javascript:;\' data-id='0' onclick=\"Global.InitialDefaultPhotolist('0','','1')\">全部</a></li>");
                    $.each(data.data, function (i, v) {
                        PhotoCategoryHtml += ("<li><i></i><a href=\"javascript:;\" data-id=" + v.ID + " title=" + v.Name + " onclick=\"Global.InitialDefaultPhotolist('" + v.ID + "','','1')\">" + v.Name + "</a></li>");
                    });
                    PhotoCategoryHtml += ('</ul>');
                    $(".pm-plugin-photoStyle").removeClass("pm-plugin-MyphotoStyle").html(PhotoCategoryHtml).find('li:first').addClass('cur').find('a').trigger("click")
                }
            }
        });
    },
    //加载默认图片列表
    InitialDefaultPhotolist: function (categoryId, keyword, currPageIndex) {
        $(".pm-plugin-photoStyle li").removeClass('cur').find("a[data-id=" + categoryId + "]").parent().addClass('cur');
        $(".pm-plugin-photo").empty();
        if (!categoryId) {
            categoryId = 0;
        }
        if (!keyword) {
            keyword = "";
        }
        $.ajax({
            type: "get",
            url: '/imagecommon/list?categoryId=' + categoryId + '&pageIndex=' + currPageIndex + '&pageSize=' + pageSize + "&keyword=" + keyword,
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.status == 1 && data.data.length > 0) {
                    pageCount = data.totalCount % pageSize == 0 ? data.totalCount / pageSize : (parseInt(data.totalCount / pageSize) + 1);
                    pageIndex = currPageIndex;
                    $("#pageCount").html(pageCount);
                    $("#pageIndex").html(pageIndex);
                    var DefaultPhotoHtml = "";
                    DefaultPhotoHtml += ('<ul>');
                    $.each(data.data, function (i, v) {
                        DefaultPhotoHtml += ("<li><a href='javascript:;'><p onclick=\"Global.ExistingPhotoList('" + v.ID + "','" + v.Img + "','" + v.Title + "','" + v.CategoryId + "')\" data-id=" + v.ID + "><img src='" + v.Img + "'></p></a><b>" + v.Title + "</b></li>");
                    });
                    DefaultPhotoHtml += ('</ul>')
                    $(".pm-plugin-photo").html(DefaultPhotoHtml).find("li:first a").addClass('cur').find('p').trigger("click");

                } else {
                    pageCount = 1;
                    pageIndex = 1;
                    $("#pageCount").html(pageCount);
                    $("#pageIndex").html(pageIndex);
                }
            }
        });
    },
    //初始化我的功能(加载功能列表)
    InitialCurrAddedModule: function () {
        ajax({
            type: "get",
            //url: '/moduletype/added?ecid=' + ecid,
            url:'my-module-list.json',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.data.length > 0) {
                    currAddedModule = data.data;
                    modulePageCount = data.data.length % modulePageSize == 0 ? data.data.length / modulePageSize : (parseInt(data.data.length / modulePageSize) + 1);
                    $("#pageCount").html(modulePageCount);
                    var pageHtml = "";
                    for (var i = 1; i <= pageCount; i++) {
                        pageHtml += "<option>" + i + "</option>";
                    }
                    Global.LoadCurrAddedModule("", modulePageIndex, modulePageSize);
                } else {
                    $(".pm-plugin-funtab li[id=2]").click();
                }
            }
        });

    },
    //加载我的功能列表
    LoadCurrAddedModule: function (addedid, pageIndex, pageSize) {
        var AddedHtml = "";
        if (!addedid) {
            addedid = 0;
        }

        AddedHtml += ('<ul>');
        if (addedid) {
            $("#pageIndex").html(1);
            $("#pageCount").html(1);
            if (currAddedModule) {
                $.each(currAddedModule, function (i, v) {
                    if (v.biztypeid == addedid) {
                        //mid 我功能列表id  id 功能表id
                        AddedHtml += ("<li class=\"isusing_" + v.IsUsing + "\"><a href='javascript:;'><span>使用中</span><i onclick=\"Global.Deleteroot('" + v.mid + "',this)\"></i><p onclick=\"Global.ExistingModulesMenu('" + v.id + "','1')\" data='" + v.id + "," + v.wap_url + "," + v.name + ",1' data-moduletypeid=" + v.id + "><img src='"+ v.icon +"'>" + v.name + "</p></a></li>");
                    }
                });
            } else {

            }

        } else {
            $("#pageIndex").html(pageIndex);
            if (currAddedModule) {
                $.each(currAddedModule, function (i, v) {
                    if (i >= (pageIndex - 1) * pageSize && i < pageSize * pageIndex) {
                        AddedHtml += ("<li class=\"isusing_" + v.IsUsing + "\"><a href='javascript:;'><span>使用中</span><i onclick=\"Global.Deleteroot('" + v.mid + "',this)\"></i><p onclick=\"Global.ExistingModulesMenu('" + v.id + "','1')\" data='" + v.id + "," + v.wap_url + "," + v.name + ",1' data-moduletypeid=" + v.id + "><img src='"+ v.icon +"'>" + v.name + "</p></a></li>");
                    }
                });
            } else {

            }
        }
        AddedHtml += ('</ul>')
        $(".pm-plugin-funMy").html(AddedHtml).find('li:first p').trigger("click");
    },
    //请求业务模块类别(我的功能默认功能分类)
    Getbiztype: function (json) {
        if ($(".pm-plugin-funBd li").length == 0) {
            ajax({
                url:'module-category.json',
                type:'get',
                success:function(data){
                    if (data.status == 1 && data.data.length > 0) {
                        var BizTypeHtml = "";
                        BizTypeHtml += ("<ul><li><a href=\"javascript:;\" onclick=\"Global.showErJikMenu('','1','12')\" class='cur' bizid='0'>全部</a></li>");
                        $.each(data.data, function (k, v) {
                            BizTypeHtml += (
                                "<li><a href=\"javascript:;\" onclick=\"Global.showErJikMenu('" + v.id + "','1','12')\" bizid=" + v.id + ">" + v.name + "</a></li>"
                            )
                        });
                        BizTypeHtml += ('</ul>');
                        $(".pm-plugin-funBd").html(BizTypeHtml);
                    }
                }
            });
        } else {
            return;
        }
    },
    //初始化业务模块列表(获取所有项目)
    InitialBizModuleList: function () {
        ajax({
            url: "module-list.json",
            async: false,
            success: function (data) {
                layer.closeAll();
                if (data.data.length > 0) {
                    bizModuleList = data.data;
                    bizPageCount = data.data.length % bizPageSize == 0 ? data.data.length / bizPageSize : (parseInt(data.data.length / bizPageSize) + 1);
                    $("#pageCount").html(bizPageCount);
                    var pageHtml = "";
                    for (var i = 1; i <= bizPageCount; i++) {
                        pageHtml += "<option>" + i + "</option>";
                    }
                    Global.showErJikMenu("", bizPageIndex, bizPageSize);
                }
            }
        });
    },
    //根据业务模块类别ID筛选二级菜单模块
    showErJikMenu: function (biztypeid, pageIndex, pageSize) {
        var MenuHtml = "";
        MenuHtml += ('<ul>')
        if (biztypeid && biztypeid != "0") {
            $("#pageIndex").html(1);
            $("#pageCount").html(1);
            bizPageCount = 1;
            $.each(bizModuleList, function (i, v) {
                if (v.pid == biztypeid) {
                    MenuHtml += ("<li data-hint='" + v.description + "'><a href='javascript:;'><p onclick=\"Global.ExistingModulesMenu('" + v.id + "','2')\" data='" + v.bizmoduleid + "," + v.moduletypeid + "," + v.wap_url + "," + v.id + "," + v.name + ",," + v.ParentModuleID + ",2' data-bizmoduleid='" + v.id + "'><img src='"+ v.icon +"'>" + v.name + "</p></a></li>");
                }
            });
        } else {
            $("#pageIndex").html(pageIndex);
            bizPageCount = bizModuleList.length % bizPageSize == 0 ? bizModuleList.length / bizPageSize : (parseInt(bizModuleList.length / bizPageSize) + 1);
            $("#pageCount").html(bizPageCount);
            biztypeid = 0;
            $.each(bizModuleList, function (i, v) {
                if (i >= (pageIndex - 1) * pageSize && i < pageSize * pageIndex) {
                    MenuHtml += ("<li data-hint='" + v.description + "'><a href='javascript:;'><p onclick=\"Global.ExistingModulesMenu('" + v.id + "','2')\" data='" + v.bizmoduleid + "," + v.moduletypeid + "," + v.wap_url + "," + v.id + "," + v.name + ",," + v.ParentModuleID + ",2' data-bizmoduleid='" + v.id + "'><img src='"+ v.icon +"'>" + v.name + "</p></a></li>");
                }
            });
        }
        MenuHtml += ('</ul>')
        $(".pm-plugin-funDefault").html(MenuHtml).find('li:first p').trigger("click");
        $('.pm-plugin-funBd a').removeClass('cur');
        $('.pm-plugin-funBd a[bizid=' + biztypeid + ']').addClass('cur');

    },
    //选择功能菜单mid 我的功能id id 功能id wapurl url
    ExistingModulesMenu: function (id,source) {
        //去掉当前列表高亮
        $('.pm-plugin-funList a').removeClass('cur');
        if (source == '1') {
            //高亮选中的            
            $(".pm-plugin-funMy p[data-moduletypeid='" + id + "']").parent().addClass('cur');
            for (var i = 0; i < currAddedModule.length; i++) {
                //找到点击的设置功能和时间
                if (currAddedModule[i].id == id) {
                    $(".pm-plugin-funDes .pm-plugin-funRow:eq(0) .pm-funDes-bd").html(currAddedModule[i].name + "（" + currAddedModule[i].en_name + "）");
                    $(".pm-plugin-funDes .pm-plugin-funRow:eq(1) .pm-funDes-bd").html(currAddedModule[i].create_time);
                }
            }
        } else {
            $(".pm-plugin-funDefault p[data-bizmoduleid='" + id + "']").parent().addClass('cur');
            for (var i = 0; i < bizModuleList.length; i++) {
                if (bizModuleList[i].id == id) {
                    $(".pm-plugin-funDes .pm-plugin-funRow:eq(0) .pm-funDes-bd").html(bizModuleList[i].name + "（" + bizModuleList[i].en_name + "）");
                    $(".pm-plugin-funDes .pm-plugin-funRow:eq(1) .pm-funDes-bd").html(bizModuleList[i].description);
                }
            }
        }

        //(点击功能获取某一个详情)获取功能预览图
        ajax({
            type: "get",
            // url: "/bizmodule/detail?bizmoduleid=" + bizmoduleid,
            url: 'module-detail.json?id='+id,
            dataType: 'json',
            async: false,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                var imgArr = [];
                var imgHtml = "";
                if (data.data.image1) {
                    imgArr.push(data.data.image1);
                }
                if (data.data.image2) {
                    imgArr.push(data.data.image2);
                }
                if (data.data.image3) {
                    imgArr.push(data.data.image3);
                }
                if (imgArr && imgArr.length > 0) {
                    $.each(imgArr, function (i, v) {
                        imgHtml += ("<div class='swiper-slide'><img src='" + v + "'></a></div>")
                    });
                    $(".pm-plugin-funView .swiper-wrapper").html(imgHtml);
                    Global.initSwiper();
                }
            }
        });

    },
    //删除未使用的功能
    Deleteroot: function (mid, obj) {
        layer.confirm('确认要删除该功能?', { icon: 3, title: '提示' }, function (index) {
            layer.load(0, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            var jsonSrt = {
                "ecid": ecid,
                "ModuleTypeId": mid
            }
            $.post("/moduletype/deleteroot/", jsonSrt, function (jsobj) {
                layer.closeAll();
                if (jsobj.status == 1) {
                    layer.msg(jsobj.message);
                    //obj.parentNode.parentNode.remove();
                    Global.InitialCurrAddedModule();
                    Global.LoadCurrAddedModule("", pageIndex, pageSize);
                } else {
                    layer.msg(jsobj.message);
                }
            }, "json")
        });
    },
    //保存选择设置
    ConfirmChoice: function (type, pid, resource) {
        var moduleTypeId = $("#ModuleTypeID").val();
        
        if (type == "module" || type == "menu") {
            if ($(".pm-plugin-funList li a").hasClass('cur')) {
                var data = $(".pm-plugin-funList li a.cur p").attr('data').split(',');
                //data[0] id data[1] wap data[2] name data[3] type
                var name = data[2];
                var id = data[0];
                var wapUrl = data[1];
                //设置隐藏字段的值
                $('#moduleid').val(id);
                $("#moduleName").val(name);
                
//                //204
//                $("#BizModuleid").val(data[0]);
//                //133466
//                $("#ModuleTypeID").val(data[1]);
//                //106 具体项目id
//                $("#Moduleid").val(data[3]);
//                //名称(多级表单)
//                $("#ModuleName").val(data[5]);
//                //12
//                $("#parentmoduleid").val(data[6]);
                //bizmoduleid, moduletypeid, wapurl, moduleid, bizmodulename, modulename, parentmoduleid, source
                if (type == 'module') {
                    //功能选择标题
                    $('#Configuration').find('#FunctionTitle').val(name);
                    
                    //自定义链接
                    if (id == '24') {
                        $("#CustomLink").show();
                    } else {
                        $("#CustomLink").hide();
                    }
                    $("#ConfigMenu").hide();
                    SaveFunModule('module', moduleTypeId);
                } else {
                    $("#Configuration").hide();
                    $("#ConfigMenu").show().find('#MenuFunction').val(name);
                    if (name) {
                        $('#MenuName').val(name);
                    }
                    if (id == '24') {
                        $("#ShowMenuBd .pm-item-row:eq(3)").show();
                    } else {
                        $("#ShowMenuBd .pm-item-row:eq(3)").hide();
                    }
                    SaveFunModule('menu');
                }
                $("#configure").hide();
                Global.ClosePlugIn();
                GenerateTest();
            } else {
                layer.msg('请选择功能');
            }
        } else if (type == "FormImg") { //保存图片设置
            var ImgUrl = "";
            var id = $(".pm-plugin-imgtab li.cur").attr('id');
            if (id == 1) {
                ImgUrl = $(".pm-plugin-photo li a.cur img").attr('src');
            } else {
                var imageId = $(".pm-plugin-photo li a.cur p").attr('data-id');
                $.ajax({
                    type: "post",
                    url: "/imagecommon/copytoimageresource?ecid=" + Global.queryString("ecid") + "&imageId=" + imageId,
                    dataType: 'json',
                    async: false,
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        if (data.status == 1) {
                            ImgUrl = data.data;
                        }
                    }
                });
            }
            $("#" + pid).attr('src', ImgUrl);
            if (resource == 'module' || resource == 'function' || resource == 'image') {
                $("#page-content .widget_view_selected .swiper-wrapper img").attr('src', ImgUrl);
                GenerateTest();
            }
            if (resource == 'tabbar_icon') {
                $("#" + pid).attr('src', ImgUrl);
                SaveFunModule('menu');
            } else if (resource == 'navibar_img') {
                $('.cter-navigation').html('<img src="' + ImgUrl + '">');
                Global.UpdateBasicSettings(0, resource, ImgUrl, Global.queryString("TempID"));
            } else if (resource == 'slide') {
                $("#" + pid).attr('src', ImgUrl);
                UpdateShellN();
                GenerateTest();
            } else if (resource == "module" || resource == "function") {
                SaveFunModule('module', moduleTypeId);
            } else if (resource == 'icon' || resource == 'loading' || resource == 'cover' || resource == 'bg' || resource == 'help' || resource == 'ECClientInfo') {
                var objid = $("#" + pid).removeAttr('src').find('img').attr('bojectid');
                $("#" + pid).html('<img src="' + ImgUrl + '">');
                if (resource == 'ECClientInfo') {
                    $(".pm-clientdown-bd").css('backgroundImage', 'url(' + ImgUrl + ')');
                }
                if (!objid) {
                    objid = 0;
                }
                Global.UpdateBasicSettings(objid, resource, ImgUrl, 0);
            }
            Global.ClosePlugIn();
        } else if (type == "settings") { //保存模板信息设置
            var Thumb = $('.pm-plugin-SettImgView .pm-plugin-ImgViewBd img').attr('src');
            var Title = $('#TempTitle').val();
            var Description = $('#TempDescription').val();
            if (Title && pid && Thumb) {
                layer.load(0, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
                if (Thumb.indexOf('../skin/img/temp.jpg') == 0) {
                    Thumb = "";
                }
                var jsonStr = {
                    ecid: ecid,
                    Id: pid,
                    Title: Title,
                    Description: Description,
                    Thumb: Thumb
                }
                $.post("/apptemplate/updateinfo", jsonStr, function (jsobj) {
                    layer.closeAll();
                    if (jsobj.status == 1) {
                        layer.msg(jsobj.message);
                        Global.ClosePlugIn();
                    } else {
                        layer.msg(jsobj.message);
                    }
                }, "json");
            }
        }
    },
    //初始化操作
    Initialization: function () {
        /*
        ****功能Tab选项卡
        */
        $(".pm-plugin-funtab li").click(function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var TabElm = $(this).index();
            if (TabElm == 0) {
                $('.pm-plugin-funBd').empty();
                $('.pm-plugin-funList').empty().removeClass('pm-plugin-funDefault').addClass('pm-plugin-funMy');
                $(".pm-plugin-funDes .pm-plugin-funRow:eq(1) .pm-funDes-label").html('时间：');
                pageIndex = 1;
                Global.InitialCurrAddedModule();
                Global.LoadCurrAddedModule("", pageIndex, pageSize);
            } else {
                $('.pm-plugin-funList').empty().removeClass('pm-plugin-funMy').addClass('pm-plugin-funDefault');
                $(".pm-plugin-funDes .pm-plugin-funRow:eq(1) .pm-funDes-label").html('介绍：');
                pageIndex = 1;
                Global.Getbiztype();
                Global.InitialBizModuleList();
                Global.showErJikMenu("", pageIndex, pageSize);
            }
        });

        /*
        ****图片Tab选项卡
        */
        $(".pm-plugin-imgtab li").click(function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var TabElm = $(this).index();
            if (TabElm == 0) {
                pageIndex = 1;
                Global.LoadMyPhotoCategory();
                Global.InitialMyPhotolist(0, "", 1);
                $(".pm-plugin-ImgView .pm-item-editImg,#MultipleEditForm").show();
            } else {
                pageIndex = 1;
                Global.InitialDefaultPhotoCategory();
                Global.InitialDefaultPhotolist(0, "", 1);
                $(".pm-plugin-ImgView .pm-item-editImg,#MultipleEditForm").hide();
            }
        });

        /*
        ****图片分类Tab选项卡
        */

        $(".pm-plugin-photo a").click(function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var Cval = $(this).attr('Cid');
            Global.InitialMyPhotolist(Cval, "");
        });


        /*
        ****上一页
        */
        $("#btn_pre").click(function () {
            presentElm = $('.pm-plugin-funtab li.cur').attr('id');
            if (presentElm == '1') {
                modulePageIndex--;
                if (modulePageIndex <= 0) {
                    modulePageIndex = 1;
                }
                Global.LoadCurrAddedModule("", modulePageIndex, modulePageSize);
            } else {
                var bizid = $(".pm-plugin-funStyle li a.cur").attr("bizid");
                bizPageIndex--;
                if (bizPageIndex <= 0) {
                    bizPageIndex = 1;
                }
                Global.showErJikMenu(bizid, bizPageIndex, bizPageSize);
            }
        });
        /*
        ****下一页
        */
        $("#btn_next").click(function () {
            presentElm = $('.pm-plugin-funtab li.cur').attr('id');
            if (presentElm == '1') {
                modulePageIndex++;
                if (modulePageIndex > modulePageCount) {
                    modulePageIndex = modulePageCount
                }
                Global.LoadCurrAddedModule("", modulePageIndex, modulePageSize);
            } else {
                var bizid = $(".pm-plugin-funStyle li a.cur").attr("bizid");
                bizPageIndex++;
                if (bizPageIndex > bizPageCount) {
                    bizPageIndex = bizPageCount;
                }
                Global.showErJikMenu(bizid, bizPageIndex, bizPageSize);
            }
        });
        /*
          ****修改图片分类
          */
        $(".pm-plugin-ImgDes #Cname").blur(function () {
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
                Global.UpdateImageResource(ID, Title, CategoryId);
            }
        });
    },
    //关闭弹出层
    ClosePlugIn: function () {
        $("#PlugInLibrary").removeClass('pm-plugin-InRight').addClass('pm-plugin-OutRight');
        $("#PlugInMask").animate({
            opacity: '0'
        }, 500);
        setTimeout(function () {
            $("#PlugInLibrary,#PlugInMask").remove();
        }, 1000);
    },
    //功能轮播图
    initSwiper: function () {
        if ($('.swiper-wrapper .swiper-slide').size() > 1) {
            mySwiper = new Swiper('.swiper-container', {
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
    },
    //更新图片
    UpdateBasicSettings: function (id, resource, imgUrl, templateId) {
        if (resource && imgUrl) {
            var jsonStr = {
                "id": id,
                "ecid": ecid,
                "TemplateId": templateId,
                "ResourceType": resource,
                "ImgUrl": imgUrl
            }
            $.ajax({
                type: "post",
                url: "/BasicSettings/Update",
                data: jsonStr,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 0) {
                        layer.msg(data.message);
                    }
                }
            });
        }
    },
    //初始化上传图片的Form
    InitialUploadImageForm: function (formId, ecid, resourcetype, resoureId, callback) {
        $("#" + formId).ajaxForm({
            type: "post",
            url: "/Upload/Image?ecid=" + ecid + "&resourcetype=" + resourcetype + "&resoureId=" + resoureId,
            dataType: "json",
            //提交前
            beforeSubmit: function () {
                layer.load(1, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
            },
            //响应成功后
            success: function (data) {
                layer.closeAll();
                layer.msg(data.message);
                callback(data);
            },
            //响应失败
            error: function () {
                layer.closeAll();
                layer.msg("请求上传图片失败");
            }
        })
    },
    //初始化颜色选择控件
    InitialColorSelect: function (selectId, resourcetype, colid, colval, purpose) {
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
                    $("#page-content .widget_view_selected .funcs").css('backgroundColor', "#" + hex).attr('data-val', hex);
                    AutoSave();
                } else if (resourcetype == "fun_fontcolor") {
                    $("#page-content .widget_view_selected .funcs").find('p').css('color', '#' + hex).attr('data-val', hex);
                    AutoSave();
                } else {
                    self.InitialColorSetting(selectId, resourcetype, hex, purpose);
                }
            }
        });
    },
    //初始化设置颜色
    InitialColorSetting: function (selectId, ResourceType, ResourceValue, Purpose) {
        layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        if (ResourceType == "bgcolor") {
            TempID = 0;
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

        } else if (ResourceType == "fun_bgcolor") {
            $("#FunBgSelect").css('backgroundColor', ResourceValue);
            $("#page-content .widget_view_selected ." + Purpose).css('backgroundColor', ResourceValue).attr('data-val', ResourceValue.replace('#', ''));
            AutoSave();
        } else {
            var jsonStr = {
                'ecid': ecid,
                'ResourceType': ResourceType,
                'ResourceValue': ResourceValue,
                'TemplateId': TempID
            }
            $.ajax({
                type: "post",
                url: "BasicSettings/ColorConfig",
                data: jsonStr,
                dataType: 'json',
                success: function (data) {
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
}
//改变窗口大小轮播图自动适配
$(window).resize(function () {
    Global.initSwiper();
});

//自动给css、js、图片追加版本号
$(function () {
    var timestamp = Date.parse(new Date()) / 1000;

    //$.each($(document).find('link').attr('href'), function () {
    //    alert('111');
    //});
})