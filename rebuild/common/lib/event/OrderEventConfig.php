<?php

namespace common\lib\event;

class OrderEventConfig extends \yii\base\Event {

    public $orderSn = null;
    public $orderInfo = [];
    public $orderGoodsMiddleDetail = [];

}
