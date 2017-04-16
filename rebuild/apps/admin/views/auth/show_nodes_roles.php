<?php

use bases\lib\Url;
?>
<div class="wrapper">
    <div class="row">
        <div class="col-lg-12">

            <div class="ibox">
                <div class="ibox-title">
                    <h5>系统权限</h5>
                </div>
            </div>
            <link href="http://xzzx24.dev/static/plugs/ztree/css/style.css" rel="stylesheet" type="text/css"/>
            <script src="http://xzzx24.dev/static/plugs/ztree/jquery.ztree.min.js" type="text/javascript"></script>
            <ul id="zTree" class="ztree loading"><li style="height:100px;" class="loading-background"></li></ul>
            <style>
                ul.ztree li span.button.switch{margin-right:5px}
                ul.ztree ul ul li{display:inline-block;white-space:normal}
                ul.ztree>li>ul>li{padding:5px}
                ul.ztree>li{background: #dae6f0}
                ul.ztree>li:nth-child(even)>ul>li:nth-child(even){background: #eef5fa}
                ul.ztree>li:nth-child(even)>ul>li:nth-child(odd){background: #f6fbff}
                ul.ztree>li:nth-child(odd)>ul>li:nth-child(even){background: #eef5fa}
                ul.ztree>li:nth-child(odd)>ul>li:nth-child(odd){background: #f6fbff}
                ul.ztree>li>ul{margin-top:12px}
                ul.ztree>li{padding:15px;padding-right:25px}
                ul.ztree li{white-space:normal!important}
                ul.ztree>li>a>span{font-size:15px;font-weight:700}
            </style>
            <script>
                $(function () {
                    function showTree() {
                        this.data = {};
                        this.ztree = null;
                        this.setting = {
                            view: {showLine: false, showIcon: false, dblClickExpand: false},
                            check: {enable: true, nocheck: false, chkboxType: {"Y": "ps", "N": "ps"}},
                            callback: {
                                beforeClick: function (treeId, treeNode) {
                                    if (treeNode.level === 2) {
                                        window.role_form.ztree.checkNode(treeNode, !treeNode.checked, null, true);
                                    } else {
                                        window.role_form.ztree.expandNode(treeNode);
                                    }
                                    return false;
                                }
                            }
                        };
                        this.listen();
                    }
                    showTree.prototype = {
                        constructor: showTree,
                        listen: function () {
                            this.getData(this);
                        },
                        getData: function (self) {
                            $.msg.loading();
                            $.get('<?php echo Url::to(['auth/nodes-get-ztree', 'id' => (int) Yii::$app->request->get('id', 0)]); ?>', {}, function (ret) {
                                $.msg.close();
                                if (ret.status != 1) {
                                    $.msg.auto(ret);
                                }
                                var checked = ret.data.check;
                                function renderChildren(data) {
                                    var childrenData = new Array();
                                    for (var i in data) {
                                        var children = {};
                                        children.open = false;
                                        children.node = data[i].node;
                                        children.name = data[i].title;
                                        children.rid = data[i].id;
                                        for (var j in checked) {
                                            if (checked[j] === data[i].node) {
                                                children.checked = true;
                                                break;
                                            }
                                        }
                                        children.children = renderChildren(data[i]._sub_);
                                        childrenData.push(children);
                                    }
                                    return childrenData;
                                }
                                var treeData = renderChildren(ret.data.nodes);
                                self.data = treeData;
                                self.showTree();
                            }, 'JSON');
                        },
                        showTree: function () {
                            this.ztree = jQuery.fn.zTree.init(jQuery("#zTree"), this.setting, this.data);
                        },
                        submit: function ($) {
                            var data = this.ztree.getCheckedNodes(true);
                            var nodes = [];
                            for (var i in data) {
                                (data[i].rid) && nodes.push(data[i].rid);
                            }
                            jQuery.form.load('<?php echo Url::to(["auth/auth-rule", 'id' => (int) Yii::$app->request->get('id', 0)]); ?>', {nodes: nodes}, 'POST');
                        }
                    };
                    window.role_form = new showTree();
                    $('[data-submit-role]').on('click', function () {
                        window.role_form.submit();
                    });
                });
            </script>
            <div class="form-group">
                <div class="col-sm-12 text-center">
                    <button data-submit-role type="submit" class="btn btn-success navbar-btn">保存数据</button>
                    <button data-back type="button" class="btn btn-warning navbar-btn">返　　回</button>
                </div>
            </div>

        </div>
    </div>
</div>