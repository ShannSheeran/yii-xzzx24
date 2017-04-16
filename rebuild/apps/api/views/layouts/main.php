<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use bases\lib\Url;

\common\assets\JQueryAsset::register($this);
\admin\assets\CommonAsset::register($this);
\admin\assets\CoreAsset::register($this);
\common\assets\BootstrapAsset::register($this);
\common\assets\UBoxAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <script>window.APP_URL = "<?php echo Yii::$app->urlManagerAdmin->baseUrl;?>"; window.ROOT_URL = '<?php echo Yii::$app->urlManagerApi->baseUrl;?>'; window.RESOURCE_URL = "<?php echo Yii::getAlias('@r.url') ?>"</script>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div class="wrap">
    <div class="container">
        <?= $content ?>
    </div>
</div>

<footer class="footer">

</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
