<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use bases\lib\Response;
use common\model\App as mApp;
use common\model\Consumption as mConsumption;
use common\model\OrgCommission;
use common\model\xmodel\Organizations;
use Yii;
use yii\data\Pagination;
use yii\helpers\ArrayHelper;

class SettingController extends ManagerBaseController {

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
        $pageSize = (int) Yii::$app->request->get('pageSize', 12);
        $xWhere = $this->_buildCondition();
        $mModel = Organizations::find()->where($xWhere);
        $oPages = new Pagination(['totalCount' =>$mModel->count(),'pageSize' => $pageSize]);
        $mModelList = $mModel->offset($oPages->offset)->orderBy('id desc')->limit($oPages->limit)->all();
        $aDataList = ArrayHelper::toArray($mModelList);
        foreach ($aDataList as $k => $aItems) {
            $mOrgCommission = OrgCommission::findOne(['org_id' => $aItems['id']]);
            $aDataList[$k]['x_commission'] = '';
            if ($mOrgCommission) {
                $aDataList[$k]['x_commission'] = $mOrgCommission->commision_rate;
            }
        }
        return [
            'aDataList' => $aDataList,
            'oPage' => $oPages,
        ];
    }
    
    private function _getParameter() {
        $oRequest = Yii::$app->request;
        return [
            'id' => (int) $oRequest->get('id', 0),
            'code' => (string) $oRequest->get('code', ''),
            'name' => (string) $oRequest->get('name', ''),
            'status' => (string) $oRequest->get('status', ''),
        ];
    }
    
    private function _buildCondition() {
        $aWhere[] = 'and';
        $aCondition = $this->_getParameter();
        $aAllOrgId = ArrayHelper::getColumn(OrgCommission::findAll([],'org_id'), 'org_id');
        if (isset($aCondition['status']) && $aCondition['status'] != '') {
            if($aCondition['status'] == 0){                
                $aWhere[] = ['not in', 'id', $aAllOrgId]; 
            }else{
                $aWhere[] = ['in', 'id', $aAllOrgId]; 
            }            
        }
        if (isset($aCondition['code']) && $aCondition['code']) {
            $aWhere[] = ['code' => $aCondition['code']];
        }
        if (isset($aCondition['name']) && $aCondition['name']) {
            $aWhere[] = ['like', 'name', $aCondition['name']];
        }
        
        return $aWhere;
    }
    
    public function actionSetOrgCommission() {
        $id = (int) Yii::$app->request->post('id', 0);
        $val = (double) Yii::$app->request->post('value', 0);
        if (!$val) {
            return new Response('请先设置佣金');
        }
        $mOrgCommission = OrgCommission::findOne(['org_id' => $id]);
        if (!$mOrgCommission) {
            !OrgCommission::insert([
                        'org_id' => $id,
                        'commision_rate' => $val,
                        'create_time' => NOW_TIME,
                        'update_time' => NOW_TIME,
                    ]) && Yii::error('写入公会佣金出错');
            return new Response('设置成功', 1, [], 'reload');
        }
        $mOrgCommission->set('commision_rate', $val);
        $mOrgCommission->set('update_time', NOW_TIME);
        !$mOrgCommission->save() && Yii::error('修改公会佣金出错');
        return new Response('设置成功', 1, [], 'reload');
    }

}
