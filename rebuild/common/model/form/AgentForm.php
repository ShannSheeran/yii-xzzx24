<?php

namespace common\model\form;

use Yii;
use common\model\Agent;
use yii\data\Pagination;

class AgentForm extends \yii\base\Model {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_AGENT = 'editor_agent';

    /**
     * 添加场景
     */
    const SCENE_ADD_AGENT = 'add_agent';

    /**
     * 获取数据
     */
    const SCENE_GET_AGENT = 'get_agent';

    public $page = 1;
    public $pageSize = 15;
    public $id;
    public $name;
    public $pid;
    public $purchase_percent;
    public $discount_percent;
    

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_AGENT]],
            [['name'], 'required', 'on' => [self::SCENE_EDITOR_AGENT, self::SCENE_ADD_AGENT]],
            [['id'], 'required', 'on' => [self::SCENE_EDITOR_AGENT]],
        ];
    }

    public function getList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
        ];
        $aList = Agent::getList($aCondition, $aControl);
        return $aList;
    }

    public function getCount() {
        $aCondition = $this->getListCondition();
        return Agent::getCount($aCondition);
    }

    /**
     * 检索条件组合
     * @return string
     */
    public function getListCondition() {
        $aCondition = ['and'];
        if ($this->name) {
            $aCondition[] = ['like', 'name', $this->name];
        }
        return $aCondition;
    }

}
