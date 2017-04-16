<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use bases\lib\Url;

\common\assets\JQueryAsset::register($this);
\admin\assets\LayuiAsset::register($this);
\admin\assets\CoreAsset::register($this);
\common\assets\BootstrapAsset::register($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?><?php $this->endBody() ?>
</head>
<body>
<?php $this->beginBody() ?>
<?= $content ?>

<?php  ?>
</body>
</html>
<?php $this->endPage() ?>
