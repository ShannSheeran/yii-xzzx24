<?php

namespace home\lib;

use Yii;
use common\model\Domain;

/**
 * 获取代理商相关信息组件
 */
class Vender extends \yii\base\Object {

    public $id = 0;

    public function getId() {
        if(!$id){
            throw new \yii\web\HttpException('发生支付错误请联系管理员');
        }
       return $this->id;
    }
    
}
