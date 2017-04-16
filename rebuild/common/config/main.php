<?php

return [
    'vendorPath' => FRAMEWORK_PATH,
    'domain' => $aLocal['domain_name'] . '.' . $aLocal['domain_suffix'][YII_ENV],
    'aWebAppList' => [
        'home', 'login', 'admin', 'erp', 'api','vender'
    ],
    'language' => 'zh-CN',
    'bootstrap' => ['log'],
    'defaultRoute' => 'site/index',
//	'catchAll' => [
//        'remind/close-website-remind',
//		'words' => '',
//		'start_time' => 0,
//		'end_time' => 0,
//    ],
    'components' => [
        //各APP的URL管理器 start
        'urlManagerHome' => require(Yii::getAlias('@home') . '/config/url.php'),
        'urlManagerAdmin' => require(Yii::getAlias('@admin') . '/config/url.php'),
        'urlManagerApi' => require(Yii::getAlias('@api') . '/config/url.php'),
        //各APP的URL管理器 end
        'request' => [
            'cookieValidationKey' => 'EArv76QW-Dc8ngUP-qndrD0BDlodbqw-',
        ],
        'ui' => [
            'class' => 'common\ui\CommonUi1',
            'aTips' => [
                'error' => [
                    'common' => '抱歉,系统繁忙,请重试',
                ],
            ]
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'transport' => [
                'class' => 'Swift_SmtpTransport',
                'host' => 'smtp.mail.xxx.com',
                'username' => 'service@mail.xxx.com',
                'password' => '',
                'port' => '25',
            ],
            'messageConfig' => [
                'charset' => 'UTF-8',
                'from' => ['service@mail.xxx.com' => 'xxx']
            ],
            'htmlLayout' => '@common/views/mail/html-layout',
            'textLayout' => '@common/views/mail/text-layout',
        ],
        'sms' => [
            'username'=>'cf_ncs',
            'password'=>'Whl2016_Q',
            'class' => 'bases\lib\Sms',
        ],
        'jpush' => [
            'class' => 'bases\lib\Jpush',
            'appKey' => '',
            'masterSecret' => '',
        ],
         'cache' => [
            'class' => 'yii\caching\FileCache',   
         ],        
        'wechatPay' => [
            'class' => 'bases\lib\WechatPay\WechatPay',
        ],
        'assetManager' => [
            'bundles' => [
                'yii\web\JqueryAsset' => [
                    'sourcePath' => null,
                    'js' => []
                ],
            ]
        ],
//        'xzzxdb' => [
//            'class' => 'yii\db\Connection',
//             'dsn' => 'mysql:host=rm-wz90nm876xx64z137o.mysql.rds.aliyuncs.com;dbname=xzzxdb;charset=UTF8',
//            'username' => 'xzzx',
//            'password' => 'NM207cc!@#',
//        ],
        'xzzxdb' => [
            'class' => 'yii\db\Connection',
             'dsn' => 'mysql:host=127.0.0.1;dbname=xzzx_dev;charset=UTF8',
            'username' => 'root',
            'password' => 'root',
        ],
        'toolsXzzxDb' => [
            'class' => 'yii\db\Connection',
             'dsn' => 'mysql:host=rm-wz90nm876xx64z137o.mysql.rds.aliyuncs.com;dbname=xzzxdb;charset=UTF8',
            'username' => 'xzzx',
            'password' => 'NM207cc!@#',
        ],
        'response' => [
            'class' => 'yii\web\Response',
            'format' => 'html',
        ],
        'notifytion' => [
            'class' => 'common\lib\Notifytion',
        ],
        'log' => require(__DIR__ . '/log.php'),
        'errorHandler' => [
            'class' => 'common\lib\ErrorHandler',
            'errorAction' => 'site/error', //所有站点APP统一使用site控制器的error方法处理网络可能有点慢
        ],
        'view' => [
            'class' => 'bases\lib\View',
            'on beginPage' => function() {
                Yii::$app->view->title = \yii\helpers\Html::encode(Yii::$app->view->title);

                Yii::$app->view->registerLinkTag([
                    'rel' => 'shortcut icon',
                    'href' => Yii::getAlias('@r.url') . '/favicon.ico',
                ]);

                Yii::$app->view->registerMetaTag([
                    'name' => 'csrf-token',
                    'content' => Yii::$app->request->csrfToken,
                ]);
            },
                    'on endPage' => function() {
                // echo '<!--umfun';	//防止尾部运营商注入广告脚本,IE会显示半截标签，暂时屏蔽
            },
                ],
                /* 'loginManager' => [
                  //'class' => 'bases\lib\Redis',
                  'class' => 'yii\caching\FileCache',
                  ], */
                'db' => [
                    'class' => 'bases\lib\Connection',
                    'charset' => 'utf8',
                    'aTables' => [
                        /**
                         * 当你要求user表不使用缓存
                         * 'user' => 'cache:0'
                         *
                         * 当你的某个表不在主库project,而是在财务库xxx_recharge
                         * 'recharge' => 'table:xxx_recharge.recharge'		//以recharge为别名指向具体的数据库,必须有table:
                         *
                         * 既定义数据库的具体位置又定义是否缓存
                         * 'recharge' => 'table:db2.recharge;cache:0'	//这里增加了cache控制,1/0表示是否缓存数据,其实语法就像CSS一样
                         *
                         * 以后若有更多控制需求,可以增加"CSS属性"并在 bases\lib\Query::from 类里做解析代码
                         */
                        'account_number' => 'cache:0',
                    ],
                    'masterConfig' => [
                        'username' => $aLocal['db']['master']['username'],
                        'password' => $aLocal['db']['master']['password'],
                        'attributes' => [
                            // use a smaller connection timeout
                            PDO::ATTR_TIMEOUT => 10,
                            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
                        ],
                    ],
                    'masters' => $aLocal['db']['master']['node'],
                    'slaveConfig' => [
                        'username' => $aLocal['db']['slaver']['username'],
                        'password' => $aLocal['db']['master']['password'],
                        'attributes' => [
                            // use a smaller connection timeout
                            PDO::ATTR_TIMEOUT => 10,
                            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
                        ],
                    ],
                    'slaves' => $aLocal['db']['slaver']['node'],
                ],
                //bases\lib\DbCommand public $isOpen = false;
                //bases\lib\Query public $isCacheData = false;public $isSelectFromCache = false;
                'redis' => [
                    'class' => 'bases\lib\RedisCache',
                    'isOpen' => false,
                    'serverName' => $aLocal['cache']['redis']['server_name'],
                    'dataPart' => [
                        'index' => $aLocal['cache']['redis']['part']['data'],
                        'is_active' => 1,
                    ],
                    'loginPart' => [
                        'index' => $aLocal['cache']['redis']['part']['login'],
                        'is_active' => 1,
                    ],
                    'tempPart' => [
                        'index' => $aLocal['cache']['redis']['part']['temp'],
                        'is_active' => 1,
                    ],
                    'servers' => [
                        'redis_1' => [
                            'is_active' => 1,
                            'host' => $aLocal['cache']['redis']['host'],
                            'port' => $aLocal['cache']['redis']['port'],
                            'password' => $aLocal['cache']['redis']['password'],
                        ],
                    ],
                ],
                'redisCache' => [
                    'class' => 'bases\lib\RedisCache',
                    'isOpen' => false,
                    'serverName' => $aLocal['cache']['redisCache']['server_name'],
                    'dataPart' => [
                        'index' => $aLocal['cache']['redisCache']['part'],
                        'is_active' => 1,
                    ],
                    'servers' => [
                        'redis_1' => [
                            'is_active' => 1,
                            'host' => $aLocal['cache']['redisCache']['host'],
                            'port' => $aLocal['cache']['redisCache']['port'],
                            'password' => $aLocal['cache']['redisCache']['password'],
                        ],
                    ],
                ],
                'client' => [
                    'class' => 'bases\helper\Client'
                ],
                'kuaidi'=>[
			'class' => 'bases\lib\Kuaidi',
			'url' => 'http://www.kuaidi100.com/query',	//http://api.kuaidi100.com/api
			'authKey' => '1',							//c635d73c707557a5
		],
                'weiXin' => [
                    'class' => 'bases\lib\WeiXin',
                    'appId'=>'wxf548bbe238792968',
                    'appSecret'=>'71fc9370360c02b3eea3a91614e624e5',
                ],
                'qiniu'=>[
			'class' => 'bases\lib\Qiniu',
			'enable' => false,
			'accessKey' => 'ah3l5zpkx-o5aRN-LM_8ECO12NR9QUlok8jG0wF0',
			'secretKey' => '57_oYNdalSMqLuD_WcLrMS3tCWokkOpvHeC7tjYc',
			'bucket' => 'design-app-images',
			'privateDomain' => 'static.xdh-syy.com',
		],
                //pc版支付宝即时到账
                'alipay' => [
                    'class' => 'bases\lib\Alipay\Alipay',
                    'partner_id' => '',
                    'key' => '',
                    'cacert_pem' => Yii::getAlias('@p.alipay') . '/support/cacert.pem',
                    'alipay_gateway_new' => 'https://mapi.alipay.com/gateway.do?',
                    'https_verify_url' => 'https://mapi.alipay.com/gateway.do?service=notify_verify&',
                    'http_verify_url' => 'http://notify.alipay.com/trade/notify_query.do?',
                ],
                //手机版支付宝即时到账
                'mobileAlipay' => [
                    'class' => 'bases\lib\MobileAlipay\AlipaySubmit',
                    'partner_id' => '',
                    'key' => '',
                    'private_key_path' => Yii::getAlias('@bases') . '/lib/MobileAlipay/key/rsa_private_key.pem',
                    'ali_public_key_path' => Yii::getAlias('@bases') . '/lib/MobileAlipay/key/alipay_public_key.pem',
                    'cacert_pem' => Yii::getAlias('@bases') . '/lib/MobileAlipay/key/cacert.pem',
                    'alipay_gateway_new' => 'https://mapi.alipay.com/gateway.do?', //http://wappaygw.alipay.com/service/rest.htm?',
                    'https_verify_url' => 'https://mapi.alipay.com/gateway.do?service=notify_verify&',
                    'http_verify_url' => 'http://notify.alipay.com/trade/notify_query.do?',
                ],
            ],
        ];
        