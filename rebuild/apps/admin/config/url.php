<?php

/**
 * URL配置控制
 * class : 解析器
 * enablePrettyUrl : 是否开启伪静态
 * showScriptName : 生成的URL是否带入口脚本名称
 * enableStrictParsing : 是否开启严格匹配
 * baseUrl 域名
 */
return [
    'class' => 'yii\web\UrlManager',
    'enablePrettyUrl' => true,
    'showScriptName' => false,
    'enableStrictParsing' => true,
    'baseUrl' => Yii::getAlias('@url.admin'),
    'rules' => [
        '' => 'manager/index',
        'yxad.html' => 'site/index',
        'home.html' => 'site/index',
        //登录相关页面
        'login.html' => 'login/index',
        'manager/login.html' => 'login/manager-login',
        'captcha.png' => 'login/captcha',
        'manager/index.html' => 'manager/index',
        'manager/logout.html' => 'manager/logout',
        'manager/change-password.html' => 'manager/change-password',
        'manager/get_combobox.html' => 'manager/get-combobox',
        //菜单管理
        'menu/index.html' => 'menu/index',
        'menu/add.html' => 'menu/add',
        'menu/editor.html' => 'menu/editor',
        'menu/forbid.html' => 'menu/forbid',
        'menu/del.html' => 'menu/del',
        'ad/index.html' => 'ad/list',
        //公用插件
        'plugs/icon.html' => 'plugs/icon',
        'plugs/show-one.html' => 'plugs/show-one-file',
        'plugs/upload-file-one.html' => 'plugs/upload-file',
        'plugs/upload-file-index.html' => 'plugs/UploadFile',
        //auth
        'auth/user_list.html' => 'auth/show-user',
        'auth/add_user.html' => 'auth/add-user',
        'auth/editor-user.html' => 'auth/editor-user',
        'auth/user-forbid.html' => 'auth/user-forbid',
        'auth/del_user.html' => 'auth/del-user',
        
        //app管理
        'app/list.html' => 'app/index',
        'app/add.html' => 'app/add',
        'app/editor.html' => 'app/editor',
        'app/update.html' => 'app/update',
        'app/del.html' => 'app/del',
        
        //消费记录管理
        'consumption/list.html' => 'consumption/index',
        'consumption/update.html' => 'consumption/update',
        'consumption/settlement.html' => 'consumption/settlement',
        
        //公会佣金管理
        'setting/org-commission.html' => 'setting/index',
        'setting/set-commission.html' => 'setting/set-org-commission',
        
        
        'xx/list.html' => 'xx/index',
        'xx/add.html' => 'xx/add',
        'xx/editor.html' => 'xx/editor',
        'xx/update.html' => 'xx/upate',
        'xx/del.html' => 'xx/del',
        
         //advert路由配置
        'advert/list.html' => 'advert/index',
        'advert/add.html' => 'advert/add',
        'advert/editor.html' => 'advert/editor',
        'advert/update.html' => 'advert/update',
        'advert/del.html' => 'advert/del',
        
        //权限
        'auth/group_list.html' => 'auth/show-groups',
        'auth/add-role.html' => 'auth/add-role',
        'auth/role-editor.html' => 'auth/role-editor',
        'auth/role-forbid.html' => 'auth/role-forbid',
        'auth/access-nodes.html' => 'auth/access-nodes',
        'auth/nodes-get-ztree.json' => 'auth/nodes-get-ztree',
        'auth/auth-rule.html' => 'auth/auth-rule',
        
        'auth/show-nodes.html' => 'auth/show-nodes',
        'auth/add-nodes.html' => 'auth/add-nodes',
        'auth/editor-nodes.html' => 'auth/editor-nodes',
        'auth/del-nodes.html' => 'auth/del-nodes',
        
        //网站配置管理
        'config/site.html' => 'config/site',
        'config/app.html' => 'config/app',
        'config/file.html' => 'config/file',
        'config/mail.html' => 'config/mail',
        'config/sms.html' => 'config/sms',
        'config/wx_pay.html' => 'config/wechat-pay',
        'config/wx_config.html' => 'config/wechat-config',
        'config/wx_save.html' => 'config/wechat-save',
        'config/save.html' => 'config/save',
        
        //代码生成
        'code.html' => 'auto-generate-code/index',
        'generate/get-field.json' => 'auto-generate-code/get-tabel-field',
        //跳转页面
        'jump/<jumpType:\w+>.html' => 'jump/jump',
        //这条规则如无特殊原因必须放最底下!
        'debug/<controller>/<action>' => 'debug/<controller>/<action>',
    ],
];
