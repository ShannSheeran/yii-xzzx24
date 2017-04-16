<?php

namespace admin\models\form;

use Yii;
use admin\models\ShopOrder;

class ShopOrderListForm extends \yii\base\Model {

    public $page = 1;
    public $pageSize = 50;
    public $order_by = ' a.create_time desc ';
    
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
    public $phone_no;
    public $consignee_name;
    public $express_name;
    public $express_number;
    
    public $goods_id;
    public $goods_name;
    public $manager_name;
    
    
    public function rules() {
        return [
            [['manager_name','consignee_name','phone_no','goods_name','goods_id','order_id','total_money','create_time','pay_time','status','is_pay','is_have_back','remark','pay_id','goods_nums','user_id','back_time','address','province','city','area','street','express_name','express_number'], 'safe'],
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
            'order_by' => $this->order_by,
        ];
        $aList = ShopOrder::getList($aCondition, $aControl);
        return $aList;
    }

    public function getOrderList() {
        $aCondition = $this->getListCondition();
        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
            'order_by' => $this->order_by,
        ];
        $aList = ShopOrder::select_connect($aCondition = [] , $aControl = []);
        return $aList;
    }
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return ShopOrder::getCount($aCondition);
    }

    public function getListCondition() {
    	
        $where = '1=1';
        
        if (isset($this->order_id) && $this->order_id != '') {
            $where .= " and a.order_id like '%".$this->order_id."%'";
        }
    	
        if (isset($this->status) && $this->status != '') {
            $where .= " and a.status = ".$this->status;
        }
    	
        if (isset($this->goods_id) && $this->goods_id != '') {
            $where .= " and a.order_id in (select order_id from shop_goods_order_middle where goods_id=".$this->goods_id." group by order_id)";
        }
        
        if (isset($this->goods_name) && $this->goods_name != '') {
            $where .= " and a.order_id in (select order_id from shop_goods_order_middle where goods_name like '%".$this->goods_name."%' group by order_id)";
        }
        
        if (isset($this->phone_no) && $this->phone_no != '') {
            $where .= " and (a.phone_no1 like '%".$this->phone_no."%' or a.phone_no2 like '%".$this->phone_no."%'";
        }
        
        if (isset($this->manager_name) && $this->manager_name != '') {
            $where .= " and c.user_name like '%".$this->manager_name."%'";
        }
        
        return $where;
    }

}
