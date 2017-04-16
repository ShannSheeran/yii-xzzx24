<?php

use bases\lib\Url;
?>
<div class="framework-topbar">
    <div class="console-topbar">
        <div class="topbar-wrap topbar-clearfix">
            <div class="topbar-head topbar-left">
                <a href="<?php echo Url::to(['manager/index']); ?>" class="topbar-logo topbar-left">
                    <span class="icon-logo">小主在线 | 红人商业合作平台 </span>
                </a>
                <?php                
                foreach ($aMenuConfig as $key => $aMenu) {?>
                    <a style="display: none;" data-menu-target='m-<?php echo $aMenu['id']; ?>' class="topbar-home-link topbar-btn topbar-left">
                        <span> <?php echo $aMenu['title']; ?></span>
                    </a>
                <?php }?>                

            </div>
            <div class="topbar-info topbar-right">
                <a data-reload data-tips-text='刷新' class=" topbar-btn topbar-left topbar-info-item text-center" style='width:50px;'>
                    <span class='glyphicon glyphicon-refresh'></span>
                </a>
                <div class="topbar-left topbar-user">
                    <div class="dropdown topbar-info-item">
                        <a href="#" class="dropdown-toggle topbar-btn text-center" data-toggle="dropdown">
                            <span><span class='glyphicon glyphicon-user'></span> admin</span>
                            <span class="glyphicon glyphicon glyphicon-menu-up transition-min" style="font-size:12px"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="topbar-info-btn">
                                <a data-title=" " data-iframe="<?php echo Url::to(['manager/change-password']); ?>"><span><span class='glyphicon glyphicon-edit'></span> 修改密码</span></a>
                            </li>
                            <!-- <li class="topbar-info-btn">
                                <a data-title=" " data-iframe="http://xzzx24.dev/index.php/admin/main/myinfo.html"><span><span class='glyphicon glyphicon-edit'></span> 修改资料</span></a>
                            </li> -->
                            <li class="topbar-info-btn">
                                <a data-load="<?php echo Url::to(['manager/logout']); ?>"><span><span class="glyphicon glyphicon-log-out"></span> 退出登录</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="framework-body framework-sidebar-mini">
    <div class="framework-sidebar">
        <div class="sidebar-content">
            <div class="sidebar-inner">
                <div class="sidebar-fold"><span class="glyphicon glyphicon-option-vertical transition-min"></span></div>
                <?php foreach ($aMenuConfig as $aMenu) {?>
                <div class='' data-menu-box="m-<?php echo $aMenu['id']; ?>">                    
                    <?php
                        $aSecondeMenus = $aMenu['child'];
                        foreach ($aSecondeMenus as $aSecndeItem) { ?>                    
                            <div class="sidebar-nav main-nav">
                               <div class="sidebar-title">
                                   <div class="sidebar-title-inner">
                                       <span class="sidebar-title-icon fa fa-caret-right transition-min"></span>
                                       <span class="sidebar-title-text"><?php echo $aSecndeItem['title'] ?></span>
                                   </div>
                               </div>
                               <ul class="sidebar-trans" style="display:none" data-menu-node='m-<?php echo $aMenu['id'] ?>-<?php echo $aSecndeItem['id'] ?>'>
                                <?php 
                                $aThreeMenus = $aSecndeItem['child'];
                                foreach ($aThreeMenus as $aThressItem) {
                                    if(!Yii::$app->rbacAuth->checkMenu(Yii::$app->manager->id,Yii::$app->rbacAuth->parseRequest($aThressItem['url']))){
                                        continue;
                                    }
                                    ?>     
                                   
                                   <li class="nav-item">
                                       <a data-menu-node='m-<?php echo $aMenu['id'] ?>-<?php echo $aThressItem['id']; ?>' data-open="<?php echo Url::to([$aThressItem['url']]); ?>" class="sidebar-trans">
                                           <div class="nav-icon sidebar-trans">
                                               <span class="<?php echo $aThressItem['icon']; ?> transition-min"></span>
                                           </div>
                                           <span class="nav-title"><?php echo $aThressItem['title']; ?></span>
                                       </a>
                                   </li>
                                <?php }?>
                               </ul>
                           </div>
                            
                       <?php }?>
                </div>                
                <?php } ?>

            </div>
        </div>
    </div>
    <script>
    $(function(){
        $('.sidebar-nav').find('ul').each(function(){ 
            if($(this).find('li').length == 0){ 
                $(this).closest('.sidebar-nav').remove();
            } 
        });
        $('a[data-menu-target]').each(function(){
            var m = $(this).attr('data-menu-target');
            if($('div[data-menu-box="'+ m +'"]').find('.sidebar-nav').length == 0){
                $(this).remove();
            }
        });
        $('a[data-menu-target]').show();
    });
    </script>
   