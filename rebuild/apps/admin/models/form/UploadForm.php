<?php
namespace admin\models\form;

use yii\base\Model;
use Yii;

/**
 * Signup form
 */
class UploadForm extends Model
{	
	public $image;
    public function rules()
    {
		 return [
			['image','file',
				'extensions'=>['jpg','png','gif', 'jpeg'],
				'wrongExtension'=>'只能上传{extensions}类型文件！',
				'maxSize'=>1024*1024*5, 'tooBig'=>'文件上传过大！',
				'skipOnEmpty'=>true, 'uploadRequired'=>'请上传文件！',
				'message'=>'上传失败！'
			]
		];
    }
	
}
