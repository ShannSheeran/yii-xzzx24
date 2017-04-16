<?php

namespace common\model\form;

use Yii;
use common\model\Attribute;
use yii\data\Pagination;

class AttributeForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_ATTRIBUTE = 'editor_attribute';

    /**
     * 添加场景
     */
    const SCENE_ADD_ATTRIBUTE = 'add_attribute';

    /**
     * 获取数据
     */
    const SCENE_GET_ATTRIBUTE = 'get_attribute';

    public $page = 1;
    public $pageSize = 15;
    public $id;
    public $name;
    public $category_id;
    public $vender_id;

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_ATTRIBUTE]],
            [['name'], 'required', 'on' => [self::SCENE_EDITOR_ATTRIBUTE, self::SCENE_ADD_ATTRIBUTE]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_ATTRIBUTE]],
            [['vender_id'],'safe'],
        ];
    }

    public function getList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
        ];
        $aList = Attribute::getList($aCondition, $aControl);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Attribute::getCount($aCondition);
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
        return $aCondition;
    }

}
