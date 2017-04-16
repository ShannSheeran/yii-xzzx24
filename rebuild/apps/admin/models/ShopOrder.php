<?php

namespace admin\models;

use Yii;
use bases\lib\Query;

class ShopOrder extends \common\lib\DbOrmModel {

    public static function tableName() {
        return Yii::$app->db->parseTable('_@shop_order');
    }

    public static function tableNameMain() {
        return Yii::$app->db->parseTable('_@shop_order as a');
    }
    
    public static function select_phone(){
        $sql="select phone_no as id,phone_no as text from (
            select phone_no1 as phone_no from shop_order
            union all 
            select phone_no2 as phone_no from shop_order
        )a where phone_no<>'' group by phone_no";
        return Yii::$app->db->createCommand($sql)->queryAll();
    }
    
    public static function select_one($aWhere = [],$aField = '*'){
        $oQuery = new Query();
        $oQuery->from(static::tableName())
        ->select($aField)
        ->where($aWhere);
         
        $rows = $oQuery->one();
        return $rows;
    }
    
    public static function select_all($aWhere = [],$value = '*'){
        $oQuery = new Query();
        $oQuery->from(static::tableName())
        ->select($value)
        ->where($aWhere);

        $rows = $oQuery->all();
        return $rows;
    }

    /*
     * 联结表查询,得出的数据用于导出订单的excel数据表
     * */
    public static function select_connect($aCondition =[] , $aControl = []){
        $oQuery = new Query;
        $oQuery->select('a.*,b.goods_id,b.nums,b.price,b.total_price,b.goods_name,b.return_time,b.return_number,c.name as manager_name,d.name as pay_name')
            ->from(static::tableNameMain())
            ->rightJoin('shop_goods_order_middle as b', 'a.order_id = b.order_id')
            ->leftJoin('shop_manager as c','a.user_id = c.id')
            ->leftJoin('shop_pay as d','a.pay_id = d.id')
            ->where($aCondition);

        if (isset($aControl['order_by'])) {
            $oQuery->orderBy($aControl['order_by']);
        }

        $rows = $oQuery->all();
        return $rows;
    }
    
    public static function Combobox($condition=[],$value = null) {
        $oQuery = new Query();
        $oQuery->from(static::tableName())->select($condition);
    
        if($value != null){
            $oQuery->groupBy($value);
        }
         
        $rows = $oQuery->all();
        return $rows;
    }
    
    public static function update($aData = [],$aWhere = []){
    	return (new Query())->createCommand()->update(static::tableName(), $aData, $aWhere)->execute();
    }
    
    public static function insert($aData = []){
    	return (new Query())->createCommand()->insert(static::tableName(), $aData)->execute();
    }
    
    public static function delete_data($aWhere = []) {
    	$oQuery = new Query();
    	return $command = $oQuery
    		->createCommand()
	    	->delete(static::tableName(),$aWhere)
	    	->execute();
    }

    public static function getList($aCondition = [], $aControl = []) {
        
        $oQuery = new Query();
        $oQuery->from(static::tableNameMain())
        ->select('a.*,b.name as pay_name,c.user_name as manager_name,e.color as status_color')
        ->leftJoin('shop_pay as b','a.pay_id = b.id')
        ->leftJoin('user as c','a.user_id = c.id')
        ->leftJoin('shop_order_color as e','a.status = e.status and e.table = "order_mas"')
        ->where($aCondition);
        
        if (isset($aControl['order_by'])) {
            $oQuery->orderBy($aControl['order_by']);
        }
        if (isset($aControl['page']) && isset($aControl['page_size'])) {
            $offset = ($aControl['page'] - 1) * $aControl['page_size'];
            $oQuery->offset($offset)->limit($aControl['page_size']);
        }
        $aList = $oQuery->all();
        return $aList;
    }

    public static function getCount($aCondition = []) {
        
        $oQuery = new Query();
        $oQuery->from(Yii::$app->db->parseTable('_@shop_order as a'))
        ->leftJoin('shop_pay as b','a.pay_id = b.id')
        ->leftJoin('shop_manager as c','a.user_id = c.id')
        ->leftJoin('shop_order_color as e','a.status = e.status and e.table = "order_mas"')
        ->where($aCondition);
        
        $aList = $oQuery->count();
        return $aList;
        
    }

    public static function getCountNum($aCondition = []){
        return (new Query())->from(self::tableName())->where($aCondition)->count();
    }

}
