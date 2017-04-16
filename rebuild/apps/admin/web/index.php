<?php
require(__DIR__ . '/../../../../config-local.php');
$oAppCreater = new \common\lib\AppCreater(['appId' => 'admin','isRunBootstrap'=>true]);
$oAppCreater->createApp()->run();