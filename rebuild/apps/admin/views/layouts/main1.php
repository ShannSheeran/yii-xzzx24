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

<?php if(Yii::$app->controller->id == 'login'){ ?>
	<div id="page-wrapper">
		<?= $content ?>
	</div>
<?php }else{ ?>
	<div id="wrapper">
		<div class="container-fluid">
			<?php echo \admin\widgets\Navi::widget(); ?>
		</div>
		<div id="page-wrapper">
			<div class="container-fluid">
				<?= $content ?>
			</div>
		</div>
		<!-- /#page-wrapper -->
	</div>
<?php } ?>

<footer class="footer">

</footer>

<?php /*$this->endBody()*/ ?>
</body>
</html>
<?php $this->endPage() ?>
