<?php
namespace common\lib\event;

class AfterGetWxUserAndCheckAdConfig extends \yii\base\Event{
    public $aWxUserInfo = [];
    public $adId = 0;
}