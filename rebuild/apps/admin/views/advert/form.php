<?php

use admin\controllers\AdvertController;
use admin\widgets\SelectGenerater;
use bases\lib\Url;
?>
<div class="wrapper">

    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5><?php echo Yii::$app->request->get('id', 0) ? '编辑' : '添加'; ?></h5>
                </div>
                <div class="ibox-content fadeInUp animated">

                    <form onsubmit="return false;" data-callback='_optCallBack' data-auto action="<?php echo Yii::$app->request->url; ?>" class='form-horizontal' style='padding-top:20px'>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">广告标题</label>
                            <div class='col-sm-8'>
                                <input required placeholder="广告标题" title="广告标题" invalid_msg="广告标题" name="title" value='<?php echo isset($aData['title']) ? $aData['title'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>                       
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">所属游戏</label>
                            <div class='col-sm-8'>
                                <?php 
                                    echo SelectGenerater::widget([
                                        'dataClass' => AdvertController::className(), 
                                        'method' => 'getAppList',
                                        'aHtmlAttr'=>[
                                            'name'=>'app_id',
                                            'value'=>isset($aData['app_id']) ? $aData['app_id'] : '',
                                            'placeholder' => '所属游戏',
                                            'class' => 'form-control input-sm',
                                            'required'=>''
                                        ],
                                        ]);
                                    ?>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">图片</label>
                            <div class='col-sm-8'>
                                    <input type="hidden" name="img" onchange="$(this).next('img').attr('src', this.value + '?imageView2/1/w/600/h/360/interlace/1');" value="<?php echo isset($aData['img']) ? $aData['img'] : ''; ?>">
                                    <img style="width:200px;height:120px;cursor: pointer" data-file="" data-one="true" data-type="image" data-save_path="advert" data-field="img" src="<?php echo isset($aData['img']) ? $aData['img'] : Yii::getAlias('@r.url').'/static/plugin/uploader/theme/image.png'; ?>">
                                    <p class="help-block m-b-none">封面(640*320，100kb)</p>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
<!--                        <div class="form-group">
                            <label class="col-sm-2 control-label">广告链接</label>
                            <div class='col-sm-8'>
                                <input required placeholder="广告链接" title="广告链接" invalid_msg="广告链接" name="link" value='<?php echo isset($aData['link']) ? $aData['link'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>                        -->
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">下载链接</label>
                            <div class='col-sm-8'>
                                <input required placeholder="下载链接" title="下载链接" invalid_msg="下载链接" name="download_link" value='<?php echo isset($aData['download_link']) ? $aData['download_link'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>                        
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">开始时间</label>
                            <div class='col-sm-8'>
                                <input onclick="var $this = this;
                                            layui.use('laydate', function () {
                                                layui.laydate({elem: $this, istime: true, max: laydate.now(+1), format: 'YYYY-MM-DD hh:mm:ss', min: ''});
                                            });" placeholder="开始时间" title="开始时间" invalid_msg="开始时间" name="start_time" value='<?php echo isset($aData['start_time']) ? date('Y-m-d H:i:s', $aData['start_time']) : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">结束时间</label>
                            <div class='col-sm-8'>
                                <input onclick="var $this = this;
                                            layui.use('laydate', function () {
                                                layui.laydate({elem: $this, istime: true, max: laydate.now(+1), format: 'YYYY-MM-DD hh:mm:ss', min: ''});
                                            });" placeholder="结束时间" title="结束时间" invalid_msg="结束时间" name="end_time" value='<?php echo isset($aData['end_time']) ? date('Y-m-d H:i:s', $aData['end_time']) : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">状态</label>
                            <div class='col-sm-8'>
                                <select class="input-sm form-control" value='<?php echo isset($aData['status']) ? $aData['status'] : ''; ?>' name="status" placeholder="游戏状态">
                                    <option value="0" <?php if(isset($aData['status']) && $aData['status'] == 0){ echo "selected='selected';"; } ?>>启用</option>
                                    <option value="3" <?php if(isset($aData['status']) && $aData['status'] == 3){ echo "selected='selected';"; } ?>>禁用</option>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">描述</label>
                            <div class='col-sm-8'>
                                <input required placeholder="描述" title="描述" invalid_msg="描述" name="desc" value='<?php echo isset($aData['desc']) ? $aData['desc'] : ''; ?>' type="text" class="form-control input-sm">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">广告内容</label>
                            <div class='col-sm-8'>
                                <script class="J-detail" name="content" type="text/plain" style="height:300px;width:100%;"></script>
                                <div class="J-x-content-detail" style="display: none"><?php echo isset($aData['content']) ? $aData['content'] : ''; ?></div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <div class='row'>
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary navbar-btn">保存数据</button>
                                    <button data-back type="button" class="btn btn-warning navbar-btn">&nbsp&nbsp&nbsp返&nbsp回&nbsp&nbsp&nbsp</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>

</div>
<script>
    _optCallBack = function (ret, res) {
        if (ret.status !== 1) {

        }
        return true;
    };
    $(function () {
        $('input[name="icon"]').change();

    });
    
    //编辑器
require(['ueditor'], function () { 
    createEditor('.J-detail', {
            imageUrl : '<?php echo Url::to(['plugs/upload-file']); ?>',
            imagePath : '<?php echo Yii::getAlias('@r.url'); ?>/',
            imageFieldName : 'image'
    }).ready(function() {
       this.setContent($('.J-x-content-detail').html());
       $('.J-x-content-detail').remove();
    });
});
        
</script>

