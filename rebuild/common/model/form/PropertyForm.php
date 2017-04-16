<?php

namespace common\model\form;

use Yii;
use common\model\Property;
use yii\data\Pagination;

class PropertyForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_PROPERTY = 'editor_property';

    /**
     * 添加场景
     */
    const SCENE_ADD_PROPERTY = 'add_property';

    /**
     * 获取数据
     */
    const SCENE_GET_PROPERTY = 'get_property';

    public $page = 1;
    public $pageSize = 30;
    public $id;
    public $goods_id;
    public $vender_id;
    public $order_by = [];
    public static $orderConst = ['asc' => SORT_ASC, 'desc' => SORT_DESC];

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_PROPERTY]],
//            [['content'], 'required', 'on' => [self::SCENE_EDITOR_PROPERTY, self::SCENE_ADD_PROPERTY]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_PROPERTY]],
            [['vender_id'],'safe'],
            [['goods_id'],'safe'],
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
        $aList = Property::getList($aCondition, $aControl,$aFeild);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Property::getCount($aCondition);
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
         if ($this->goods_id) {
            $aCondition[] = ['goods_id' => $this->goods_id];
        }
        return $aCondition;
    }

}
