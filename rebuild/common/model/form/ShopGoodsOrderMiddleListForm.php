<?php

namespace common\model\form;

use Yii;
use common\model\ShopGoodsOrderMiddle;

class ShopGoodsOrderMiddleListForm extends \yii\base\Model {
    
    public $order_by = ' goods_id desc ';
    
    public $vender_id;
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
            [['goods_name','total_price','price','nums','status','goods_id','order_id','return_number','return_time','vender_id'], 'safe'],
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
    	
    	$aCondition = ['and'];
        
        if (isset($this->vender_id) && $this->vender_id != '') {
            $aCondition[] = ['vender_id' => $this->vender_id];
        }
        
        if (isset($this->order_id) && $this->order_id != '') {
            $aCondition[] = ['order_id' => $this->order_id];
        }
    	
        return $aCondition;
    }

}
