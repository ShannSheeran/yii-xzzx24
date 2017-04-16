<?php

namespace common\model\form;

use Yii;
use common\model\Goods;
use yii\data\Pagination;
use yii\validators\UniqueValidator;

class GoodsForm extends \yii\base\Model {
    
    /**
     * 编辑时候用到的场景
     */
    const SCENE_EDITOR_GOODS = 'editor_goods';

    /**
     * 添加场景
     */
    const SCENE_ADD_GOODS = 'add_goods';

    /**
     * 获取数据
     */
    const SCENE_GET_GOODS = 'get_goods';
    public $page = 1;
    public $pageSize = 15;

    public $vender_id;
    public $id;
    public $name;
    public $category_id;
    public $brand_id;
    public $goods_sn;
    public $is_special;
    public $market_price;
    public $sale_price;
    public $price;
    public $is_hot;
    public $is_score_goods;
    public $is_promote;
    public $promote_price;
    public $sale_nums;
    public $nums;
    public $is_best;
    public $is_new;
    public $status;
    public $is_delete = 0;
    public $country_id;
    
    
    public $sale_price_start;
    public $sale_price_end;
    
    public $start_time;
    public $end_time;
    
    public $nums_opt;
    
    public $sort = false;
    public $order;
    
    public $order_by = [];
    
    public static $aActionOpt = ['=','>=','<','<=','>'];
    
    public static $orderConst = ['asc' => SORT_ASC, 'desc' => SORT_DESC];

    public function rules() {
        //yii\validators 如果不明确请参看这里
        return [
            ['page', 'compare', 'compareValue' => 0, 'operator' => '>', 'on' => [self::SCENE_GET_GOODS]],
            [['name', 'goods_sn', 'is_special', 'market_price', 'sale_price', 'price', 'is_hot', 'is_special', 'sale_nums', 'is_score_goods', 'is_promote', 'promote_price', 'nums', 'is_best', 'is_new', 'status','category_id','brand_id','country_id','order_by','is_delete'], 'safe', 'on' => [self::SCENE_GET_GOODS]],
            [['sort','order','sale_price_end', 'sale_price_end', 'start_time', 'end_time'], 'safe', 'on' => [self::SCENE_GET_GOODS]],
            [['id','category_id','brand_id'], 'required', 'on' => [self::SCENE_EDITOR_GOODS]],
            ['name', 'unique','targetClass'=> Goods::className(),'message'=>'商品名称已经存在', 'on' => [self::SCENE_ADD_GOODS]],
            [['id','category_id','brand_id'], 'required', 'on' => [self::SCENE_EDITOR_GOODS]],
            [['vender_id'], 'safe'],
        ];
    }
    
    public function getList($aFeild = []) {
        $aCondition = $this->getListCondition();
        $orderBy = [];
        //提供外部多个排序
        if($this->order_by){
            $orderBy = $this->order_by;
        }else{
            //排序
            if ($this->sort) {
                if (!isset(self::$orderConst[$this->order])) {
                    $this->order = SORT_DESC;
                } else {
                    $this->order = self::$orderConst[$this->order];                
                }
                $orderBy = [
                    $this->sort => $this->order,
                ];
            }            
        }
        

        $aControl = [
            'page' => $this->page,
            'page_size' => $this->pageSize,
            'order_by' => $orderBy,
        ];
        $aList = Goods::getList($aCondition, $aControl,$aFeild);
        return $aList;
    }
    
    public function getCount(){
        $aCondition = $this->getListCondition();
        return Goods::getCount($aCondition);
    }

    public function getListCondition() {
        $aCondition = ['and'];
        
        if ($this->vender_id) {
            $aCondition[] = ['vender_id' => $this->vender_id];
        }

        if ($this->name) {
            $aCondition[] = ['like', 'name', $this->name];
        }
        if ($this->goods_sn) {
            $aCondition[] = ['like', 'goods_sn', $this->goods_sn];
        }
        if ($this->category_id) {
            $aCondition[] = ['category_id' => $this->category_id];
        }
        if ($this->brand_id) {
            $aCondition[] = ['brand_id' => $this->brand_id];
        }
        if ($this->country_id) {
            $aCondition[] = ['country_id' => $this->country_id];
        }

        if ($this->market_price) {
            $aCondition[] = ['market_price'=>$this->market_price];
        }
        if ($this->price) {
            $aCondition[] = ['price'=>$this->price];
        }
        if ($this->sale_price) {
            $aCondition[] = ['sale_price'=>$this->sale_price];
        }
        if ($this->sale_nums) {
            $aCondition[] = ['sale_nums'=>$this->sale_nums];
        }
        if (is_numeric($this->is_special)) {
            $aCondition[] = ['is_special'=>$this->is_special];
        }
        if (is_numeric($this->is_best)) {
            $aCondition[] = ['is_best'=>$this->is_best];
        }
        if (is_numeric($this->is_hot)) {
            $aCondition[] = ['is_hot'=>$this->is_hot];
        }
        if (is_numeric($this->is_new)) {
            $aCondition[] = ['is_new'=>$this->is_new];
        }
        if (is_numeric($this->is_promote)) {
            $aCondition[] = ['is_promote'=>$this->is_promote];
        }
        if (is_numeric($this->is_score_goods)) {
            $aCondition[] = ['is_score_goods'=>$this->is_score_goods];
        }
        if (is_numeric($this->status)) {
            $aCondition[] = ['status'=>$this->status];
        }
        if (is_numeric($this->is_delete)) {
            $aCondition[] = ['is_delete'=>$this->is_delete];
        }
        
        if ($this->start_time && !$this->end_time) {
            $aCondition[] = ['update_time' => strtotime($this->start_time)];
        }
        if (!$this->start_time && $this->end_time) {
            $aCondition[] = ['update_time' => strtotime($this->price_end)];
        }
        if($this->start_time && $this->end_time){
            $aCondition[]= ['between','update_time',strtotime($this->start_time), strtotime($this->end_time)];
        }
        
        if($this->sale_price_start && !$this->sale_price_end){
            $aCondition[] = ['sale_price'=>(double)$this->sale_price_start];
        }
        if(!$this->sale_price_start && $this->sale_price_end){
            $aCondition[] = ['sale_price'=>(double)$this->sale_price_end];
        }
        
        if($this->sale_price_start && $this->sale_price_end){
           $aCondition[]= ['between','sale_price',(double)$this->sale_price_start,(double)$this->sale_price_end];
        }
        
        if($this->nums){        
            if($this->nums_opt){
               $aCondition[] =  [static::$aActionOpt[$this->nums_opt], 'nums',(int)$this->nums];
            }else{
                 $aCondition[] = ['nums'=>(int)$this->nums];
            }
        }
        return $aCondition;
    }

    public function getPageObject() {
        $aCondition = $this->getListCondition();
        $count = Goods::getCount($aCondition);
        return new Pagination(['totalCount' => $count, 'pageSize' => $this->pageSize]);
    }

}
