<?php

namespace common\model\form;

use common\lib\FormBaseModel;
use common\model\SystemsMenu;

class SystemsMenuForm extends FormBaseModel {

    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR = 'editor';

    /**
     * 添加场景
     */
    const SCENE_ADD = 'add';

    /**
     * 获取数据
     */
    const SCENE_GET_DATA_LIST = 'get';
    
    public $page = 1;
    public $pageSize = 100;
    public $id;
    public $title;
    public $url;
    public $sort;
    public $status;
    
    public $sort_order = ['sort' => SORT_ASC];

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['id', 'title', 'pageSize', 'page', 'sort_order', 'status'], 'safe', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['title', 'sort_order'], 'required', 'on' => [self::SCENE_EDITOR, self::SCENE_ADD]],
        ];
    }

}
