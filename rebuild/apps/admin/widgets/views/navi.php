<?php 
use bases\lib\Url;
?>
<!-- Navigation -->
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	<!-- Brand and toggle get grouped for better mobile display -->
	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
		<a class="navbar-brand" href="index.html">
			<?php if($role == 'manager'){ ?>
				后台管理
			<?php } ?>
		</a>
	</div>
	<!-- Top Menu Items -->
	<ul class="nav navbar-right top-nav">
		<li class="dropdown">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <?php echo $aUser['name']; ?> <b class="caret"></b></a>
			<ul class="dropdown-menu">
				<li>
					<a href="#"><i class="fa fa-fw fa-user"></i> Profile</a>
				</li>
				<li>
					<a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>
				</li>
				<li>
					<a href="#"><i class="fa fa-fw fa-gear"></i> Settings</a>
				</li>
				<li class="divider"></li>
				<li>
					<a href="<?php echo Url::to(['manager/logout']); ?>"><i class="fa fa-fw fa-power-off"></i> 退出</a>
				</li>
			</ul>
		</li>
	</ul>
	<!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
	<div class="collapse navbar-collapse navbar-ex1-collapse">
		<ul class="nav navbar-nav side-nav">
		<?php 
			$controllerId = Yii::$app->controller->id;
			$actionId = Yii::$app->controller->action->id;
			foreach($aMenuConfig as $key => $aValue){ 
				$hasChild = false;
				$isCurrent = false;
				$isChildCurrent = false;
				if($aValue['child']){
					$hasChild = true;
					foreach($aValue['child'] as $k => $aChild){
						if(isset($aChild['url']) && $controllerId . '/' . $actionId == $aChild['url'][0]){
							$isChildCurrent = true;
							break;
						}
					}
				}
				if(isset($aValue['url']) && $controllerId . '/' . $actionId == $aValue['url'][0]){
					$isCurrent = true;
				}
				$cls = '';
				if($isChildCurrent){
					$cls = 'collapsed in';
				}
		?>
			<li class="<?php echo $isCurrent ? 'active' : ''; ?>">
				<a <?php echo !$hasChild ? 'href="' . Url::to($aValue['url']) . '"' : 'href="javascript:;" data-toggle="collapse" data-target="#' . $aValue['en_title'] . '"'; ?>><i class="fa fa-fw fa-<?php echo $aValue['icon_class']; ?>"></i> <?php echo $aValue['title']; ?></a>
				<?php if($hasChild){ ?>
					<ul id="<?php echo $aValue['en_title']; ?>" class="collapse <?php echo $cls; ?>">
					<?php 
						foreach($aValue['child'] as $k => $aChild){ 
							$activeCls = '';
							if(isset($aChild['url']) && $controllerId . '/' . $actionId == $aChild['url'][0]){
								$activeCls = 'active';
							}
					?>
						<li>
							<a class="<?php echo $activeCls; ?>" href="<?php echo Url::to($aChild['url']); ?>"><i class="fa fa-fw fa-<?php echo $aChild['icon_class']; ?>"></i> <?php echo $aChild['title']; ?></a>
						</li>
					<?php } ?>
					</ul>
				<?php } ?>
			</li>
		<?php } ?>
		</ul>
	</div>
	<!-- /.navbar-collapse -->
</nav>
<script type="text/javascript">

</script>