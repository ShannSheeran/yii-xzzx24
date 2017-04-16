<?php

namespace api\controllers;

use api\models\VisitRecord;
use bases\lib\Response;
use common\model\tmodel\ReceiveAdvert;
use Yii;
use yii\helpers\Json;
use yii\web\Controller;

class ToolsController extends Controller {
    public $enableCsrfValidation = false;
    public function actionAdJt() {
        $id = (int) Yii::$app->request->post('id', 0);
        $uploadImg = (string) Yii::$app->request->post('url', '');
        if (!$id || !$uploadImg) {
            return new Response('非法操作');
        }
        $mModel = ReceiveAdvert::findOne(['id' => $id, 'upload_img' => $uploadImg]);
        if (!$mModel) {
            return new Response('非法操作');
        }
        Yii::info('清空截图--'.Json::encode($mModel->toArray()));
        $mModel->upload_img = NULL;
        $mModel->update();
        return new Response('删除成功', 1);
    }
    
    public function actionAdJtVisit() {
        $id = (int) Yii::$app->request->post('id', 0);
        $cid = (int) Yii::$app->request->post('cid', 0);
        $uploadImg = (string) Yii::$app->request->post('url', '');
        if (!$id || !$uploadImg || !$cid) {
            return new Response('非法操作');
        }
        $mModel = ReceiveAdvert::findOne(['id' => $id, 'upload_img' => $uploadImg]);
        if (!$mModel) {
            return new Response('非法操作');
        }
        $mVisitModel = VisitRecord::findOne(['did'=>$id]);
        if (!$mVisitModel) {
            $lastInsertId = VisitRecord::insert([
                'did' => $id,
                'create_time' => NOW_TIME,
                'ip' => Yii::$app->request->userIp,
                'cid' => $cid
            ]);
            return new Response('记录成功', 1,$lastInsertId);
        }
        $mVisitModel->set('create_time',NOW_TIME);
        $mVisitModel->set('ip',Yii::$app->request->userIp);
        return new Response('记录成功', 1);
    }
    
    public function actionAdVisit() {
        $id = (int) Yii::$app->request->post('id', 0);
        if (!$id) {
            return new Response('非法操作');
        }        
        $aVisitModel = VisitRecord::findAll(['cid'=>$id]);
        if (!$aVisitModel) {            
            return new Response('获取成功', 1,[]);
        }
        return new Response('获取成功', 1,$aVisitModel);
    }

}
