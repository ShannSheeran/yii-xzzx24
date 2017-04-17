<?php

namespace admin\models\form;

use common\lib\FormBaseModel;

class SmsLogForm extends FormBaseModel {

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
    
    
    public $id;
    public $phone;
    public $msg;
    public $create_time;
    public $status;
    public $type;
    

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['id','phone','msg','create_time','status','type',], 'safe', 'on' => [self::SCENE_GET_DATA_LIST,self::SCENE_ADD,self::SCENE_EDITOR]],
        ];
    }
    
    public function getListCondition() {
        $aCondition = ['and'];
        
        if ($this->id != '') {
            $aCondition[] = ['id' => (int)$this->id];
        }
        if ($this->phone) {
            $aCondition[] = ['like', 'phone', $this->phone];
        }
        if ($this->msg) {
            $aCondition[] = ['like', 'msg', $this->msg];
        }
        if ($this->create_time != '') {
            $aCondition[] = ['create_time' => (int)$this->create_time];
        }
        if ($this->status != '') {
            $aCondition[] = ['status' => (int)$this->status];
        }
        if ($this->type != '') {
            $aCondition[] = ['type' => (int)$this->type];
        }
        return $aCondition;
    }

}
