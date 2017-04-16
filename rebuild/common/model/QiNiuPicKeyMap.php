<?php
namespace common\model;

use common\lib\DbOrmModel;
use Yii;

class QiNiuPicKeyMap extends DbOrmModel{

	public static function tableName(){
		return Yii::$app->db->parseTable('_@qiniu_pic_key_map');
	}
	
	public static function replaceLocalPicToQiniuFileKey($aData = []){
		if(!is_array($aData)){
			return $aData;
		}
		$jsonStr = json_encode($aData);
		
		$aFileMap = [];
		preg_match_all('/\"\\\\\/static\\\\\/data\\\\\/[0-9a-z\.\\\\\/\-\_]+\\\\\/[0-9a-z\.\\\\\/\-\_]+\"/', $jsonStr, $aMatchList);	
		foreach($aMatchList[0] as $key => $value){
			$aPathInfo = pathinfo($value);
			$aFileMap[$aPathInfo['filename']] = $value;
		}
		$aQiniuPicKey = array_keys($aFileMap);
		$aQiniuPicKeyMapList = [];
		if($aQiniuPicKey){
			$aQiniuPicKeyMapList = static::findAll(['file_name' => $aQiniuPicKey]);
		}
		foreach($aFileMap as $fileName => $path){
			$flag = false;
			foreach($aQiniuPicKeyMapList as $k => $aValue){
				if($aValue['file_name'] == $fileName){
					$jsonStr = str_replace(trim($path, '"'), $aValue['file_key'], $jsonStr);
					$flag = true;
					break;
				}
			}
			if(!$flag){
				$jsonStr = str_replace(trim($path, '"'), '', $jsonStr);
			}
		}
		return json_decode($jsonStr, true);
	}
}