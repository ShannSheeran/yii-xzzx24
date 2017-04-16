<?php

namespace admin\controllers;

use admin\models\form\AdvertForm as mForm;
use bases\lib\Response;
use bases\lib\Url;
use common\model\Advert as mModel;
use common\model\App as mApp;
use Yii;
use yii\helpers\ArrayHelper;

class AdvertController extends \admin\lib\ManagerBaseController {

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
        //使用表单模型验证输入信息
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_GET_DATA_LIST);
        if (true !== $isValidate) {
            return $isValidate;
        }
        $oPage = $mForm->getPageObject();
        return [
            'aDataList' => $mForm->getList(),
            'oPage' => $oPage,
        ];
    }
    
    public static function getAppList(){
        $aList = mApp::findAll();
        $aDataList = [];
        foreach($aList as $aData){
            $aDataList[] = [$aData['name'],$aData['id']];
        }
        return $aDataList;
    }

    /**
     * 添加数据
     */
    public function actionAdd() {
        if (!Yii::$app->request->isPost) {
            return $this->render('form', $this->getDataList());
        }
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_ADD, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $lastInsertId = mModel::insert(ArrayHelper::merge($this->_getParameter(), [
            'create_time' => NOW_TIME,
        ]));
        if ($lastInsertId) {
            $mAdvert = mModel::findOne($lastInsertId);            
            $link = Yii::$app->urlManagerHome->createUrl(['site/index','aid'=>$lastInsertId]);
            $mAdvert->set('link',$link);
            $mAdvert->save();
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
    }

    private function _getParameter() {
        $oRequest = Yii::$app->request;
        return [
            'title' => (string) $oRequest->post('title', ''),
            'content' => (string) $oRequest->post('content', ''),
            'app_id' => (int) $oRequest->post('app_id', 0),
            'img' => (string) $oRequest->post('img', ''),
            'link' => (string) $oRequest->post('link', ''),
            'create_time' => strtotime((string) $oRequest->post('create_time', '')),
            'update_time' => strtotime((string) $oRequest->post('update_time', '')),
            'download_link' => (string) $oRequest->post('download_link', ''),
            'desc' => (string) $oRequest->post('desc', ''),
            'start_time' => strtotime((string) $oRequest->post('start_time', '')),
            'end_time' => strtotime((string) $oRequest->post('end_time', '')),
            'status' => (int) $oRequest->post('status', 0),
        ];
    }

    /**
     * 编辑
     */
    public function actionEditor() {
        $mModel = mModel::findOne((int) Yii::$app->request->get('id', 0));
        if (!$mModel) {
            return new Response('数据不存在');
        }
        if (!Yii::$app->request->isPost) {
            return $this->render('form', ArrayHelper::merge($this->getDataList(), ['aData' => $mModel->toArray()]));
        }
        $mForm = new mForm(mModel::className());
        $isValidate = $mForm->alidateData(mForm::SCENE_EDITOR, Yii::$app->request->post());
        if (true !== $isValidate) {
            return $isValidate;
        }
        $aSaveData = $this->_getParameter();
        $aSaveData['update_time'] = NOW_TIME;
        foreach ($aSaveData as $field => $xVale) {
            $mModel->hasProperty($field) && $mModel->set($field, $xVale);
        }
        if ($mModel->save()) {
            return new Response('操作成功', 1, [], 'back');
        }
        return new Response('操作失败');
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
        $count = mModel::saveAll(['in', 'id', $aId], [$field => $val]);
        if (!$count) {
            return new Response('操作失败', 0);
        }
        return new Response('操作成功', 1);
    }

    /**
     * 删除（支持批量）
     */
    public function actionDel() {
        $id = (string) Yii::$app->request->post('id', '');
        $aId = explode(',', $id);
        if (!count($aId)) {
            return new Response('数据不存在');
        }
        $nums = mModel::deleteAll(['in', 'id', $aId]);
        return new Response('本次操作成功，影响的数据有' . $nums, 1);
    }

}
