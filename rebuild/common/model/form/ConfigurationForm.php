<?php

namespace common\model\form;

use Yii;
use common\model\Configuration;
use yii\data\Pagination;

class ConfigurationForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_CONFIGURATION = 'editor_configuration';

    /**
     * 添加场景
     */
    const SCENE_ADD_CONFIGURATION = 'add_configuration';

    /**
     * 获取数据
     */
    const SCENE_GET_CONFIGURATION = 'get_configuration';

    public $page = 1;
    public $pageSize = 15;
    public $id;
    public $app_id;
    public $app_secret;
    public $merchat_number;
    public $merchat_key;
    public $alipay_email;
    public $cooperation_id;
    public $security_key;
    public $create_time;
    public $status;
    public $vender_id;
    public $order_by = [];
    public static $orderConst = [];

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_CONFIGURATION]],
            [['app_id','app_secret','merchat_number','merchat_key'], 'required', 'on' => [self::SCENE_EDITOR_CONFIGURATION, self::SCENE_ADD_CONFIGURATION]],
            [['vender_id'],'safe']
        ];
    }

    public function getList($aFeild = []) {
        $aCondition = $this->getListCondition();
        $orderBy = [];
        //提供外部多个排序
        if($this->order_by){
            $orderBy = $this->order_by;
        }
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
            'order_by' => $orderBy,
        ];
        $aList = Configuration::getList($aCondition, $aControl,$aFeild);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Configuration::getCount($aCondition);
    }

    /**
     * 检索条件组合
     * @return string
     */
    public function getListCondition() {
        
        $aCondition = ['and'];
         if ($this->vender_id) {
            $aCondition[] = ['vender_id' => $this->vender_id];
        }
        return $aCondition;
    }

}
