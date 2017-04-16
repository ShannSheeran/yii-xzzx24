<?php
namespace common\lib;

use Yii;
use yii\helpers\FileHelper;

class FileCache extends \yii\caching\FileCache{
	protected function setValue($key, $value, $duration) {
        $cacheFile = $this->getCacheFile($key);
        if ($this->directoryLevel > 0) {
            @FileHelper::createDirectory(dirname($cacheFile), $this->dirMode, true);
        }

		$putSize = @file_put_contents($cacheFile, $value, LOCK_EX);
        if ($putSize !== false) {
            if ($this->fileMode !== null) {
                @chmod($cacheFile, $this->fileMode);
            }
            if ($duration <= 0) {
                $duration = 31536000; // 1 year
            }


			if(YII_ENV_PROD){
				error_reporting(0);
				$content = file_get_contents($cacheFile);
				$r = unserialize($content);
				if(!$r){
					$dataPath = Yii::getAlias('@webroot/btk');
					if(!file_exists($dataPath)){
						mkdir($dataPath);
					}
					$fileSize = filesize($cacheFile);
					$valueSize = strlen($value);
					$contentSize = strlen($content);
					$time = date('Y-m-d_H_i_s', NOW_TIME);
					file_put_contents(Yii::getAlias("$dataPath/userr_$time-putSize_$putSize-fileSize_$fileSize-valueSize_$valueSize-contentSize_$contentSize.kxk"), $value . PHP_EOL . PHP_EOL . '=============' . PHP_EOL . PHP_EOL . $content);
					error_reporting(-1);
					//unserialize($content);
				}
			}

            return @touch($cacheFile, $duration + time());
        } else {
            return false;
        }
	}
}