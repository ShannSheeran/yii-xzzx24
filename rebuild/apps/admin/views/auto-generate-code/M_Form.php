<?php

namespace {__NAME_SPACE}\models\form;

use common\lib\FormBaseModel;

class {__MFORMNAME__}Form extends FormBaseModel {

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
    
    
    {__TABLE_FIELD__}

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_DATA_LIST]],
            [{__RULES__}, 'safe', 'on' => [self::SCENE_GET_DATA_LIST,self::SCENE_ADD,self::SCENE_EDITOR]],
        ];
    }
    
    public function getListCondition() {
        $aCondition = ['and'];
        {__SEARCH_CONDITION__}
        return $aCondition;
    }

}
