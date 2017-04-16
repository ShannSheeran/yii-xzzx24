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
	'baseUrl' => Yii::getAlias('@url.home'),
	'rules' => [
		'yxad-<aid:\d+>.html'=> 'site/index',
		''=> 'site/index',
		'home.html'=> 'site/show-home',
		'functions.html'=> 'site/functions',
		'price.html'=> 'site/price',
		'question.html'=> 'site/question',
		'register.html'=> 'site/register',
		'addregister.html'=> 'site/add-register',
		'checkorder.html'=> 'site/check-order',
		'checkdomain.html'=> 'site/check-domain',
		'notify.html'=> 'site/notify',
		'case.html'=> 'site/case',
		'login.html'=> 'login/index',
		'getwx.html'=> 'site/callback',
		'sendsns.html'=> 'tools/sendsns',
                'MP_verify_<filename:\w+>.txt' => 'site/weixin-verify',
		//跳转页面
		'jump/<jumpType:\w+>.html'=> 'jump/jump',
		//这条规则如无特殊原因必须放最底下!
		'debug/<controller>/<action>' => 'debug/<controller>/<action>',

	],
];