<?php

namespace admin\models\form;

use common\lib\FormBaseModel;

class AdvertForm extends FormBaseModel {

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
    public $title;
    public $content;
    public $app_id;
    public $img;
    public $link;
    public $create_time;
    public $update_time;
    public $download_link;
    public $desc;
    public $start_time;
    public $end_time;
    public $status;
    public $is_deleted;
    

    public function rules() {
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_DATA_LIST]],
            [['id','title','content','app_id','img','link','create_time','update_time','download_link','desc','start_time','end_time','status','is_deleted',], 'safe', 'on' => [self::SCENE_GET_DATA_LIST,self::SCENE_ADD,self::SCENE_EDITOR]],
        ];
    }
    
    public function getListCondition() {
        $aCondition = ['and'];
        
        if ($this->title) {
            $aCondition[] = ['like', 'title', $this->title];
        }
        if ($this->content) {
            $aCondition[] = ['like', 'content', $this->content];
        }
        if ($this->app_id != '') {
            $aCondition[] = ['app_id' => (int)$this->app_id];
        }
        if ($this->img) {
            $aCondition[] = ['like', 'img', $this->img];
        }
        if ($this->link) {
            $aCondition[] = ['like', 'link', $this->link];
        }
        if ($this->create_time) {
            $aCondition[] = ['create_time' => (int)$this->create_time];
        }
        if ($this->update_time) {
            $aCondition[] = ['update_time' => (int)$this->update_time];
        }
        if ($this->download_link) {
            $aCondition[] = ['like', 'download_link', $this->download_link];
        }
        if ($this->desc) {
            $aCondition[] = ['like', 'desc', $this->desc];
        }
        if ($this->start_time) {
            $aCondition[] = ['start_time' => $this->start_time];
        }
        if ($this->end_time) {
            $aCondition[] = ['end_time' => $this->end_time];
        }
        if ($this->status != '') {
            $aCondition[] = ['status' => (int)$this->status];
        }
        return $aCondition;
    }

}
