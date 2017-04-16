<?php 
use bases\lib\Url;
use admin\widgets\Table;
use admin\widgets\ModuleNavi;
use yii\widgets\LinkPager;
$this->setTitle('广告位分类');
$this->registerAssetBundle('common\assets\AjaxUploadAsset');
?>
<div class="row">
	<?php echo ModuleNavi::widget([
		'aMenus' => [
			[
				'title' => '广告位图片',
				'url' => Url::to(['advertisement/show-manage-advertisement']),
			],
			[
				'title' => '广告位分类',
				'url' => Url::to(['advertisement/show-list']),
			],
			[
				'title' => $aAdvertisementCatalog ? '编辑广告位分类' : '添加广告位分类',
				'url' => Url::to(['advertisement/show-edit']),
				'active' => true,
			],
		],
	]); ?>
	<div class="col-lg-12">
		<h1 class="page-header"><?php echo $aAdvertisementCatalog ? '编辑广告位分类' : '添加广告位分类'; ?></h1>
	</div>
</div>

<div class="row">
	<div class="col-lg-12">
		<div class="form-group">
			<input class="J-id form-control" type="hidden" value="<?php echo $aAdvertisementCatalog ? $aAdvertisementCatalog['id'] : ''; ?>">
			<label>分类名称</label>
			<input class="J-name form-control" placeholder="分类名称" value="<?php echo $aAdvertisementCatalog ? $aAdvertisementCatalog['name'] : ''; ?>">
			<br />
		</div>
		<div class="form-group">
			<button type="button" class="J-save-btn btn btn-primary" onclick="save(this);">保存</button>
		</div>
	</div>
</div>
<script type="text/javascript">
	function save(o){
		var id = $('.J-id').val();
		var name = $('.J-name').val();
		if(name == ''){
			UBox.show('请填写分类名称', -1);
			return;
		}
		ajax({
			url : '<?php echo Url::to(['advertisement/save']); ?>',
			data : {
				id : id,
				name : name
			},
			beforeSend : function(){
				$(o).attr('disabled', 'disabled');
			},
			complete : function(){
				$(o).attr('disabled', false);
			},
			success : function(aResult){
				if(aResult.status == 1){
					UBox.show(aResult.msg, aResult.status, function(){
						location.href = '<?php echo Url::to(['advertisement/show-list']); ?>';
					}, 3);
				}else{
					UBox.show(aResult.msg, aResult.status);
				}
			}
		});
	}
	$(function(){
		
	});
</script>