<?php

namespace common\model\form;

use common\lib\FormBaseModel;
use common\model\Ad;

class AdForm extends FormBaseModel {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_CATEGORY = 'editor_category';

    /**
     * 添加场景
     */
    const SCENE_ADD_CATEGORY = 'add_category';

    /**
     * 获取数据
     */
    const SCENE_GET_DATA_LIST = 'get_category';
    
    protected $mDataModel = null;

    public $page = 1;
    public $pageSize = 10;
    public $id;
    public $name;
    public $pid;
    public $keywords;
    public $desc;
    public $sort_order;
    public $img;
    public $status;
    public $create_time;
    public $update_time;
    public $vender_id;
    public static $orderConst = ['asc' => SORT_ASC, 'desc' => SORT_DESC];

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['id', 'pid', 'name', 'pageSize', 'create_time', 'update_time', 'keywords', 'desc', 'sort_order', 'img', 'status'], 'safe', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['name', 'sort_order'], 'required', 'on' => [self::SCENE_EDITOR_CATEGORY, self::SCENE_ADD_CATEGORY]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_CATEGORY]],
            ['vender_id', 'safe']
        ];
    }
    
    /**
     * 初始化注入操作数据模型类
     */
    public function init() {
        $this->mDataModel = Ad::className();
        parent::init();
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
        if ($this->name) {
            $aCondition[] = ['like', 'name', $this->name];
        }

        if (is_numeric($this->pid)) {
            $aCondition[] = ['pid' => $this->pid];
        }
        return $aCondition;
    }
    
}
