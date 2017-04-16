<?php

use bases\lib\Url;
$this->title = '分类列表';
?>
<style type="text/css">
        .ftitle{
                font-size:14px;
                font-weight:bold;
                padding:5px 0;
                margin-bottom:10px;
                border-bottom:1px solid #ccc;
        }
        .fitem{
                margin-bottom:5px;
        }
        .fitem label{
                display:inline-block;
                width:80px;
        }
        .fitem input{
            width:200px;
        }
</style>
<div class="easyui-panel" style="width:100%;padding:10px;height: 90%" buttons="#dlg-buttons">
    <div style="margin-left: auto;margin-right: auto;">
        <div class="ftitle">添加分类信息</div>
        <form class="J-CategoryFrom">
            <div class="col-xs-8">
            <input name="id" type="hidden" value="0">
            <div class="fitem">
                <label>名 称:</label>
                <input name="name" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>父 级:</label>
                <input class="easyui-combotree" name="pid" <?php if(isset($pid) && $pid){ echo 'value="'.$pid.'"';}else{ echo 'value="0"'; } ?> data-options="url:'<?php echo Url::to(['category/get-combobox-list']) ?>',method:'get',required:true">
            </div>
             <div class="fitem">
                <label>排序:</label>
                <input name="sort_order" value="50" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>关键字:</label>
                <input name="keywords" class="easyui-textbox" required="true">
            </div>
            <div class="fitem">
                <label>描 述:</label>
                <input class="easyui-textbox" name="desc" data-options="multiline:true"  style="width:300px;height:100px">
            </div>
           
            <div class="fitem">
                <label>图片:</label>
                <button type="button" class="J-uploadImages btn btn-info">分类图片</button>
            </div>
            <div class="fitem">
                <label>状态:</label>
                <div class="easyui-radio">
                    <input type="radio" name="status" value="0" style="width:20px;">禁用
                        <input type="radio" name="status" value="1" style="width:20px;" checked>正常
                </div>
            </div>
            </div>
            <div class="col-xs-4 J-showImageD">            
            </div>
        </form>
    </div>	
</div>
<div id="dlg-buttons" style="margin-top: 10px; margin-left: 10px;">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok"  style="width:90px" onclick="btnAction()">保存</a>
</div>

<script>
    function addPic(pic){
        var htmlStr = '<div class="fitem J-showImage" style="margin-top: 105px;margin-left: -15px;">\
                    <input type="hidden" name="img" value="'+ pic +'"/>\
                    <img src="'+ App.url.resource + pic + '" width="200" height="150"/>\
                </div>';
        $('.J-showImageD').html(htmlStr);
    }

    var url = "<?php echo Url::to(['category/add-category']);?>";
    <?php if(isset($aData) && $aData){?>
        $('.J-CategoryFrom').form('load',<?php echo \yii\helpers\Json::encode($aData);?>);
            url = "<?php echo Url::to(['category/editor-category']);?>";
            addPic("<?php echo $aData['img'];?>");
    <?php }?>
    function btnAction(){
        ajaxForm($('.J-CategoryFrom'),url,function(aResult){
            if (aResult.status == 1) {
                 windowsClose();
                $('#J-showCategoryList').treegrid('reload');
            }
        });
    }
    
    //图片上传
    ajaxUpload($('.J-uploadImages'),"<?php echo Url::to(['category/upload-file']); ?>",'image',function(aData){
        addPic(aData.data);
    });
    
</script>

