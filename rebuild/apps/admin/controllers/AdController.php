<?php

namespace admin\controllers;

use admin\lib\ManagerController;
use bases\lib\Response;
use common\model\form\AdForm;
use common\model\form\ImageUploadForm;
use Yii;
use yii\web\UploadedFile;

/**
 * 分类控制器
 */
class AdController extends ManagerController {

    /**
     * 显示分类列表视图
     */
    public function actionIndex() {
        return $this->render('show_category');
    }

    /**
     * 获取分类列表数据
     */
    public function actionList() {
        
         //使用表单模型验证输入信息
        $mForm = new AdForm();
        $isValidate = $mForm->alidateData(AdForm::SCENE_GET_DATA_LIST);
        if (true !== $isValidate) {
            return $isValidate;
        }        
        return $this->render('list', [
                    'aOrderList' => $mForm->getList(),
                    'oPage' => $mForm->getPageObject(),
        ]);
    }

    public function actionOldUploadFile() {
        $oForm = new ImageUploadForm();
        $oForm->fCustomValidator = function($oForm) {
            list($width, $height) = getimagesize($oForm->oImage->tempName);
            /* if($width != 340 || $height != 235){
              $oForm->addError('oImage', '图片宽高应为340px*235px');
              return false;
              } */
            return true;
        };

        $isUploadFromUEditor = false;
        //保存路径
        $savePath = Yii::getAlias('@p.category');

        $oForm->oImage = UploadedFile::getInstanceByName('image');
        if (!$oForm->upload($savePath)) {
            $message = current($oForm->getErrors())[0];
            return new Response($message, 0);
        } else {
            return new Response('', 1, $oForm->savedFile);
        }
    }

    /**
     * 图片上传
     */
    public function actionUploadFile() {
        return ImageUploadForm::uploadImage('image', Yii::getAlias('@p.category_images_upload_dir'));
    }

}
