<?php 
use bases\lib\Url;
$this->setTitle('api');
?>
<style type="text/css">
	.form-body{
		width: 600px;
		margin:0 auto;
	}
</style>
<div class="mainOut">
	<form role="form">
		<center>
			<div class="panel-heading">
				<h1>接口测试</h1>
			</div>
		</center>
		<br />
		<br />
		<div class="form-group form-body">
			<button type="button" class="btn btn-lg btn-primary" onclick="test(this);">测试</button>
		</div>
	</form>
</div>

<script type="text/javascript">
	var aParams = <?php echo json_encode($aReturn); ?>;
	function test(o){
		ajax({
			url : '<?php echo Url::to(['api/index']); ?>',
			data : aParams,
			beforeSend : function(){
				$(o).attr('disabled', 'disabled');
			},
			complete : function(){
				$(o).attr('disabled', false);
			},
			success : function(aResult){
				UBox.show(aResult.msg, aResult.status);
				console.log(aResult);
				console.log(JSON.stringify(aResult));
			}
		});
	}
        //jsonp返回示例
        function testJsonp(o){
            ajax({
                    url : '<?php echo Url::to(['api/index']); ?>',
                    data : aParams,
                    dataType:'jsonp',
                    beforeSend : function(){
                            $(o).attr('disabled', 'disabled');
                    },
                    complete : function(){
                            $(o).attr('disabled', false);
                    },
                    success : function(aResult){
                            UBox.show(aResult.msg, aResult.status);
                            console.log(aResult);
                    }
            });
        }
        

	$(function(){
		
	});
</script>