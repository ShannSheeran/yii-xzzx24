<?php
/* @var $this View */
/* @var $content string */

use admin\assets\CoreAsset;
use admin\assets\LayuiAsset;
use admin\assets\UmeditorAsset;
use admin\widgets\Layui;
use common\assets\JQueryAsset;
use yii\helpers\Html;
use yii\web\View;

JQueryAsset::register($this);
CoreAsset::register($this);
LayuiAsset::register($this);
UmeditorAsset::register($this);

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
        <script>window.APP_URL = "<?php echo Yii::$app->urlManagerAdmin->baseUrl;?>"; window.ROOT_URL = '<?php echo Yii::$app->urlManagerAdmin->baseUrl;?>'; window.RESOURCE_URL = "<?php echo Yii::getAlias('@r.url') ?>"</script>
        <?php $this->head() ?><?php $this->endBody() ?>
    </head>
    <body>
<?php $this->beginBody() ?>
        <?php if(Yii::$app->controller->id == 'login' || Yii::$app->controller->action->id == 'change-password'){ ?>
            <?php echo $content ?>
        <?php }else{ ?>
        <?php echo Layui::widget(); ?>
        <div class="framework-container layer-main-container">
            <?php echo $content ?>
        </div>
    </div>
        <?php } ?>
        <div class="hide"></div>
    </body>
</html>
<?php $this->endPage() ?>
