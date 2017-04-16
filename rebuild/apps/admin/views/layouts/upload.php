<?php

/* @var $this View */
/* @var $content string */

use admin\assets\CoreAsset;
use admin\assets\UploadAsset;
use common\assets\BootstrapAsset;
use common\assets\JQueryAsset;
use common\assets\UBoxAsset;
use yii\helpers\Html;
use yii\web\View;

JQueryAsset::register($this);
CoreAsset::register($this);
UBoxAsset::register($this);
BootstrapAsset::register($this);
UploadAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?><?php $this->endBody() ?>
</head>
<body>
<?php $this->beginBody() ?>
<?= $content ?>
<?php $this->endPage() ?>
</html>
