<?php

namespace common\model\form;

use Yii;
use common\model\ShopOrder;

class ShopOrderListForm extends \yii\base\Model {

    public $page = 1;
    public $pageSize = 15;
    public $rows = 15;
    public $order_by = 'create_time desc ';
    
    public $total_money;
    public $create_time;
    public $pay_time;
    public $status;
    public $is_pay;
    public $is_have_back;
    public $remark;
    public $pay_id;
    public $goods_nums;
    public $user_id;
    public $back_time;
    public $address;
    public $province;
    public $city;
    public $area;
    public $street;
    public $order_id;
    public $vender_id;
    public $phone_no;
    public $consignee_name;
    public $express_name;
    public $express_number;
    
    public $goods_id;
    public $goods_name;
    public $manager_name;
    
    
    public function rules() {
        return [
            [['manager_name','consignee_name','phone_no','goods_name','goods_id','order_id','total_money','create_time','pay_time','status','is_pay','is_have_back','remark','pay_id','goods_nums','user_id','back_time','address','province','city','area','street','express_name','express_number','vender_id','page','rows','pageSize'], 'safe'],
        ];
    }
    
    public function checkVenderId(){
		return true;
	}

    public function getList() {
        $aCondition = $this->getListCondition();
       
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->rows,
            'order_by' => $this->order_by,
        ];
        
        $aList = ShopOrder::getList($aCondition, $aControl);
        return $aList;
    }
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return ShopOrder::getCount($aCondition);
    }

    public function getListCondition() {
        $aCondition = ['and'];
        
        if (isset($this->vender_id) && $this->vender_id != '') {
            $aCondition[] = ['vender_id' => $this->vender_id];
        }
        
        if (isset($this->order_id) && $this->order_id != '') {
            $aCondition[] = ['order_id' => $this->order_id];
        }
    	
        if (isset($this->status)) {
            if (is_array($this->status)) {
                $aCondition[] = ['in', 'status', $this->status];
            } elseif ($this->status != '') {
                $aCondition[] = ['status' => $this->status];
            }
        }

        if (isset($this->goods_id) && $this->goods_id != '') {
            $aCondition[] = ['goods_id' => $this->goods_id];
        }
        
        if (isset($this->goods_name) && $this->goods_name != '') {
            $aCondition[] = ['like', 'goods_name',$this->goods_name];
        }
        
        if (isset($this->phone_no1) && $this->phone_no1 != '') {
            $aCondition[] = ['phone_no1' => $this->phone_no1];
        }
        
        if (isset($this->consignee_name) && $this->consignee_name != '') {
           $aCondition[] = ['like', 'consignee_name',$this->consignee_name];
        }
        return $aCondition;
    }

}
