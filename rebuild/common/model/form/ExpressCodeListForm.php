<?php

namespace common\model\form;

use Yii;
use admin\models\ExpressCode;

class ExpressCodeListForm extends \yii\base\Model {

    public $order_by = ' id asc ';
    
    public $code;
    public $express;
    public $status;
    
    
    public function rules() {
        return [
            [['code','express','status'], 'safe'],
        ];
    }
    
    public function checkVenderId(){
		return true;
	}

    public function getList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'order_by' => $this->order_by,
        ];
        $aList = ExpressCode::getList($aCondition, $aControl);
        return $aList;
    }
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return ExpressCode::getCount($aCondition);
    }

    public function getListCondition() {
    	
        $aCondition = ['and'];
        
        if (isset($this->code) && $this->code != '') {
            $aCondition[] = ['like', 'code', $this->code];
        }
    	
        if (isset($this->express) && $this->express != '') {
            $aCondition[] = ['like', 'express', $this->express];
        }
        
        if (isset($this->status) && $this->status != '') {
            $aCondition[] = ['status' => $this->status];
        }
        
        return $aCondition;
    }

}
