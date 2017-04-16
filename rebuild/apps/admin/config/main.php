<?php

$params = yii\helpers\ArrayHelper::merge(
                require(__DIR__ . '/../../../common/config/params.php'), require(__DIR__ . '/../../../common/config/params-local.php'), require(__DIR__ . '/params.php')
                //require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'admin',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'admin\controllers',
    'runtimePath' => PROJECT_PATH . '/runtime/admin',
    'components' => [
        /* 'ui' => [
          'class' => 'admin\lib\Ui1',
          'aTips' => require(__DIR__ . '/tips.php'),
          'advertisement' => require(__DIR__ . '/ui.php'),
          ], */
        'view' => [
            'commonTitle' => '跨境电商',
            'baseTitle' => 'Shop',
        ],
        'manager' => [
            //用户控制组件
            'class' => 'common\role\Manager',
            'identityClass' => 'common\model\Manager',
            'reloginOvertime' => 1800,
            'rememberLoginTime' => 3000000,
            'enableAutoLogin' => false,
            'loginUrl' => ['login/index'],
        ],
        'vender' => [
            //用户控制组件
            'class' => 'common\role\Vender',
            'identityClass' => 'common\model\Vender',
            'reloginOvertime' => 1800,
            'rememberLoginTime' => 3000000,
            'enableAutoLogin' => false,
            'loginUrl' => ['login/index'],
        ],
        'authManager' => [
            'class' => 'common\role\AuthManager',
        //'aPermissionList' => include(__DIR__ . '/permission.php'),
        ],
        'rbacAuth' => [
            'class' => 'bases\lib\Auth',
        ],        
    
    ],
    'urlManagerName' => 'urlManagerAdmin',
    'params' => $params,
];
