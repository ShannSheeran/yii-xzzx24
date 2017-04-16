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
				<h1>app接口测试</h1>
			</div>
		</center>
		<br />
		<br />
		<div class="form-group form-body">
			<button type="button" class="btn btn-lg btn-primary" onclick="test(this);">app测试</button>
			<button type="button" class="btn btn-lg btn-primary" onclick="testWithdrawals(this);">app提现个人测试</button>
			<button type="button" class="btn btn-lg btn-primary" onclick="testWithdrawalsGh(this);">app提现公会测试</button>
		</div>
		<div class="form-group form-body" style="margin-top: 10px;">
			<button type="button" class="btn btn-lg btn-primary" onclick="testGetGrCount(this);">app获取个人提现金额测试</button>
			<button type="button" class="btn btn-lg btn-primary" onclick="testGetGhCount(this);">app获取公会提现金额测试</button>
                </div>
		<div class="form-group form-body" style="margin-top: 10px;">			
                        <button type="button" class="btn btn-lg btn-primary" onclick="testGetTxGrRecord(this);">app获取个人提现历史测试</button>
			<button type="button" class="btn btn-lg btn-primary" onclick="testGetTxGhRecord(this);">app获取公会提现历史测试</button>
		</div>
		<div class="form-group form-body" style="margin-top: 10px;">			
                        <button type="button" class="btn btn-lg btn-primary" onclick="testGetAdLabel(this);">app红人获取广告不限标签</button>
		</div>
	</form>
</div>

<script type="text/javascript">
	var aParams = <?php echo json_encode($aReturn); ?>;
        function testWithdrawals(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'newApp=1&org_id=223&method=Center-game_withdrawals&type=personal&rednet_id=2875&appkey=E9EE4EA53791FDD6CAA4909019AAE7EE',
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
        function testWithdrawalsGh(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'newApp=1&org_id=223&method=Center-game_withdrawals&type=company&rednet_id=2875&appkey=E9EE4EA53791FDD6CAA4909019AAE7EE',
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
        function testGetGrCount(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'newApp=1&org_id=223&method=Center-Bill_game&type=personal&rednet_id=2875&appkey=E9EE4EA53791FDD6CAA4909019AAE7EE',
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
        function testGetGhCount(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'newApp=1&org_id=223&method=Center-Bill_game&type=company&rednet_id=2875&appkey=E9EE4EA53791FDD6CAA4909019AAE7EE',
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
        function testGetTxGrRecord(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'appkey=E9EE4EA53791FDD6CAA4909019AAE7EE&newApp=1&org_id=223&method=Center-billRecordAgame&rednet_id=2875&type=personal&page=1',
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
        function testGetTxGhRecord(o){
            ajax({
                url : 'http://xzzx24.dev/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'appkey=E9EE4EA53791FDD6CAA4909019AAE7EE&newApp=1&org_id=223&method=Center-billRecordAgame&rednet_id=2875&type=company&page=1',
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
        function testGetAdLabel(o){
            ajax({
                url : 'https://www.xzzx24.com/index.php/api-input-entrance?projectNameBase=%E5%B0%8F%E4%B8%BB%E5%9C%A8%E7%BA%BF&versionBase=1&pageIndex=0&pageSize=0',
                data : 'newApp=1&red_id=2875&method=Advert-getActivity&type=all&appkey=E9EE4EA53791FDD6CAA4909019AAE7EE&page=1',
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