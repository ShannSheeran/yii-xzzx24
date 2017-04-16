<?php

namespace admin\controllers;

use Yii;
use admin\lib\ManagerController;
use bases\lib\EasyResponse;
use admin\models\form\ShopOrderListForm;
use common\model\ShopGoodsOrderMiddle;
use admin\models\ShopOrder;


/**
 * 导出excel表格管理控制器
 */
class ExportController extends ManagerController
{

    /**
     * 表示不用检查权限就能访问的action
     * @var array
     */
    public static $aAllow = ['export-order'];


    /**
     * 表示除了超级管理员其他用户都不能访问的action aDeny 的优先级别高于allow的优先级别
     * @var array
     */
    public static $aDeny = [];


    /**
     * 导出订单表格excel表
     */
    public function actionExportOrder(){
        $oShopOrderListForm = new ShopOrderListForm();
        $aParams = Yii::$app->request->get();

        if ($aParams && (!$oShopOrderListForm->load($aParams, '') || !$oShopOrderListForm->validate())) {
            return new EasyResponse(current($oShopOrderListForm->getErrors())[0]);
        }

        $oShopOrderListForm->page = 1;
        $oShopOrderListForm->pageSize = $oShopOrderListForm->getCount();

        $aShopOrderList = $oShopOrderListForm->getOrderList();

        //return new EasyResponse('',1,$aShopOrder,2);


        if(empty($aShopOrderList)){
            return new EasyResponse('抱歉，无相关数据', 0 , [] , 0);
        }

        $this->layout = false;

        return $this->render('export_order',['aShopOrderList' => $aShopOrderList]);



    }



    /**
     *导出订单表格csv表
     */
    public function actionExportOrderTemplate(){
        $aOrderId = ShopOrder::select_all(['status' => 0],'order_id');
        $this->layout = false;
        //return new EasyResponse('',1,$aOrderId,2);

        return $this->render('export_order_template',['aOrderId' => $aOrderId]);
    }

    /*
     * 上传发货信息
     * */



}