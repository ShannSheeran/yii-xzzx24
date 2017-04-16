<?php

namespace admin\controllers;

use admin\lib\ManagerBaseController;
use admin\models\form\UploadFileForm;
use bases\lib\Response;
use common\model\form\FileUploadForm;
use common\model\form\ImageUploadForm;
use Yii;

/**
 * 工具类
 */
class PlugsController extends ManagerBaseController {

    /**
     * 显示分类列表视图
     */
    public function actionIcon() {
        $this->layout = 'icon';
        return $this->render('icon');
    }

    public function actionShowOneFile() {
        $uptype = (string) Yii::$app->request->get('uptype', 'local');
        $type = (string) Yii::$app->request->get('type', 'image');
        $field = (string) Yii::$app->request->get('field', 'file');
        $savePath = (string) Yii::$app->request->get('save_path', 'default');
        $ext = (string) Yii::$app->request->get('ext', '');
        if (!isset(UploadFileForm::$aUpType[$uptype])) {
            return new Response('非法参数1');
        }
        if (!isset(UploadFileForm::$aFileType[$type])) {
            return new Response('非法参数2');
        }
        if (!isset(UploadFileForm::$aSavePath[$savePath])) {
            return new Response('非法参数3');
        }
        if ($ext && !isset(UploadFileForm::$aFildList[$ext])) {
            return new Response('非法参数4');
        }
        $extInfo = isset(UploadFileForm::$aFildList[$ext]) ? UploadFileForm::$aFildList[$ext] : [];
        $this->layout = 'upload';
        return $this->render('one-file', ['uptype' => $uptype, 'type' => $type, 'savePath' => $savePath, 'field' => $field, 'aFildList' => $extInfo, 'ext' => $ext]);
    }

    /**
     * 文件上传上传
     */
    public function actionUploadFile() {
        $uptype = (string) Yii::$app->request->get('uptype', 'local');
        $type = (string) Yii::$app->request->get('type', 'image');
        $field = (string) Yii::$app->request->get('name', 'file');
        $scenario = (string) Yii::$app->request->get('scenario', 'file');
        $savePath = (string) Yii::$app->request->get('save_path', 'default');
        $ext = (string) Yii::$app->request->get('ext', '');
        if (!isset(UploadFileForm::$aUpType[$uptype])) {
            return new Response('非法参数1');
        }
        if (!isset(UploadFileForm::$aFileType[$type])) {
            return new Response('非法参数2');
        }
        if (!isset(UploadFileForm::$aSavePath[$savePath])) {
            return new Response('非法参数3');
        }
        if ($ext && !isset(UploadFileForm::$aFildList[$ext])) {
            return new Response('非法参数4');
        }
        $aKeyList = array_keys($_FILES);
        $field = isset($aKeyList[0]) ? $aKeyList[0] : $field;
        //上传文件
        if (UploadFileForm::$aFileType[$type] == 'file') {
            return FileUploadForm::uploadFile($field, Yii::getAlias(Yii::getAlias(UploadFileForm::$aSavePath[$savePath])));
        }
        //上传图片
        return ImageUploadForm::uploadImage($field, Yii::getAlias(Yii::getAlias(UploadFileForm::$aSavePath[$savePath])));
    }

}
