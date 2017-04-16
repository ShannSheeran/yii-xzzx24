<?php

namespace common\model\form;

use Yii;
use common\model\Member;
use yii\data\Pagination;

class MemberForm extends \yii\base\Model {
    
    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_MEMBER = 'editor_Member';

    /**
     * 获取数据
     */
    const SCENE_GET_MEMBER = 'get_member';
    public $page = 1;
    public $pageSize = 15;
    
    public $user_name;
    public $mobile;
    public $email;
    public $money;
    public $score;
    public $user_id;
    public $references_id;
    public $vender_id;
    public $create_time;
    public $title;
    public $flag;
    
    public $update_time;
    public $category_id;
    
    public static $aActionOpt = ['=','>=','<','<=','>'];

    public function rules() {
        return [
             ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_MEMBER]],
            [['user_name','mobile','email','money','score','references_id','create_time','update_time','category_id','title','vender_id','flag'], 'safe'],
        ];
    }
    
    public function checkVenderId(){
		return true;
	}

    public function getList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
        ];
        $aList = Member::getList($aCondition, $aControl);
        return $aList;
    }
    
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return Member::getCount($aCondition);
    }

    public function getListCondition() {
        $aCondition = ['and'];
        if ($this->user_name) {
            $aCondition[] = ['like', 'user_name', $this->user_name];
        }
        
        if($this->vender_id){
            $aCondition[] = ['=','vender_id',$this->vender_id];
        }
        
        if($this->flag){
            $aCondition[] = ['=','flag',$this->flag];
        }
        
        if($this->mobile){
            $aCondition[] = ['like','mobile',$this->mobile];
        }
        
        if($this->email){
            $aCondition[] = ['like','email',$this->email];
        }
        
        if($this->title){
            $aCondition[] = ['=','category_id',$this->title];
        }
        
        if($this->user_id){
            
        }
        
        if($this->references_id){
            $aCondition[] = ['references_id'=>(int)$this->references_id];
        }
        return $aCondition;
    }

    public function getPageObject() {
        $aCondition = $this->getListCondition();
        $count = Member::getCount($aCondition);
        return new Pagination(['totalCount' => $count, 'pageSize' => $this->pageSize]);
    }

}
