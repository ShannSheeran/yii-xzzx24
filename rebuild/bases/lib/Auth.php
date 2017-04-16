<?php

namespace bases\lib;

use yii;

/**
 * 权限认证类
 * 功能特性：
 * 1，是对规则进行认证，不是对节点进行认证。用户可以把节点当作规则名称实现对节点进行认证。
 *      $auth=new Auth();  $auth->check('规则名称','用户id')
 * 2，可以同时对多条规则进行认证，并设置多条规则的关系（or或者and）
 *      $auth=new Auth();  $auth->check('规则1,规则2','用户id','and') 
 *      第三个参数为and时表示，用户需要同时具有规则1和规则2的权限。 当第三个参数为or时，表示用户值需要具备其中一个条件即可。默认为or
 * 3，一个用户可以属于多个用户组(think_auth_group_access表 定义了用户所属用户组)。我们需要设置每个用户组拥有哪些规则(think_auth_group 定义了用户组权限)
 * 
 * 4，支持规则表达式。
 *      在think_auth_rule 表中定义一条规则时，如果type为1， condition字段就可以定义规则表达式。 如定义{score}>5  and {score}<100  表示用户的分数在5-100之间时这条规则才会通过。
 */
//数据库
/*
  -- ----------------------------
  -- think_auth_rule，规则表，
  -- id:主键，name：规则唯一标识, title：规则中文名称 status 状态：为1正常，为0禁用，condition：规则表达式，为空表示存在就验证，不为空表示按照条件验证
  -- ----------------------------
  DROP TABLE IF EXISTS `think_auth_rule`;
  CREATE TABLE `think_auth_rule` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(80) NOT NULL DEFAULT '',
  `title` char(20) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `condition` char(100) NOT NULL DEFAULT '',  # 规则附件条件,满足附加条件的规则,才认为是有效的规则
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
  ) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
  -- ----------------------------
  -- think_auth_group 用户组表，
  -- id：主键， title:用户组中文名称， rules：用户组拥有的规则id， 多个规则","隔开，status 状态：为1正常，为0禁用
  -- ----------------------------
  DROP TABLE IF EXISTS `think_auth_group`;
  CREATE TABLE `think_auth_group` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `title` char(100) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `rules` char(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
  ) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
  -- ----------------------------
  -- think_auth_group_access 用户组明细表
  -- uid:用户id，group_id：用户组id
  -- ----------------------------
  DROP TABLE IF EXISTS `think_auth_group_access`;
  CREATE TABLE `think_auth_group_access` (
  `uid` mediumint(8) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  UNIQUE KEY `uid_group_id` (`uid`,`group_id`),
  KEY `uid` (`uid`),
  KEY `group_id` (`group_id`)
  ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
 */

class Auth extends \yii\base\Component {

    public $AUTH_CONFIG = [
        'AUTH_ON' => true, //认证开关
        'AUTH_TYPE' => 1, // 认证方式，1为时时认证；2为登录认证。
        'AUTH_GROUP' => 'sy_auth_group', //用户组数据表名
        'AUTH_GROUP_ACCESS' => 'sy_auth_group_access', //用户组明细表
        'AUTH_RULE' => 'sy_auth_rule', //权限规则表
        'AUTH_USER' => 'manager', //用户信息表
        'ADMINISTRATOR' => 1,
    ];
    //默认配置
    protected $_config = array(
        'AUTH_ON' => true, // 认证开关
        'AUTH_TYPE' => 1, // 认证方式，1为实时认证；2为登录认证。
        'AUTH_GROUP' => 'auth_group', // 用户组数据表名
        'AUTH_GROUP_ACCESS' => 'auth_group_access', // 用户-用户组关系表
        'AUTH_RULE' => 'auth_rule', // 权限规则表
        'AUTH_USER' => 'member'             // 用户信息表
    );
    
     /* 保存禁止通过url访问的公共方法,例如定义在控制器中的工具方法 ;deny优先级高于allow */
    static protected $aDeny = [];
    /* 保存允许访问的公共方法 */
    static protected $aAllow = [];
    
    static protected $aCommonAllow = ['site/error','error/error','auth/show-group'];

    public function init() {
        $prefix = '';
        $this->_config['AUTH_GROUP'] = $prefix . $this->_config['AUTH_GROUP'];
        $this->_config['AUTH_RULE'] = $prefix . $this->_config['AUTH_RULE'];
        $this->_config['AUTH_USER'] = $prefix . $this->_config['AUTH_USER'];
        $this->_config['AUTH_GROUP_ACCESS'] = $prefix . $this->_config['AUTH_GROUP_ACCESS'];
        if ($this->AUTH_CONFIG) {
            //可设置配置项 AUTH_CONFIG, 此配置项为数组。
            $this->_config = array_merge($this->_config, $this->AUTH_CONFIG);
        }
        parent::init();
    }

    /**
     * 检查一个用户是否有指定的权限
     * @param int $userId 后台用户ID
     * @param string $permissionName 权限标识名称
     * @return boolean
     * @throws \yii\base\InvalidParamException
     */
    public function checkAccess($userId, $permissionName) {
        if (!$userId) {
            return false;
        }

        $mUser = null;
        if ($permissionName = \common\filter\ManagerAccessControl::MANAGER) {
            $mUser = \common\model\Manager::findOne($userId);
        }

        if (!$mUser) {
            throw new \yii\base\InvalidParamException('无效的用户ID');
        }       
        return $this->checkRule($userId);
    }
    
    public function checkMenu($userId,$rulesName){
        if($this->checkDynamic($userId)){
            return true;
        }
        return $this->check($rulesName,$userId);
    }
    /**
     * 返回配置文件中的url
     * @param type $url
     * @return type
     */
    public function parseRequest($url){
       $ruleUrl = $url;
       $bUrl = (strpos($url, '/') === 0) ? substr($url, 1) : $url;
        foreach (Yii::$app->getUrlManager()->rules as $aUrl) {
            if ($aUrl->name == $bUrl) {
                $ruleUrl = $aUrl->route;
                break;
            }
        }
        return $ruleUrl;
    }
    
    
    
    public function checkRule($userId){
       
        $rulesName = Yii::$app->controller->id . '/' . Yii::$app->controller->action->id;
         // 第一项检测访问权限
        $access = $this->accessControl($userId);
        if ($access === false) {
            return false;
        } elseif ($access === null) {
            return $this->check($rulesName, $userId);
        }
        return true;
    }
    
    
    /**
     * action访问控制,在 **登陆成功** 后执行的第一项权限检测任务
     *
     * @return boolean|null  返回值必须使用 `===` 进行判断
     *
     *   返回 **false**, 不允许任何人访问(超管除外)
     *   返回 **true**, 允许任何管理员访问,无需执行节点权限检测
     *   返回 **null**, 需要继续执行节点权限检测决定是否允许访问
     * @author 子墨  <785400320@qq.com>
     */
    final protected function accessControl($userId) {
        $oControler = Yii::$app->controller;
        $controller = $oControler::className();        
        if($this->checkDynamic($userId)){
            return true;
        }        
        
        if (isset($controller::$aDeny)) {
            if (!is_array($controller::$aDeny)) {
                throw new \yii\base\InvalidParamException("内部错误:{$controller}控制器 aDeny属性必须为数组");
            }
            $aDeny = $this->getDeny();
            if (!empty($aDeny) && in_array(strtolower(Yii::$app->controller->action->id), $aDeny)) {
                return false; //非超管禁止访问deny中的方法
            }
        }
        
        //debug(in_array('site/error', static::$aCommonAllow),11);
        /**
         * 公共允许的
         */
        if (!empty(static::$aCommonAllow) && in_array(strtolower(Yii::$app->controller->id . '/' . Yii::$app->controller->action->id), static::$aCommonAllow)) {
            return true;
        }

        if (isset($controller::$aAllow)) {
            if (!is_array($controller::$aAllow)) {
                throw new \yii\base\InvalidParamException("内部错误:{$controller}控制器 aAllow属性必须为数组");
            }
            $aAllow = $this->getAllow();
            if (!empty($aAllow) && in_array(strtolower(Yii::$app->controller->action->id), $aAllow)) {
                return true;
            }
        }
        return null;
    }
    
    /**
     * 检测是否是需要动态判断的权限
     * @return boolean|null
     *      返回true则表示当前访问有权限
     *      返回null，则会进入checkRule根据节点授权判断权限
     */
    private function checkDynamic($userId) {
        if ($this->checkIsManage($userId)) {
            return true;
        }
        //不明,需checkRule
        return null;
    }

    /**
     * 是否是超级管理员
     * @param type $userId
     * @return boolean
     */
    public function checkIsManage($userId) {
        if ($userId == $this->AUTH_CONFIG['ADMINISTRATOR']) {
            return true;
        }
        return false;
    }

    /**
     * 获取控制器中允许禁止任何人(超管除外)通过url访问的方法
     * @param  string  $controller   控制器类名(不含命名空间)
     */
    final protected function getDeny() {
        $oControler = Yii::$app->controller;
        $controller = $oControler::className();
        $data = array();
        if (is_array($controller::$aDeny)) {
            $deny = array_merge($controller::$aDeny, self::$aDeny);
            foreach ($deny as $key => $value) {
                if (is_numeric($key)) {
                    $data[] = strtolower($value);
                } else {
                    //可扩展
                }
            }
        }
        return $data;
    }

    /**
     * 获取控制器中允许所有管理员通过url访问的方法
     * @param  string  $controller   控制器类名(不含命名空间)
     */
    final protected function getAllow() {
        $oControler = Yii::$app->controller;
        $controller = $oControler::className();
        $data = array();
        if (is_array($controller::$aAllow)) {
            $allow = array_merge($controller::$aAllow, self::$aAllow);
            foreach ($allow as $key => $value) {
                if (is_numeric($key)) {
                    $data[] = strtolower($value);
                } else {
                    //可扩展
                }
            }
        }
        return $data;
    }

    /**
     * 检查权限
     * @param name string|array  需要验证的规则列表,支持逗号分隔的权限规则或索引数组
     * @param uid  int           认证用户的id
     * @param string mode        执行check的模式
     * @param relation string    如果为 'or' 表示满足任一条规则即通过验证;如果为 'and'则表示需满足所有规则才能通过验证
     * @return boolean           通过验证返回true;失败返回false
     */
    public function check($name, $uid, $type = 1, $mode = 'url', $relation = 'or') {
        if (!$this->_config['AUTH_ON'])
            return true;
        $authList = $this->getAuthList($uid, $type); //获取用户需要验证的所有有效规则列表
        if (is_string($name)) {
            $name = strtolower($name);
            if (strpos($name, ',') !== false) {
                $name = explode(',', $name);
            } else {
                $name = array($name);
            }
        }
        $list = array(); //保存验证通过的规则名
        if ($mode == 'url') {
            $REQUEST = unserialize(strtolower(serialize($_REQUEST)));
        }

        foreach ($authList as $auth) {
            $query = preg_replace('/^.+\?/U', '', $auth);
            if ($mode == 'url' && $query != $auth) {
                parse_str($query, $param); //解析规则中的param
                $intersect = array_intersect_assoc($REQUEST, $param);
                $auth = preg_replace('/\?.*$/U', '', $auth);
                if (in_array($auth, $name) && $intersect == $param) {  //如果节点相符且url参数满足
                    $list[] = $auth;
                }
            } else if (in_array($auth, $name)) {
                $list[] = $auth;
            }
        }
        if ($relation == 'or' and ! empty($list)) {
            return true;
        }
        $diff = array_diff($name, $list);
        if ($relation == 'and' and empty($diff)) {
            return true;
        }
        return false;
    }

    /**
     * 根据用户id获取用户组,返回值为数组
     * @param  uid int     用户id
     * @return array       用户所属的用户组 array(
     *     array('uid'=>'用户id','group_id'=>'用户组id','title'=>'用户组名称','rules'=>'用户组拥有的规则id,多个,号隔开'),
     *     ...)   
     */
    public function getGroups($uid) {
        static $groups = array();
        if (isset($groups[$uid]))
            return $groups[$uid];

        $query = new Query;
        $user_groups = $query->select(['uid', 'group_id', 'title', 'rules'])
                        ->where("a.uid='$uid' and g.status='1'")
                        ->from($this->_config['AUTH_GROUP_ACCESS'] . ' as a')
                        ->join('LEFT OUTER JOIN', $this->_config['AUTH_GROUP'] . ' as g', 'a.group_id=g.id'
                        )->createCommand()->queryAll();

        $groups[$uid] = $user_groups? : array();
        return $groups[$uid];
    }

    /**
     * 获得权限列表
     * @param integer $uid  用户id
     * @param integer $type 
     */
    protected function getAuthList($uid, $type) {
        static $_authList = array(); //保存用户验证通过的权限列表
        $t = implode(',', (array) $type);
        if (isset($_authList[$uid . $t])) {
            return $_authList[$uid . $t];
        }
        if ($this->_config['AUTH_TYPE'] == 2 && isset($_SESSION['_AUTH_LIST_' . $uid . $t])) {
            return $_SESSION['_AUTH_LIST_' . $uid . $t];
        }
        //读取用户所属用户组
        $groups = $this->getGroups($uid);
        $ids = array(); //保存用户所属用户组设置的所有权限规则id
        foreach ($groups as $g) {
            $ids = array_merge($ids, explode(',', trim($g['rules'], ',')));
        }
        $ids = array_unique($ids);
        if (empty($ids)) {
            $_authList[$uid . $t] = array();
            return array();
        }

        $map = [
            'and',
            ['in', 'id', $ids],
            ['type' => $type],
            ['status' => 1]
        ];

        //读取用户组所有权限规则        
        $rules = (new Query())->select(['condition', 'name'])
                        ->where($map)
                        ->from($this->_config['AUTH_RULE'])
                        ->createCommand()->queryAll();

        //循环规则，判断结果。
        $authList = array();   //
        foreach ($rules as $rule) {
            if (!empty($rule['condition'])) { //根据condition进行验证
                $user = $this->getUserInfo($uid); //获取用户信息,一维数组

                $command = preg_replace('/\{(\w*?)\}/', '$user[\'\\1\']', $rule['condition']);
                @(eval('$condition=(' . $command . ');'));
                if ($condition) {
                    $authList[] = strtolower($rule['name']);
                }
            } else {
                //只要存在就记录
                $authList[] = strtolower($rule['name']);
            }
        }
        $_authList[$uid . $t] = $authList;
        if ($this->_config['AUTH_TYPE'] == 2) {
            //规则列表结果保存到session
            $_SESSION['_AUTH_LIST_' . $uid . $t] = $authList;
        }
        return array_unique($authList);
    }

    /**
     * 获得用户资料,根据自己的情况读取数据库
     */
    protected function getUserInfo($uid) {
        static $userinfo = array();
        if (!isset($userinfo[$uid])) {

            $userinfo[$uid] = (new Query())
                    ->where(['and', ['id' => $uid]])
                    ->from($this->_config['AUTH_USER'])
                    ->one();
        }
        return $userinfo[$uid];
    }

}
