<?php

namespace common\lib;

use Yii;
use bases\lib\Application;
use common\lib\event\AfterGetAppConfig;
use yii\base\Component;
use yii\helpers\ArrayHelper;

/**
 * APP创建器
 */
class AppCreater extends Component {

    /**
     * @var int 本次要创建App的ID
     */
    public $appId = '';

    /**
     * @var bool 创建APP过程中是否自动加载资源
     */
    public $autoLoadResource = true;

    /**
     * @var bool 创建APP过程中是否运行APP的预启动脚本
     */
    public $isRunBootstrap = false;

    /**
     * @var string App的目录
     */
    private $_appPath = '';

    /**
     * 获取到配置后
     */
    const EVENT_AFTER_GET_APP_CONFIG = 'after-get-app-config';

    /**
     * 获取APP的配置
     * @param array $aConfig 另外增加的配置
     * @return array
     */
    public function getConfig() {
        global $aLocal;
        $alocalConfig =  require($this->appPath . '/config/main-local.php');
        $aAppConfig = ArrayHelper::merge(
                require(PROJECT_PATH . '/rebuild/common/config/main.php'), require(PROJECT_PATH . '/rebuild/common/config/main-local.php'), require($this->appPath . '/config/main.php'), $alocalConfig
        );
        
        //防止不同项目不同数据库这里设置masters 和 slaves 采用项目本身的配置
        if(isset($aAppConfig['components']['db']['masters']) && isset($alocalConfig['components']['db']['masters'])){
            $aAppConfig['components']['db']['masters'] = $alocalConfig['components']['db']['masters'];
        }
        
        if(isset($aAppConfig['components']['db']['slaves']) && isset($alocalConfig['components']['db']['slaves'])){
            $aAppConfig['components']['db']['slaves'] = $alocalConfig['components']['db']['slaves'];
        }
        return $aAppConfig;
    }

    /**
     * 创建APP
     * @param array $aConfig APP的配置
     * @return Application APP对象
     */
    public function createApp(array $aConfig = []) {
        $this->initPaths();


        if ($this->isRunBootstrap) {
            include($this->appPath . '/config/bootstrap.php');
        }

        $aAppConfig = $this->getConfig();
        $oEvent = new AfterGetAppConfig([
            'aConfig' => $aAppConfig,
        ]);

        $this->trigger(static::EVENT_AFTER_GET_APP_CONFIG, $oEvent);
        $oApp = new Application(ArrayHelper::merge($oEvent->aConfig, $aConfig));
        $this->autoLoadResource && $oApp->loadResource();

        return $oApp;
    }

    /**
     * 初始化全局别名路径
     */
    public function initPaths() {
        Yii::setAlias('p.resource', PROJECT_PATH . '/resource');
        Yii::setAlias('p.temp_upload', 'data/user/tmp');
        Yii::setAlias('p.bbs_image', 'data/bbs');
        Yii::setAlias('p.teacher_bbs_image', 'data/teacher_bbs');
    }

    /**
     * 获取本次要创建的APP的程序目录路径
     * @return string
     */
    public function getAppPath() {
        if ($this->_appPath == '') {
            if (YII_ENV_PROD) {
                $this->_appPath = Yii::getAlias('@' . $this->appId);
            } else {
                $this->_appPath = PROJECT_PATH . '/rebuild/apps/' . $this->appId;
            }
        }
        return $this->_appPath;
    }

}
