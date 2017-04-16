<?php
namespace common\lib\event;

class AfterPayOrder extends \yii\base\Event{
        public $orderSn = null;
        public $payType = null;
        public $orderInfo = [];
}