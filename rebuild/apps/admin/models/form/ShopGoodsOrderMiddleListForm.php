<?php

namespace admin\models\form;

use Yii;
use common\model\ShopGoodsOrderMiddle;

class ShopGoodsOrderMiddleListForm extends \yii\base\Model {
    
    public $order_by = ' goods_id desc ';
    
    public $order_id;
    public $goods_id;
    public $status;
    public $nums;
    public $price;
    public $total_price;
    public $goods_name;
    public $return_number;
    public $return_time;
    
    public function rules() {
        return [
            [['goods_name','total_price','price','nums','status','goods_id','order_id','return_number','return_time'], 'safe'],
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
        $aList = ShopGoodsOrderMiddle::getList($aCondition, $aControl);
        return $aList;
    }
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return ShopGoodsOrderMiddle::getCount($aCondition);
    }

    public function getListCondition() {
    	
    	$aWhere = '1 = 2';
    	
    	if(isset($this->order_id) && $this->order_id != ''){
    	    $aWhere = ['order_id'=>$this->order_id];
    	}
    	
        return $aWhere;
    }

}
