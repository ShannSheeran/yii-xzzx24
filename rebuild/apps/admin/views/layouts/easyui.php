<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use bases\lib\Url;

\common\assets\JQueryAsset::register($this);
\erp\assets\CommonAsset::register($this);
\erp\assets\CoreAsset::register($this);
\common\assets\BootstrapAsset::register($this);
\common\assets\UBoxAsset::register($this);
\common\assets\EasyuiAsset::register($this);

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


<?php /*$this->endBody()*/ ?>
</body>
</html>
<?php $this->endPage() ?>
