<?php

namespace common\model\form;

use Yii;
use common\model\Country;
use yii\data\Pagination;

class CountryForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_COUNTRY = 'editor_country';

    /**
     * 添加场景
     */
    const SCENE_ADD_COUNTRY = 'add_country';

    /**
     * 获取数据
     */
    const SCENE_GET_COUNTRY = 'get_country';

    public $page = 1;
    public $pageSize = 15;
    public $id;
    public $name;
    public $img;
    public $order;
    public $status;
    public $is_show;
    public $vender_id;

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_COUNTRY]],
            [['name'], 'required', 'on' => [self::SCENE_EDITOR_COUNTRY, self::SCENE_ADD_COUNTRY]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_COUNTRY]],
            [['vender_id'],'safe']
        ];
    }

    public function getList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
        ];
        $aList = Country::getList($aCondition, $aControl);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Country::getCount($aCondition);
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
