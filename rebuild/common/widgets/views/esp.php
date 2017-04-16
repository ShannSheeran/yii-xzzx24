<?php \common\assets\EsAsset::register($this); ?>
<script type="text/javascript">
$(function(){
	Esp.config({
		imageBaseUrl : '<?php echo Yii::getAlias('@r.url'); ?>'
	});
});
</script>