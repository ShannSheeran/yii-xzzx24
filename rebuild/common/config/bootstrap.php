<?php

error_reporting(-1);
$appPath = PROJECT_PATH . '/rebuild';
Yii::setAlias('common', dirname(__DIR__));

//APP别名设置 start
if (!YII_ENV_PROD) {
    Yii::setAlias('dev', $appPath . '/apps/dev');
}
$domainSuffix = $aLocal['domain_suffix'][YII_ENV];

//商家
Yii::setAlias('vender', $appPath . '/apps/vender');
Yii::setAlias('url.vender', $aLocal['domain_prefix']['vender'].$aLocal['domain_name'] .'.'. $domainSuffix);

Yii::setAlias('home', $appPath . '/apps/home');
Yii::setAlias('url.home', $aLocal['domain_prefix']['home'].$aLocal['domain_name'] .'.'. $domainSuffix);

Yii::setAlias('login', $appPath . '/apps/login');
Yii::setAlias('url.login', $aLocal['domain_prefix']['login'].$aLocal['domain_name'] .'.'. $domainSuffix);

Yii::setAlias('admin', $appPath . '/apps/admin');
Yii::setAlias('url.admin', $aLocal['domain_prefix']['admin'].$aLocal['domain_name'] .'.'. $domainSuffix);

Yii::setAlias('api', $appPath . '/apps/api');
Yii::setAlias('url.api', $aLocal['domain_prefix']['api'].$aLocal['domain_name'] .'.'. $domainSuffix);

Yii::setAlias('erp', $appPath . '/apps/erp');
Yii::setAlias('url.erp', $aLocal['domain_prefix']['erp'].$aLocal['domain_name'] .'.'. $domainSuffix);
Yii::setAlias('url.template', $aLocal['domain_prefix']['template'].$aLocal['domain_name'] .'.'. $domainSuffix);

//商家前端手机版
$aHostInfo = explode('.',$_SERVER['HTTP_HOST']);
Yii::setAlias('mobile', $appPath . '/apps/mobile');
Yii::setAlias('url.mobile', $aLocal['domain_prefix'][$aHostInfo[0]].$aLocal['domain_name'] .'.'. $domainSuffix);
//APP别名设置 end

Yii::setAlias('bases', $appPath . '/bases');
Yii::setAlias('r.url', $aLocal['domain_prefix']['static'].$aLocal['domain_name'] .'.'. $domainSuffix);
Yii::setAlias('p.system_view', $appPath . '/common/views/system');
Yii::setAlias('Endroid', Yii::getAlias('@bases') . '/lib'); //二维码扩展
Yii::setAlias('@p.alipay', Yii::getAlias('@bases') . '/lib/Alipay'); //支付宝扩展


defined('NOW_TIME') || define('NOW_TIME', time());
unset($appPath, $domainSuffix, $aHostInfo);

if (!defined('UMFUN_TESTING')) {

    /**
     * 调试输出函数
     * @param type mixed $xData 要调试输出的数据
     * @param type int $mode 11=输出并停止运行,111=停止并输出运行轨迹,12=以PHP代码方式输出,13=dump方式输出,其中第十位数为0的时候表示不停止运行,前面的参数样例十位都是1所以会停止运行,个位用于控制输出模式 @see \bases\lib\Debug
     */
    function debug($xData, $mode = null) {
        if ($mode === null) {
            $mode = \bases\lib\Debug::MODE_NORMAL;
        }
        \bases\lib\Debug::dump($xData, $mode, true);
    }

}

if (isset($_GET['__SQS'])) {
    unset($_GET['__SQS']);
}
