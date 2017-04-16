<?php

namespace admin\models\form;

use yii\base\Model;
use Yii;

/**
 * Signup form
 */
class UploadFileForm extends Model {

    public static $aUpType = ['local' => 'local', 'qiniu' => 'qinniu'];
    public static $aFileType = ['image' => 'image', 'xls' => 'xls','file'=>'file'];
    //文件特定后缀
    public static $aFildList = ['zip' => ['zip'], 'xls' => ['xls']];
    public static $aSavePath = [
        'advertising' => '@p.ad_images_upload_dir',
        'default' => '@p.ad_images_upload_dir',
        'advert' => '@p.advert_upload_dir',
    ];
    public $image;

    public function rules() {
        return [
            ['image', 'file',
                'extensions' => ['jpg', 'png', 'gif', 'jpeg'],
                'wrongExtension' => '只能上传{extensions}类型文件！',
                'maxSize' => 1024 * 1024 * 5, 'tooBig' => '文件上传过大！',
                'skipOnEmpty' => true, 'uploadRequired' => '请上传文件！',
                'message' => '上传失败！'
            ]
        ];
    }

}
