<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Response;
use common\lib\event\ConsumptionEventConfig;
use common\model\App as mApp;
use common\model\Consumption as mConsumption;
use Yii;
use yii\data\Pagination;

class ConsumptionController extends ManagerBaseController {

    /**
     * 表示不用检查权限就能访问的action
     * @var array
     */
    public static $aAllow = [];

    /**
     * 表示除了超级管理员其他用户都不能访问的action aDeny 的优先级别高于allow的优先级别
     * @var array
     */
    public static $aDeny = [];

    /**
     * 提供数据和分页器
     */
    public function getDataList() {
        $page = (int) Yii::$app->request->get('page', 1);
        $pageSize = (int) Yii::$app->request->get('pageSize', 20);
        $xWhere = $this->_buildCondition();
        $xWhere[] = ['in', 'status', [0]];
        $aConsumption = mConsumption::getList($xWhere, ['page' => $page, 'page_size' => $pageSize, 'order_by' => ['id' => SORT_DESC]]);
        $count = mConsumption::getCount($xWhere);
        return [
            'aDataList' => $aConsumption,
            'oPage' => new Pagination(['totalCount' => $count, 'pageSize' => $pageSize, 'pageSizeParam' => 'pageSize']),
        ];
    }

    public function actionSettlement() {
        $page = (int) Yii::$app->request->get('page', 1);
        $pageSize = (int) Yii::$app->request->get('pageSize', 20);
        $xWhere = $this->_buildCondition();
        $xWhere[] = ['in', 'status', [1]];
        $aConsumption = mConsumption::getList($xWhere, ['page' => $page, 'page_size' => $pageSize, 'order_by' => ['id' => SORT_DESC]]);
        $count = mConsumption::getCount($xWhere);
        return $this->render('settlement', [
                    'aDataList' => $aConsumption,
                    'oPage' => new Pagination(['totalCount' => $count, 'pageSize' => $pageSize, 'pageSizeParam' => 'pageSize']),
        ]);
    }

    private function _getParameter() {
        $oRequest = Yii::$app->request;
        return [
            'id' => (int) $oRequest->get('id', 0),
            'app_id' => (string) $oRequest->get('app_id', ''),
            'uid' => (string) $oRequest->get('uid', ''),
            'meny' => (string) $oRequest->get('meny', ''),
            'desc' => (string) $oRequest->get('desc', ''),
            'desc' => (string) $oRequest->get('desc', ''),
            'status' => (string) $oRequest->get('status', ''),
            'type' => (string) $oRequest->get('type', ''),
            'ad_id' => (string) $oRequest->get('ad_id', ''),
            'order_sn' => (string) $oRequest->get('order_sn', ''),
            'rednet_id' => (string) $oRequest->get('rednet_id', ''),
            'org_id' => (string) $oRequest->get('org_id', ''),
            'start_create_time' => (string) $oRequest->get('start_create_time', ''),
            'end_create_time' => (string) $oRequest->get('end_create_time', ''),
        ];
    }

    private function _buildCondition() {
        $aWhere[] = 'and';
        $aCondition = $this->_getParameter();
        if (isset($aCondition['desc']) && $aCondition['desc']) {
            $aWhere[] = ['like', 'desc', $aCondition['desc']];
        }
        if (isset($aCondition['meny']) && $aCondition['meny']) {
            $aWhere[] = ['like', 'meny', $aCondition['meny']];
        }
        if (isset($aCondition['order_sn']) && $aCondition['order_sn']) {
            $aWhere[] = ['like', 'order_sn', $aCondition['order_sn']];
        }
        if (isset($aCondition['app_id']) && $aCondition['app_id'] != '') {
            $aWhere[] = ['app_id' => (int) $aCondition['app_id']];
        }
        if (isset($aCondition['uid']) && $aCondition['uid'] != '') {
            $aWhere[] = ['uid' => (int) $aCondition['uid']];
        }
        if (isset($aCondition['status']) && $aCondition['status'] != '') {
            $aWhere[] = ['status' => (int) $aCondition['status']];
        }
        if (isset($aCondition['ad_id']) && $aCondition['ad_id'] != '') {
            $aWhere[] = ['ad_id' => (int) $aCondition['ad_id']];
        }
        if (isset($aCondition['rednet_id']) && $aCondition['rednet_id'] != '') {
            $aWhere[] = ['rednet_id' => (int) $aCondition['rednet_id']];
        }
        if (isset($aCondition['org_id']) && $aCondition['org_id'] != '') {
            $aWhere[] = ['org_id' => (int) $aCondition['org_id']];
        }
        if (isset($aCondition['type']) && $aCondition['type'] != '') {
            $aWhere[] = ['type' => (int) $aCondition['type']];
        }
        $starCreateTime = (isset($aCondition['start_create_time']) && $aCondition['end_create_time']) ? strtotime($aCondition['start_create_time']) : '';
        $endCreateTime = (isset($aCondition['end_create_time']) && $aCondition['end_create_time']) ? strtotime($aCondition['end_create_time']) : '';
        if ($starCreateTime && !$endCreateTime) {
            $aWhere[] = ['<=', 'create_time', $starCreateTime];
        }
        if (!$starCreateTime && $endCreateTime) {
            $aWhere[] = ['>=', 'create_time', $endCreateTime];
        }

        if ($starCreateTime && $endCreateTime) {
            $aWhere[] = ['between', 'create_time', $starCreateTime, $endCreateTime];
        }

        return $aWhere;
    }

    public static function getAppList() {
        $aList = mApp::findAll();
        $aDataList = [];
        foreach ($aList as $aData) {
            $aDataList[] = [$aData['name'], $aData['id']];
        }
        return $aDataList;
    }

    /**
     * 更新修改（支持批量）
     */
    public function actionUpdate() {
        $id = (string) Yii::$app->request->post('id', '');
        $aId = explode(',', $id);
        if (!count($aId)) {
            return new Response('数据不存在');
        }
        $field = (string) Yii::$app->request->post('field', 0);
        $val = (int) Yii::$app->request->post('value', 0);
        if (!isset(mConsumption::$aOptFeild[$field])) {
            return new Response('不能操作非安全字段之外的字段');
        }
        foreach ($aId as $k => $id) {
            //已经审核的不能再操作
            $mConsumption = mConsumption::findOne($id);
            if ($mConsumption && ($mConsumption->status == mConsumption::STATUS_CHECK_END || $mConsumption->status == 2)) {
                unset($aId[$k]);
            }
        }
        $aSaveData[$field] = $val;
        //审核加上审核时间
        if ($val == mConsumption::STATUS_CHECK_END) {
            $aSaveData['check_time'] = NOW_TIME;
            //审核事件监听
            $this->on(mConsumption::EVENT_AFTER_STATUS_CHECK_END, ['common\model\OrgCommission', 'dealConsumptionCheckEvent']);
        }
        $count = mConsumption::saveAll(['in', 'id', $aId], $aSaveData);
        if (!$count) {
            return new Response('操作失败', 0);
        }
        //审核完成通知代码去同步到小主系统表
        $oEventData = new ConsumptionEventConfig();
        $oEventData->aConsumptionId = $aId;
        $this->trigger(mConsumption::EVENT_AFTER_STATUS_CHECK_END, $oEventData);
        return new Response('操作成功', 1);
    }

}
