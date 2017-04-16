
function getHashStringArgs() {
    var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : ""),
            hashArgs = {},
            items = hashStrings.length > 0 ? hashStrings.split("&") : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length > 0) {
            hashArgs[name] = value;
        }
    }
    return hashArgs;
}

function _setNav() {
    $(window).height();
    $('.nav_panle').css('min-height', $(window).height() - $(".div_header").height());
    $('.div_mainbox').css('min-height', $(window).height() - $(".div_header").height());
    $('.J-mainMennu').click(function () {
        $('.my_dropmenu').slideToggle("slow");
    });

    //绑定点击下拉事件
    $('.J-leftAccordion').find('.link').click(function () {
        var $li = $(this).closest('.J-leftMune');
        $li.closest('.J-leftMune').toggleClass('open').find('.submenu').slideToggle("fast");
    });
    
    //hash记录点击所属板块和自动展开当前选项卡
    $('.J-leftAccordion').find('a').each(function () {
        var $ul = $(this).closest('.J-leftAccordion');
        var navId = $ul.data('nav');
        var url = $(this).attr('href');
        $(this).attr('href',url + '#n=' + navId);
        $(this).removeClass('lnav_hover');
        if(window.location.pathname.indexOf(url) !== -1){
            $(this).closest('.J-leftMune').find('.link').click();
            $(this).addClass('lnav_hover');
        }
    });

    $('.J-topMenuItem').click(function () {
        $('.J-topMenuItem').removeClass('active');
        $(this).addClass('active');
        var navId = $(this).data('nav');
        location.hash = '#n=' + navId;
        //先关闭左侧所有
        $('.J-leftAccordion').hide();
        //找到要切换的菜单显示
        $('.J-leftAccordion[data-nav="' + navId + '"]').show();
        var $clickDom = $('.J-leftAccordion[data-nav="' + navId + '"]').find('.J-leftMune:first').addClass('open').find('.submenu').show("fast");
    });
    var oHash = getHashStringArgs();
    if (oHash.n != undefined) {
        var $topMenuItem = $(".J-topMenuItem[data-nav='" + oHash.n + "']");        
        if ($topMenuItem.length != 0) {
            return $(".J-topMenuItem[data-nav='" + oHash.n + "']").click();
        }
        return $('.J-topMenuItem:first').click();
    }
    
}
$(function () {
    _setNav();
    $('.J-dropDomAccount').click(function(){
        $(this).closest('div').find('ul').slideToggle("fast");
    });
});