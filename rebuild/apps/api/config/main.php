<?php
$params = yii\helpers\ArrayHelper::merge(
    require(__DIR__ . '/../../../common/config/params.php'),
    require(__DIR__ . '/../../../common/config/params-local.php'),
    require(__DIR__ . '/params.php')
    //require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'api',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'api\controllers',
    'runtimePath' => PROJECT_PATH . '/runtime/api',
    'components' => [
		/*'ui' => [
			'class' => 'home\lib\Ui1',
			'aTips' => require(__DIR__ . '/tips.php'),
			'advertisement' => require(__DIR__ . '/ui.php'),
		],*/
		'view' => [
			'commonTitle' => 'commonTitlecommonTitle',
			'baseTitle' => 'baseTitlebaseTitle',
		],
        'wechat' => [
            'class' => 'callmez\wechat\sdk\MpWechat',
            'appId' => 'wx4dccf92d5d2591ea',
            'appSecret' => 'd7cacdc818a0726db8abf1d0edb77eb9',
            'token' => 'DIt1JEBkK7qiUIrW7Qb1EjN699QexZ9K',
            'encodingAesKey' => 'DIt1JEBkK7'
          ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
    ],
	'urlManagerName' => 'urlManagerApi',
	
    'params' => $params,
];
