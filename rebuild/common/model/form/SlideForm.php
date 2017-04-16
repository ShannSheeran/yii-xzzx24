<?php

namespace common\model\form;

use Yii;
use common\model\Slide;
use yii\data\Pagination;

class SlideForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_SLIDE = 'editor_slide';

    /**
     * 添加场景
     */
    const SCENE_ADD_SLIDE = 'add_slide';

    /**
     * 获取数据
     */
    const SCENE_GET_SLIDE = 'get_slide';

    public $page = 1;
    public $pageSize = 15;
    public $id;
    public $name;
    public $thumb;
    public $order;
    public $status;
    public $url;
    public $position;
    public $vender_id;
    public $order_by = [];
    public static $orderConst = ['asc' => SORT_ASC, 'desc' => SORT_DESC];

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_SLIDE]],
            [['name'], 'required', 'on' => [self::SCENE_EDITOR_SLIDE, self::SCENE_ADD_SLIDE]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_SLIDE]],
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
        $aList = Slide::getList($aCondition, $aControl,$aFeild);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Slide::getCount($aCondition);
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
