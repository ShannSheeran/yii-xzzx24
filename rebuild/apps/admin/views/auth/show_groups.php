<div class="wrapper wrapper-content">
    
        <div class="row">
            <div class="col-lg-12">
                
                    <div class="ibox-title">
                        <h5 class='pull-left'>系统权限</h5>
                        <div class='pull-right'>
                            
                                
            <button class="btn btn-white btn-sm navbar-btn" data-add-role><i class="glyphicon glyphicon-plus"></i> 添加权限</button>
        <script>
            $(function() {
                $('[data-add-role]').on('click', function() {
                    layer.prompt({
                        title: '请输入角色名'
                    }, function(name) {
                        if (name.length >= 1) {
                            $.msg.loading();
                            $.form.load('http://xzzx24.dev/index.php/admin/role/add.html', {name: name}, 'POST');
                        }
                    });
                });
            });
        </script>
                <script>
            $(function() {
                $('[data-edit-role]').on('click', function() {
                    var self = this;
                    layer.prompt({
                        value: self.getAttribute('data-value'),
                        title: '请输入角色名称'
                    }, function(name) {
                        if (name === self.getAttribute('data-value')) {
                            $.msg.tips('内容没有发生改变！');
                        } else if (name.length >= 1) {
                            $.msg.loading();
                            $.form.load('http://xzzx24.dev/index.php/admin/role/edit.html', {id: self.getAttribute('data-edit-role'), name: name}, 'POST');
                        } else {
                            return $.msg.tips('请输入角色名称！'), false;
                        }
                    });
                });

                //双击便捷操作
                $('tbody tr').on('dblclick', function() {
                    $(this).find('.getedit').trigger('click');
                });

            });
        </script>
                <button class="btn btn-white btn-sm navbar-btn" data-update data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html'><i class="glyphicon glyphicon-eye-close"></i> 批量禁用权限</button>
                <button class="btn btn-white btn-sm navbar-btn" data-update data-field='status' data-value='1' data-action='http://xzzx24.dev/index.php/admin/role/resume.html'><i class='glyphicon glyphicon-eye-open'></i> 批量启用权限</button>
    
                            							
                        </div>
                    </div>
                    <div class="ibox-content fadeInUp animated">
                        <form class='animated form-search' onsubmit="return false;" data-form-href action="http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1" method="GET">
                            
                            
                        </form>
                        
    <table class="table table-hover table-center">
        <thead>
            <tr>
                <th class='list-table-check-td'><input data-none-auto data-check-target='.list-check-box' type='checkbox'/></th>
                <th>权限名称</th>
                <th>添加时间</th>
                <th>当前状态</th>
                <th class='text-right'>操作</th>
            </tr>
        </thead>
        <tbody>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='1' class='list-check-box' type='checkbox'/></td>
                    <td>代理商</td>
                    <td>2016-08-30 12:47:43</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="1" data-value="代理商" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=1" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="1" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='2' class='list-check-box' type='checkbox'/></td>
                    <td>广告主</td>
                    <td>2016-11-03 14:35:21</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="2" data-value="广告主" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=2" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="2" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='3' class='list-check-box' type='checkbox'/></td>
                    <td>系统管理员</td>
                    <td>2016-11-03 14:36:03</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="3" data-value="系统管理员" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=3" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="3" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='4' class='list-check-box' type='checkbox'/></td>
                    <td>财务</td>
                    <td>2016-11-29 19:16:15</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="4" data-value="财务" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=4" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="4" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='5' class='list-check-box' type='checkbox'/></td>
                    <td>静英权限-临时</td>
                    <td>2016-12-23 10:36:59</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="5" data-value="静英权限-临时" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=5" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="5" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='6' class='list-check-box' type='checkbox'/></td>
                    <td>文慧的临时权限</td>
                    <td>2016-12-23 20:07:38</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="6" data-value="文慧的临时权限" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=6" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="6" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='7' class='list-check-box' type='checkbox'/></td>
                    <td>红人审核</td>
                    <td>2016-12-23 20:11:23</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="7" data-value="红人审核" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=7" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="7" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='8' class='list-check-box' type='checkbox'/></td>
                    <td>运营总监</td>
                    <td>2017-01-03 11:03:08</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="8" data-value="运营总监" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=8" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="8" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
                            <tr>
                    <td class='list-table-check-td'><input data-none-auto value='9' class='list-check-box' type='checkbox'/></td>
                    <td>国栋</td>
                    <td>2017-01-05 15:18:03</td>
                    <td>
                                                    <span style="color:#090">使用中</span>
                                            </td>
                    <td class="text-right">
                                                    <span class="text-explode">|</span>
                            <a class="getedit" data-edit-role="9" data-value="国栋" href="javascript:void(0)">编辑</a>
                                                                            <span class="text-explode">|</span>
                            <a data-open="http://xzzx24.dev/index.php/admin/role/auth.html?id=9" href="javascript:void(0)">授权</a>
                                                                            <span class="text-explode">|</span>
                            <a data-update="9" data-field='status' data-value='0' data-action='http://xzzx24.dev/index.php/admin/role/forbid.html' href="javascript:void(0)">禁用</a>
                                            </td>
                </tr>
            
        </tbody>
    </table>

                                                    <div>
	<div class="dataTables_info pull-left block nowrap" style="line-height:28px">
		共9条记录,已显示1/1页,每页 <select onchange="$.form.open(this.options[this.selectedIndex].value)"><option value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=10'>10</option><option selected value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=20'>20</option><option value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=30'>30</option><option value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=50'>50</option><option value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=80'>80</option><option value='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=100'>100</option></select> 条记录.</a>
	</div>
	<ul style="margin:0" class="pagination pull-right"><li><a style='font-family:"宋体"' onclick='return false' data-page-href  href='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=20'>&lt;</a></li>  <li class='active'><a>1</a></li> <li><a style='font-family:"宋体"' onclick='return false' data-page-href  href='http://xzzx24.dev/index.php/admin/role/index.html?spm=m-3-28&page=1&rows=20'>&gt;</a></li></ul>
	<div style="clear:both"></div>
</div>
                                            </div>
                </div>
            
        </div>
    </div>





</div>





