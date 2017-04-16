<?php

defined('PROJECT_PATH') || define('PROJECT_PATH', __DIR__);
defined('FRAMEWORK_PATH') || define('FRAMEWORK_PATH', PROJECT_PATH . '/framework');
//获取域名前缀
$aHostInfo = explode('.',$_SERVER['HTTP_HOST']);
if(!isset($aHostInfo[0])){
    throw new yii\web\ForbiddenHttpException('找不到你要访问的资源');
}
$aLocal = [
    'is_debug' => true,
    'env' => 'dev',
    //'domain_name' => 'xinfuli.viphk.ngrok',
    'domain_name' => 'xzzx24',
    'domain_suffix' => [
        'dev' => 'cn',
        'test' => 'test',
        'prod' => 'com',
    ],
	'domain_prefix'=>[
		'template'=> 'http://t.',
		'vender'=> 'http://v.',
		'home'=> 'http://',
		'login'=> 'http://login.',
		'erp'=> 'http://erp.',
		'static'=> 'http://static.',
		'admin'=> 'http://admin.',
		'api'=> 'http://api.',
		$aHostInfo[0] => 'http://'. $aHostInfo[0] .'.',
	],
    'db' => [
        'master' => [
            'host' => '127.0.0.1',
            'username' => 'root',
            'password' => '',
            'node' => [
                ['dsn' => 'mysql:host=127.0.0.1;dbname=game;charset=UTF8'],
            ],
        ],
        'slaver' => [
            'host' => '127.0.0.1',
            'username' => 'root',
            'password' => '',
            'node' => [
                ['dsn' => 'mysql:host=127.0.0.1;dbname=game;charset=UTF8'],
            ],
        ],
    ],
    'cache' => [
        'redis' => [
            'host' => '192.168.1.202',
            'port' => '6379',
            'password' => '',
            'server_name' => 'redis_1',
            'part' => [
                'data' => 1,
                'login' => 2,
                'temp' => 3,
            ],
        ],
        'redisCache' => [
            'host' => '192.168.1.202',
            'port' => '6379',
            'password' => '',
            'server_name' => 'redis_1',
            'part' => 3,
        ],
    ],
    'temp' => [],
];

unset($aHostInfo);
if (isset($_SERVER['SERVER_ADDR'])) {
    if ($_SERVER['SERVER_ADDR'] == '192.168.1.202') {
        $aLocal['env'] = 'test';
        $aLocal['cache']['redis']['part']['login'] = 4;
    } elseif ($_SERVER['SERVER_ADDR'] == '139.196.232.227') {
        $aLocal['env'] = 'prod';
    }
}

if (!class_exists('Yii')) {
    defined('YII_DEBUG') || define('YII_DEBUG', $aLocal['is_debug']);
    defined('YII_ENV') || define('YII_ENV', $aLocal['env']);
    require(FRAMEWORK_PATH . '/autoload.php');
    require(FRAMEWORK_PATH . '/yiisoft/yii2/Yii.php');
    require(PROJECT_PATH . '/rebuild/common/config/bootstrap.php');
}