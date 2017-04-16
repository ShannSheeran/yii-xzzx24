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
    'baseUrl' => Yii::getAlias('@url.api'),
    'rules' => [
        '' => 'site/index',
        'home.html' => 'site/show-home',
        'test.html' => 'api/test',
        'test-app.html' => 'api/test-app',
        'api-home.html' => 'api/index',
        'tools-ad_jt.html' => 'tools/ad-jt',
        'tools-ad_jt_visit.html' => 'tools/ad-jt-visit',
        'tools-get_advisit.html' => 'tools/ad-visit',
        'login.html' => 'login/index',
        'api/index.html' => 'api/getUserInfo',
        //跳转页面
        'jump/<jumpType:\w+>.html' => 'jump/jump',
        //这条规则如无特殊原因必须放最底下!
        'debug/<controller>/<action>' => 'debug/<controller>/<action>',
    ],
];
